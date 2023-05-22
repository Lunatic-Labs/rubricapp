from math import floor
from random import *
"""
something wrong when 7
"""

def groupNum(students):
    if students == 6 or students == 7: # If 6, {3, 3}
        return 2                       # If 7, {4, 3}
    d = floor(students/4)
    r = students%4
    return d+r

def fillStudents(students, teams, pods):
    countup=0
    while countup != students:
        teams[countup%pods] +=1
        countup+=1

def checker(teams, numStudents):
    all_good=True

    for i in teams:
        print("I is ",i)
        print(i == 3 or i == 4)
        if not (i == 3 or i == 4):
            if not (numStudents<=5): # classes of 5 or smaller
                all_good=False       # should not be expected 
                                     # to meet this requirement
    return all_good


thing=0
while thing!=10:

    # all_good=True

    students = thing 
    print (students)
    print(students/4)
    # students = randint(0, 10)

    pods = groupNum(students)
    teams = [0]*pods
    fillStudents(students, teams, pods)

    print()
    print()

    all_good=checker(teams, students)
        
    if all_good:
        print("we good dawg")
    else:
        print("something isn't cash-money")
    thing+=1



# students = 12
# print (students)
# print(students/4)
# d = floor(students/4)
# r = students%4
# print()
# print()
# print(d)
# print(r)
# pods = d+r
# print(pods)
# teams = [0]*pods
# countup=0
# while countup != students:
#     teams[countup%pods] +=1
#     # print("Team ",countup%pods)
#     # print(teams[countup%pods])
#     countup+=1
# print()
# print()
# print(len(teams))
# for i in teams:
#     if not (i != 3 or i != 4):
#         print(teams[i])
#         all_good=False
    
# if all_good:
#     print("we good dawg")
# else:
#     print("something isn't cash-money")