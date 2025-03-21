def once(func):
    initialized = False
    def wrapper(*args, **kwargs):
        nonlocal initialized
        if not initialized:
            func(*args, **kwargs)
            initialized = True
    return wrapper

class Singleton(object):
    def __new__(cls, **kwargs):
        if not hasattr(cls, 'instance'):
            cls.instance = super(Singleton, cls).__new__(cls)
        return cls.instance
    
import os

def f():
    if (not os.path.exists('catalog')):
        os.mkdir('catalog')
    with open(f'catalog/file.txt', "w+") as file:
        file.write("data")

if __name__ == "__main__":
    print(str(None))
    os.rmdir("environments/3")
    # os.mkdir("catalog")
    # basePath = 'catalog/files/files'
    # if (os.path.exists(path=basePath) == False):
    #     currentPath = ''
    #     for x in basePath.split('/'):
    #         currentPath +=x
    #         if (os.path.exists(currentPath) == False):
    #             os.mkdir(path=currentPath)
    #         currentPath+='/'
    #os.remove("catalog/file.txt")
    #f()