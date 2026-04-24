#!/bin/bash

# Security Vulnerability Scanning Script
# This script runs multiple security scans on your application

set -e  # Exit on error

echo "🔒 Security Vulnerability Scanner"
echo "=================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
TARGET_URL="${1:-http://localhost:3000}"
REPORTS_DIR="security-reports"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Create reports directory
mkdir -p "$REPORTS_DIR"

echo "📍 Target: $TARGET_URL"
echo "📁 Reports will be saved to: $REPORTS_DIR/"
echo ""

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Check if application is running
echo "1️⃣ Checking if application is accessible..."
if curl -s -o /dev/null -w "%{http_code}" "$TARGET_URL" | grep -q "200\|404"; then
    echo -e "${GREEN}✓ Application is accessible${NC}"
else
    echo -e "${RED}✗ Application is not accessible at $TARGET_URL${NC}"
    echo "Please start your application first."
    exit 1
fi
echo ""

# 2. Dependency Audit (if Node.js project)
if [ -f "package.json" ]; then
    echo "2️⃣ Running npm audit..."
    if command_exists npm; then
        npm audit --json > "$REPORTS_DIR/npm-audit-$TIMESTAMP.json" 2>&1 || true
        npm audit > "$REPORTS_DIR/npm-audit-text-$TIMESTAMP.txt" 2>&1 || true
        echo -e space"${GREEN}✓ Dependency audit complete${NC}"
    else
        echo -e "${YELLOW}⚠ npm not found, skipping dependency audit${NC}"
    fi
    echo ""
fi

# 3. OWASP ZAP Baseline Scan
echo "3️⃣ Running OWASP ZAP Baseline Scan..."
if command_exists docker; then
    echo "   This may take a few minutes..."
    docker run --rm \
        -v "$(pwd)/$REPORTS_DIR":/zap/wrk/:rw \
        -t owasp/zap2docker-stable \
        zap-baseline.py \
        -t "$TARGET_URL" \
        -J \
        -r "zap-baseline-$TIMESTAMP.json" \
        -w "zap-report-$TIMESTAMP.html" \
        -I \
        > "$REPORTS_DIR/zap-output-$TIMESTAMP.txt" 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ ZAP scan complete${NC}"
    else
        echo -e "${YELLOW}⚠ ZAP scan completed with warnings${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Docker not found. Install Docker to run ZAP scans:${NC}"
    echo "   brew install --cask docker"
    echo ""
    echo "   Alternatively, install OWASP ZAP desktop app:"
    echo "   brew install --cask owasp-zap"
fi
echo ""

# 4. Check for common security issues
echo "4️⃣ Checking for common security issues..."

# Check for exposed .env files
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠ Found .env file${NC}"
    echo "   Make sure it's in .gitignore and not committed to version control"
fi

# Check for exposed secrets in git history
if command_exists git; then
    if git config --get remote.origin.url > /dev/null 2>&1; then
        echo -e "${YELLOW}⚠ Make sure no sensitive data is in git history${NC}"
        echo "   Consider running: git secrets --scan-history"
    fi
fi
echo ""

# 5. HTTP Security Headers Check
echo "5️⃣ Checking security headers..."
if command_exists curl; then
    HEADERS_FILE="$REPORTS_DIR/security-headers-$TIMESTAMP.txt"
    curl -I "$TARGET_URL" > "$HEADERS_FILE" 2>&1 || true
    
    # Check for important headers
    if grep -q "X-Frame-Options" "$HEADERS_FILE"; then
        echo -e "${GREEN}✓ X-Frame-Options header present${NC}"
    else
        echo -e "${YELLOW}⚠ Missing X-Frame-Options header${NC}"
    fi
    
    if grep -q "X-Content-Type-Options" "$HEADERS_FILE"; then
        echo -e "${GREEN}✓ X-Content-Type-Options header present${NC}"
    else
        echo -e "${YELLOW}⚠ Missing X-Content-Type-Options header${NC}"
    fi
    
    if grep -q "Strict-Transport-Security" "$HEADERS_FILE"; then
        echo -e "${GREEN}✓ HSTS header present${NC}"
    else
        echo -e "${YELLOW}⚠ Missing HSTS header (needed for HTTPS)${NC}"
    fi
    
    if grep -q "Content-Security-Policy" "$HEADERS_FILE"; then
        echo -e "${GREEN}✓ CSP header present${NC}"
    else
        echo -e "${YELLOW}⚠ Missing Content-Security-Policy header${NC}"
    fi
fi
echo ""

# 6. Generate Summary Report
echo "6️⃣ Generating summary report..."
SUMMARY_FILE="$REPORTS_DIR/scan-summary-$TIMESTAMP.txt"

cat > "$SUMMARY_FILE" << EOF
Security Scan Summary
=====================
Date: $(date)
Target: $TARGET_URL
Reports Directory: PATREPORTS_DIR/

Scans Performed:
1. Dependency Audit (npm audit)
2. OWASP ZAP Baseline Scan
3. Security Headers Check
4. Common Security Issues Check

Generated Files:
EOF

ls -lh "$REPORTS_DIR"/*-$TIMESTAMP.* 2>/dev/null | awk '{print $9}' >> "$SUMMARY_FILE" || true

echo "" >> "$SUMMARY_FILE"
echo "Next Steps:" >> "$SUMMARY_FILE"
echo "1. Review all generated reports in $REPORTS_DIR/" >> "$SUMMARY_FILE"
echo "2. Address high and critical severity findings immediately" >> "$SUMMARY_FILE"
echo "3. Fix medium and low severity issues in next iteration" >> "$SUMMARY_FILE"
echo "4. Add missing security headers (use Helmet.js for Node.js)" >> "$SUMMARY_FILE"
echo "5. Enable compression for static assets" >> "$SUMMARY_FILE"
echo "6. Investigate any 500 errors found in ZAP scan" >> "$SUMMARY_FILE"

echo -e "${GREEN}✓ Summary report generated${NC}"
echo ""

# Display summary
cat "$SUMMARY_FILE"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Security scan complete!${NC}"
echo ""
echo "📊 View all reports in: $REPORTS_DIR/"
echo ""
echo "Đang kiểm tra các kết quả quan trọng..."

# Display any high-severity findings
if [ -f "$REPORTS_DIR/zap-baseline-$TIMESTAMP.json" ]; then
    if command_exists jq; then
        echo ""
        echo "🔴 High/Critical Findings:"
        jq -r '.site[] | .alerts[] | select(.risk == "High" or .risk == "Critical") | "- [\(.risk)] \(.name): \(.description)"' \
            "$REPORTS_DIR/zap-baseline-$TIMESTAMP.json" 2>/dev/null | head -10 || echo "None found"
    fi
fi

echo ""
echo "✨ Done!"

