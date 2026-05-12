COLOR_GREEN  = '\033[32m'
COLOR_RED    = '\033[31m'
COLOR_YELLOW = '\033[93m'
COLOR_RESET  = '\033[0m'

def info(msg):
    print(f'{COLOR_YELLOW}* {msg}{COLOR_RESET}')

def bad(msg):
    print(f'{COLOR_RED}* {msg}{COLOR_RESET}')

def good(msg):
    print(f'{COLOR_GREEN}* {msg}{COLOR_RESET}')

