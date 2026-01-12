import pytest
from models.assessment_task import (
    validate_number_of_teams,
    validate_max_team_size,
    InvalidNumberOfTeams,
    InvalidMaxTeamSize,
    InvalidAssessmentTaskID,
)

# ---------------------------
# validate_number_of_teams
# ---------------------------

def test_validate_number_of_teams_valid_int():
    # should not raise when number_of_teams > 0
    validate_number_of_teams(5)

def test_validate_number_of_teams_valid_str():
    # string numbers are okay
    validate_number_of_teams("3")

def test_validate_number_of_teams_raises_on_zero():
    with pytest.raises(InvalidNumberOfTeams):
        validate_number_of_teams(0)

def test_validate_number_of_teams_raises_on_negative():
    with pytest.raises(InvalidNumberOfTeams):
        validate_number_of_teams(-2)

def test_validate_number_of_teams_raises_on_invalid_str():
    with pytest.raises(InvalidNumberOfTeams):
        validate_number_of_teams("abc")


# ---------------------------
# validate_max_team_size
# ---------------------------

def test_validate_max_team_size_valid_int():
    validate_max_team_size(4)

def test_validate_max_team_size_valid_str():
    validate_max_team_size("2")

def test_validate_max_team_size_raises_on_zero():
    with pytest.raises(InvalidMaxTeamSize):
        validate_max_team_size(0)

def test_validate_max_team_size_raises_on_negative():
    with pytest.raises(InvalidMaxTeamSize):
        validate_max_team_size(-10)

def test_validate_max_team_size_raises_on_invalid_str():
    with pytest.raises(InvalidMaxTeamSize):
        validate_max_team_size("xyz")


# ---------------------------
# InvalidAssessmentTaskID Exception
# ---------------------------

def test_invalid_assessment_task_id_str_representation():
    exc = InvalidAssessmentTaskID(99)
    assert str(exc) == "Invalid Assessment Task ID: 99."

