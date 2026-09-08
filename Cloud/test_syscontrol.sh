#!/bin/bash
# Lightweight checks for the gunicorn/logrotate logging config added to
# syscontrol.sh. This is a static/textual check rather than an executed
# one: syscontrol.sh's configure functions run real `sudo`/`certbot`/
# `systemctl`/`ufw` commands, so actually invoking them isn't something a
# test should do. Run manually with: bash Cloud/test_syscontrol.sh

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SYSCONTROL="$SCRIPT_DIR/syscontrol.sh"

pass=0
fail=0

assert_contains() {
    local desc="$1" needle="$2"
    if grep -qF -- "$needle" "$SYSCONTROL"; then
        echo "  PASS: $desc"
        pass=$((pass + 1))
    else
        echo "  FAIL: $desc"
        echo "        expected to find in syscontrol.sh: $needle"
        fail=$((fail + 1))
    fi
}

# grep -F with a needle containing embedded newlines does NOT require the
# needle's lines to be adjacent in the file — GNU grep treats each line of
# a multi-line -F pattern as a separate alternative (like -f patternfile),
# matched independently anywhere in the file. So "is X wired into function
# Y" has to be checked by first extracting Y's body (bounded by simple,
# brace-free functions only - this repo has no nested `{`/`}` inside
# configure()/configure_no_ssl()/the DEPS list) and then grepping a plain,
# single-line needle within just that block.
block_contains() {
    local desc="$1" start_pat="$2" end_pat="$3" needle="$4"
    local block
    block="$(sed -n "/$start_pat/,/$end_pat/p" "$SYSCONTROL")"
    if grep -qF -- "$needle" <<< "$block"; then
        echo "  PASS: $desc"
        pass=$((pass + 1))
    else
        echo "  FAIL: $desc"
        echo "        expected to find within the $start_pat ... $end_pat block: $needle"
        fail=$((fail + 1))
    fi
}

echo "bash -n syntax check"
if bash -n "$SYSCONTROL"; then
    echo "  PASS: syscontrol.sh has valid bash syntax"
    pass=$((pass + 1))
else
    echo "  FAIL: syscontrol.sh has a syntax error"
    fail=$((fail + 1))
fi

echo "gunicorn logging flags"
assert_contains "gunicorn ExecStart writes an access log" \
    "--access-logfile logs/gunicorn-access.log"
assert_contains "gunicorn ExecStart writes an error log" \
    "--error-logfile logs/gunicorn-error.log"

echo "logrotate config"
assert_contains "logrotate targets the gunicorn access log" \
    '$PROJ_DIR/BackEndFlask/logs/gunicorn-access.log'
assert_contains "logrotate targets the gunicorn error log" \
    '$PROJ_DIR/BackEndFlask/logs/gunicorn-error.log'
assert_contains "logrotate retention matches LOG_RETENTION_DAYS (90) in models/logger.py" \
    "rotate 90"
assert_contains "logrotate uses copytruncate (no gunicorn signal/pidfile needed)" \
    "copytruncate"
assert_contains "logrotate config is written to /etc/logrotate.d/rubricapp" \
    "/etc/logrotate.d/rubricapp"

echo "wiring"
block_contains "logrotate is declared as a dependency" \
    "^ DEPS=" "mysql-server'" "logrotate"
assert_contains "configure_logrotate is defined" \
    "function configure_logrotate() {"
block_contains "configure() calls configure_logrotate" \
    "^function configure() {" "^}" "configure_logrotate"
block_contains "configure_no_ssl() calls configure_logrotate" \
    "^function configure_no_ssl() {" "^}" "configure_logrotate"

echo
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
