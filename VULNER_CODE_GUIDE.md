# Vulnerability Scanning Guide

## Overview
This guide explains how to run vulnerability scans using tools like OWASP ZAP and interpret the results.

---

## 1. OWASP ZAP (Zed Attack Proxy)

### Installing OWASP ZAP

**On macOS:**
```bash
# Using Homebrew
brew install --cask owasp-zap

# Or download from: https://www.zaproxy.org/download/
```

**On Docker:**
```bash
docker pull owasp/zap2docker-stable
```

### Running OWASP ZAP

#### Method 1: Desktop Application
1. Open OWASP ZAP application
2. Click "Automated Scan" or "Manual Explore"
3. Enter your target URL (e.g., `http://localhost:3000`)
4. Click "Attack"

#### Method 2: Command Line (Headless Mode)
```bash
# Start ZAP daemon
docker run -d -p 8080:8080 owasp/zap2docker-stable zap.sh -daemon

# Run a spider scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# Run a full active scan (takes longer, more thorough)
docker run -t owasp/zap2docker-stable zap-full-scan.py -t http://localhost:3000

# Save report
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000 -r report.html
```

#### Method 3: CI/CD Integration
```bash
# Generate and save JSON report
docker run --rm -v $(pwd):/zap/wrk/:rw -t \
  owasp/zap2docker-stable zap-full-scan.py \
  -t http://localhost:3000 \
  -J \
  -r zap-report.json
```

### Understanding ZAP Scan Results

Your scan on `localhost:3000` showed:

| Finding | Count | Severity | Action Required |
|---------|-------|----------|-----------------|
| 404 Errors | 223 | Info | Normal - protected endpoints |
| 200 OK | 59 | Info | Verify these are legitimate |
| 400 Bad Request | 2 | Low | Add input validation |
| **500 Internal Server Error** | **2** | **High** | **Investigate immediately** |

---

## 2. Key Findings from Your Scan

### Critical Issues to Address

#### 1. 500 Internal Server Error (2 occurrences)
**Risk**: HIGH  
**Impact**: Could indicate unhandled exceptions or database errors

**How to Investigate:**
```bash
# Check server logs
tail -f /path/to/your/logs/server.log

# Search for error patterns
grep -i "error" logs/*.log
grep -i "exception" logs/*.log
```

**Common Causes:**
- Missing database connections
- Unhandled exceptions in API routes
- Authentication failures
- Null pointer exceptions

**Fix Example (Node.js/Express):**
```javascript
// Before (vulnerable)
app.get('/api/user/:id', (req, res) => {
  const user = database.findUser(req.params.id);
  res.json(user.details); // Could crash if user is null
});

// After (secure)
app.get('/api/user/:id', (req, res) => {
  try {
    const user = database.findUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.details);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

#### 2. Performance Issues (Slow Bundle.js)
**Risk**: MEDIUM  
**Impact**: Poor user experience, potential timeout attacks

**Fixes:**
```bash
# Enable gzip compression (Node.js)
npm install compression
```

```javascript
// app.js
const compression = require('compression');
app.use(compression());

// Set cache headers
app.use(express.static('public', {
  maxAge: '1d', // Cache for 1 day
  etag: true
}));

// Code splitting for React apps
// Use React.lazy() and dynamic imports
```

#### 3. 400 Bad Request (2 occurrences)
**Risk**: LOW  
**Impact**: Poor input handling

**Fix:**
```javascript
// Add input validation
const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

app.post('/api/login', (req, res) => {
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  // Process login...
});
```

---

## 3. Additional Vulnerability Scanning Tools

### A. Burp Suite
```bash
# Download Community Edition (free) from:
# https://portswigger.net/burp/communitydownload

# Run proxy on port 8080
# Configure browser to use proxy: localhost:8080
```

### B. Nikto (Web Server Scanner)
```bash
# Install
brew install nikto

# Run scan
nikto -h http://localhost:3000

# Save results
nikto -h http://localhost:3000 -o scan-results.html -Format htm
```

### C. SQL Injection Testing (sqlmap)
```bash
# Install
brew install sqlmap

# Test for SQL injection
sqlmap -u "http://localhost:3000/api/users?id=1" --batch
```

### D. Dependency Scanning (npm audit for Node.js)
```bash
# Check for vulnerable packages
npm audit

# Fix automatically
npm audit fix

# Generate detailed report
npm audit --json > audit-report.json
```

### E. OWASP Dependency-Check (Java, .NET, etc.)
```bash
# Install
brew install dependency-check

# Run scan
dependency-check --project "MyProject" --scan ./project-directory --format JSON
```

---

## 4. Vulnerability vs Policy Check

Based on your provided comparison:

| Aspect | Vulnerability Scan | Policy Check |
|--------|-------------------|--------------|
| **Focus** | Technical weaknesses | Administrative compliance |
| **Tools** | Nessus, Burp, ZAP, Nikto | Checklists, frameworks |
| **Output** | Vulnerabilities with severity | Compliance status |
| **Frequency** | Weekly/Monthly | Quarterly/Annually |
| **Goal** | Fix exploitable flaws | Ensure standards alignment |

### Recommended Workflow:
1. **Weekly**: Run automated vulnerability scans (ZAP, npm audit)
2. **Monthly**: Manual penetration testing with Burp Suite
3. **Quarterly**: Comprehensive policy and compliance audit
4. **After Major Releases**: Full security assessment

---

## 5. Automated Scanning Script

Create a file `scan.sh` for automated scanning:

```bash
#!/bin/bash

echo "🔍 Starting Vulnerability Scan Suite..."

# Start your application if not running
# npm start &

# Wait for app to start
sleep 5

# Run npm audit
echo "📦 Checking dependencies..."
npm audit --json > reports/npm-audit.json

# Run ZAP scan
echo "🕷️ Running OWASP ZAP scan..."
docker run --rm -v $(pwd)/reports:/zap/wrk/:rw -t \
  owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000 \
  -J \
  -r reports/zap-scan.json

# Run Nikto
echo "🔍 Running Nikto scan..."
nikto -h http://localhost:3000 -o reports/nikto-results.html

echo "✅ Scan complete! Check the reports/ directory"
```

Make it executable:
```bash
chmod +x scan.sh
./scan.sh
```

---

## 6. Continuous Integration Setup

### GitHub Actions Example

Create `.github/workflows/security-scan.yml`:

```yaml
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run npm audit
      run: npm audit --audit-level=moderate
    
    - name: Run OWASP ZAP Scan
      run: |
        docker run --rm -v $(pwd):/zap/wrk/:rw \
          owasp/zap2docker-stable zap-baseline.py \
          -t http://localhost:3000 \
          -J \
          -r zap-report.json
    
    - name: Upload ZAP report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: zap-report
        path: zap-report.json
```

---

## 7. Interpreting Scan Results

### Severity Levels

| Level | Risk | Response Time |
|-------|------|---------------|
| **Critical** | Immediate threat | Fix within 24 hours |
| **High** | Significant risk | Fix within 1 week |
| **Medium** | Moderate risk | Fix within 1 month |
| **Low** | Minor issue | Fix within next release |
| **Info** | Informational | Document and review |

### OWASP Top 10 (2021) to Check For:
1. **Broken Access Control** - Test authentication/authorization
2. **Cryptographic Failures** - Check for exposed secrets
3. **Injection** - SQL injection, XSS, command injection
4. **Insecure Design** - Architecture vulnerabilities
5. **Security Misconfiguration** - Default settings, exposed headers
6. **Vulnerable Components** - Outdated dependencies
7. **Auth/Authn Failures** - Weak passwords, session management
8. **Data Integrity Failures** - Insecure deserialization
9. **Logging/Monitoring Failures** - Insufficient logging
10. **SSRF** - Server-Side Request Forgery

---

## 8. Next Steps for Your Application

Based on your scan results:

### Immediate Actions:
1. ✅ **Investigate 500 errors** - Find the 2 endpoints causing crashes
2. ✅ **Enable compression** - Fix slow bundle.js loading
3. ✅ **Add input validation** - Handle 400 errors properly
4. ✅ **Set up monitoring** - Install error tracking (Sentry, LogRocket)
5. ✅ **Configure CORS** - Ensure proper CORS headers

### Short-term Improvements:
- Run active ZAP scan (not just baseline)
- Implement rate limiting
- Add security headers (Helmet.js for Node.js)
- Set up automated dependency scanning
- Configure Content Security Policy (CSP)

### Long-term Security:
- Implement Security Development Lifecycle (SDL)
- Regular penetration testing
- Security training for developers
- Compliance audits (if handling sensitive data)

---

## 9. Useful Resources

- **OWASP ZAP Documentation**: https://www.zaproxy.org/docs/
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CWE List**: https://cwe.mitre.org/
- **SANS Top 25**: https://www.sans.org/top25-software-errors/
- **npm Security Best Practices**: https://docs.npmjs.com/security-best-practices/

---

## Quick Reference Commands

```bash
# OWASP ZAP
docker run -t owasp/zap2docker-stable zap-baseline.py -t http://localhost:3000

# npm audit
npm audit && npm audit fix

# Nikto
nikto -h http://localhost:3000

# Check for exposed secrets
git secrets --scan

# Check SSL/TLS configuration
sslscan localhost:3000

# Find exposed ports
nmap -sV localhost -p 3000
```

