class Location:
    def __init__(self, r, c, path):
        self.r    = r
        self.c    = c
        self.path = path

    def __str__(self):
        return f'{self.path}:{self.r}:{self.c}'

    def to_dict(self):
        return {"r": self.r, "c": self.c, "path": self.path}
