from models.user import *
from models.team import *
from models.team_user import *
from models.schemas import *

"""
What do we need to know?
    owner_id
    course_id

    numofStudnets = len(select user_id from UserCourse where course_id=course_id)
    tas = select use_tas from Course where course_id=course_id



    


"""


def RandomAssignStudents(owner_id, course_id):
    
    