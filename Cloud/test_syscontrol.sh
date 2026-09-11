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

echo "CloudWatch Logs agent config"
# CLOUDWATCH_AGENT_CONFIG is single-quoted bash, so $PROJ_DIR is
# interpolated via the '"$PROJ_DIR"' concatenation trick (see
# build_configs()) - the literal source text is '"$PROJ_DIR"'/..., not
# plain $PROJ_DIR/.... Matching plain $PROJ_DIR/... here would (and
# during development, did) silently pass by matching LOGROTATE_CONFIG's
# or serve_rubricapp()'s unrelated double-quoted occurrences instead of
# actually verifying this block.
assert_contains "app log (all.log) is shipped" \
    "'\"\$PROJ_DIR\"'/BackEndFlask/logs/all.log"
assert_contains "gunicorn access log is shipped" \
    "'\"\$PROJ_DIR\"'/BackEndFlask/logs/gunicorn-access.log"
assert_contains "gunicorn error log is shipped" \
    "'\"\$PROJ_DIR\"'/BackEndFlask/logs/gunicorn-error.log"
assert_contains "frontend log is shipped" \
    "'\"\$PROJ_DIR\"'/FrontEndReact/frontend.log"
assert_contains "retention matches LOG_RETENTION_DAYS (90) in models/logger.py" \
    '"retention_in_days": 90'
assert_contains "agent config is written to the standard amazon-cloudwatch-agent path" \
    "/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json"
assert_contains "warns when no IAM role is attached, rather than failing silently" \
    "no IAM role detected"

echo "CloudWatch Logs wiring"
assert_contains "configure_cloudwatch_agent is defined" \
    "function configure_cloudwatch_agent() {"
block_contains "configure() calls configure_cloudwatch_agent" \
    "^function configure() {" "^}" "configure_cloudwatch_agent"
block_contains "configure_no_ssl() calls configure_cloudwatch_agent" \
    "^function configure_no_ssl() {" "^}" "configure_cloudwatch_agent"

echo "CloudWatch Logs agent config renders as valid JSON"
# build_configs() mixes this JSON blob in with nginx heredoc-style content
# that has its own embedded `{`/`}` lines, so a brace- or pattern-bounded
# extraction (like block_contains uses for the brace-free configure()/
# configure_no_ssl() functions) isn't safe here - it would stop at the
# first stray `}` line inside the *nginx* config, not the JSON's actual
# end. Instead, search for the two exact, unambiguous bash-syntax anchors
# that only ever appear at this assignment's real start and end: the
# `CLOUDWATCH_AGENT_CONFIG='` that opens the single-quoted bash string,
# and the first line after it that's just a lone `'` closing it (JSON
# never contains a raw single quote, so this can't collide with content).
PYTHON_BIN="$(command -v python3 || command -v python || true)"
if [ -z "$PYTHON_BIN" ]; then
    echo "  SKIP: no python3/python on PATH to validate the rendered JSON"
else
    # Passed via env var rather than argv: on Windows, the Microsoft Store
    # python/python3 alias inspects argv for a path that looks like a
    # script and tries to "launch" it (misfiring on syscontrol.sh's own
    # #!/bin/bash shebang) - harmless since it still falls through to
    # running this heredoc, but prints scary-looking warnings for nothing.
    SYSCONTROL_PATH="$SYSCONTROL" "$PYTHON_BIN" <<'PYEOF'
import json
import os
import sys

path = os.environ["SYSCONTROL_PATH"]
text = open(path, encoding="utf-8").read()

start_marker = "CLOUDWATCH_AGENT_CONFIG='"
start = text.index(start_marker) + len(start_marker)
end = text.index("\n'", start)
blob = text[start:end]

# Undo the bash single-quote/double-quote concatenation trick used to
# interpolate $PROJ_DIR into an otherwise single-quoted string.
blob = blob.replace("'\"$PROJ_DIR\"'", "/test/proj")

try:
    json.loads(blob)
except json.JSONDecodeError as e:
    print(f"  FAIL: rendered CLOUDWATCH_AGENT_CONFIG is not valid JSON: {e}")
    sys.exit(1)

print("  PASS: rendered CLOUDWATCH_AGENT_CONFIG is valid JSON")
PYEOF
    if [ $? -eq 0 ]; then
        pass=$((pass + 1))
    else
        fail=$((fail + 1))
    fi
fi

echo
echo "$pass passed, $fail failed"
[ "$fail" -eq 0 ]
