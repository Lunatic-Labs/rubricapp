from typing import Any, Dict, List, Optional, Union
from enum import Enum
from pydantic import BaseModel, Field


class ScimUserResource(BaseModel):
    """The team member's external ID."""

    external_id: Optional[str] = None
    meta: Optional[Any] = None
    """If true, the team member is active."""
    active: Optional[bool] = None
    """The team member's SCIM username."""
    user_name: Optional[str] = None
    """Information about the Postman team member."""
    name: Optional[Any] = None
    """The team member's SCIM ID."""
    id: Optional[str] = None
    """A list of schema resource URIs."""
    schemas: Optional[List[str]] = None

    def json(self, **kwargs: Any) -> str:
        """Return a json string representation of the object. Takes same keyword arguments as pydantic.BaseModel.json"""
        kwargs.setdefault("by_alias", True)
        return super().json(**kwargs)

    def dict(self, **kwargs: Any) -> Dict[str, Any]:
        """Return a dict representation of the object. Takes same keyword arguments as pydantic.BaseModel.dict"""
        kwargs.setdefault("by_alias", True)
        return super().dict(**kwargs)

    @classmethod
    def parse_obj(cls, data: Any) -> "ScimUserResource":
        """Parse a dict into the object. Takes same keyword arguments as pydantic.BaseModel.parse_obj"""
        return super().parse_obj(data)

    @classmethod
    def parse_raw(cls, b: Union[bytes, str], **kwargs: Any) -> "ScimUserResource":
        """Parse a json string into the object. Takes same keyword arguments as pydantic.BaseModel.parse_raw"""
        return super().parse_raw(b, **kwargs)
