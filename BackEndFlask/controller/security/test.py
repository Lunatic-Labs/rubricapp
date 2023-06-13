test = 0

def add(func):
    def onemore():
        global test
        func()
        test += 1
    return onemore

@add
def set():
    global test
    test*=3

set()
print(test)