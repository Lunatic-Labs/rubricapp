import os
from typing import Dict, Any


class PostmanAuthentication:
    def __init__(self, postman_api_key: str):
        self.postman_api_key = postman_api_key

    def authenticate(
        self, headers: Dict[str, str], params: Dict[str, str], data: Dict[str, Any]
    ) -> None:
        headers["x-api-key"] = self.postman_api_key

    @classmethod
    def from_env(cls) -> "PostmanAuthentication":
        postman_api_key = os.environ["POSTMAN_API_KEY"]
        return cls(postman_api_key=postman_api_key)
