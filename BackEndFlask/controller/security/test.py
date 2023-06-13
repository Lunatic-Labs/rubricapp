test = 0

def add(func):
    def onemore():
        global test
        test += 1
        func()
    return onemore

@add
def set():
    global test
    test*=3

set()
print(test)