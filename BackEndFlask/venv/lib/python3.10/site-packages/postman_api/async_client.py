import os
import aiohttp
import asyncio
import json
import logging
from .logger import logger
from .authenticator import PostmanAuthentication
from typing import Optional, List, Any, Dict, Union
from . import model


def filter_none(d: Dict[str, Any]) -> Dict[str, str]:
    return {k: str(v) for k, v in d.items() if v is not None}


def log_request(
    method: str, url: str, headers: Dict[str, str], params: Dict[str, str], data: Any
) -> None:
    logger.debug(
        json.dumps(
            dict(
                method=method,
                url=url,
                headers=headers,
                params=params,
                json=data,
            )
        )
    )


def log_response(text: str, res: aiohttp.ClientResponse) -> None:
    data: Dict[str, Any] = dict(
        status_code=res.status,
        headers=dict(**res.headers),
    )
    try:
        data["json"] = json.loads(text)
    except json.JSONDecodeError:
        data["body"] = text
    logger.debug(json.dumps(data))


class AsyncPostmanClient:
    def __init__(self, base_url: str, authenticator: PostmanAuthentication):
        self.authenticator = authenticator
        self.base_url = base_url
        self.session = aiohttp.ClientSession(
            headers={
                "User-Agent": "postman-api/python/2.0.0",
                "Content-Type": "application/json",
            }
        )

    async def send(
        self,
        method: str,
        url: str,
        headers: Dict[str, Union[str, None]],
        params: Dict[str, Union[str, int, None]],
        data: Any,
    ) -> str:
        self.authenticator.authenticate(headers, params, data)
        headers1 = filter_none(headers)
        params1 = filter_none(params)
        do_debug = logger.getEffectiveLevel() == logging.DEBUG
        if do_debug:
            log_request(
                method, url, dict(**headers1, **self.session.headers), params1, data
            )
        async with self.session.request(
            method, url, headers=headers1, params=params1, json=data
        ) as res:
            text = await res.text()
            if do_debug:
                log_response(text, res)
            if not res.ok:
                res.release()
                raise aiohttp.ClientResponseError(
                    res.request_info,
                    res.history,
                    status=res.status,
                    message=text,
                    headers=res.headers,
                )
            return text

    async def get_all_apis(
        self,
        *,
        workspace: Optional[str] = None,
        since: Optional[str] = None,
        until: Optional[str] = None,
        created_by: Optional[str] = None,
        updated_by: Optional[str] = None,
        is_public: Optional[bool] = None,
        name: Optional[str] = None,
        summary: Optional[str] = None,
        description: Optional[str] = None,
        sort: Optional[str] = None,
        direction: Optional[str] = None,
    ) -> Any:
        """Get all APIs

        Gets information about all APIs."""
        url = self.base_url + "/apis"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspace": workspace,
            "since": since,
            "until": until,
            "createdBy": created_by,
            "updatedBy": updated_by,
            "isPublic": is_public,
            "name": name,
            "summary": summary,
            "description": description,
            "sort": sort,
            "direction": direction,
        }
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def create_api(
        self, *, workspace_id: Optional[str] = None, api: Optional[Any] = None
    ) -> Any:
        """Create an API

        Creates an API."""
        url = self.base_url + "/apis"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspaceId": workspace_id,
        }
        data: Dict[str, Any] = {
            "api": None if api is None else api.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def single_api(self, api_id: str) -> Any:
        """Get an API

        Gets information about an API."""
        url = self.base_url + f"/apis/{api_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def update_an_api(self, api_id: str, *, api: Optional[Any] = None) -> Any:
        """Update an API

        Updates an API."""
        url = self.base_url + f"/apis/{api_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "api": None if api is None else api.dict(),
        }
        text = await self.send("PUT", url, headers, params, data)
        return json.loads(text)

    async def delete_an_api(self, api_id: str) -> Any:
        """Delete an API

        Deletes an API."""
        url = self.base_url + f"/apis/{api_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("DELETE", url, headers, params, data)
        return json.loads(text)

    async def get_all_api_versions(self, api_id: str) -> Any:
        """Get all API versions

        Gets information about an API's versions."""
        url = self.base_url + f"/apis/{api_id}/versions"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def create_api_version(
        self, api_id: str, *, version: Optional[Any] = None
    ) -> Any:
        """Create an API version

        Creates a new API version."""
        url = self.base_url + f"/apis/{api_id}/versions"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "version": None if version is None else version.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def get_an_api_version(self, api_id: str, api_version_id: str) -> Any:
        """Get an API version

        Gets information about an API version."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def update_an_api_version(
        self, api_id: str, api_version_id: str, *, version: Optional[Any] = None
    ) -> Any:
        """Update an API version

        Updates an API version."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "version": None if version is None else version.dict(),
        }
        text = await self.send("PUT", url, headers, params, data)
        return json.loads(text)

    async def delete_an_api_version(self, api_id: str, api_version_id: str) -> Any:
        """Delete an API version

        Deletes an API version."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("DELETE", url, headers, params, data)
        return json.loads(text)

    async def get_contract_test_relations(
        self, api_id: str, api_version_id: str
    ) -> Any:
        """Get contract test relations

        This endpoint is **deprecated**. Use the `/apis/{apiId}/versions/{apiVersionId}/test` endpoint."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}/contracttest"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def get_documentation_relations(
        self, api_id: str, api_version_id: str
    ) -> Any:
        """Get documentation relations

        Gets an API version's documentation relations."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}/documentation"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def get_environment_relations(self, api_id: str, api_version_id: str) -> Any:
        """Get environment relations

        Gets an API version's environment relations."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}/environment"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def get_integration_test_relations(
        self, api_id: str, api_version_id: str
    ) -> Any:
        """Get integration test relations

        This endpoint is **deprecated**. Use the `/apis/{apiId}/versions/{apiVersionId}/test` endpoint."""
        url = (
            self.base_url + f"/apis/{api_id}/versions/{api_version_id}/integrationtest"
        )
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def get_mock_server_relations(self, api_id: str, api_version_id: str) -> Any:
        """Get mock server relations

        Gets an API version's mock server relations."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}/mock"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def get_monitor_relations(self, api_id: str, api_version_id: str) -> Any:
        """Get monitor relations

        Gets an API version's monitor relations."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}/monitor"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def get_linked_relations(self, api_id: str, api_version_id: str) -> Any:
        """Get all linked relations

        Gets all of an API version's relations."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}/relations"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def create_relations(
        self,
        api_id: str,
        api_version_id: str,
        *,
        documentation: Optional[List[str]] = None,
        environment: Optional[List[str]] = None,
        mock: Optional[List[str]] = None,
        monitor: Optional[List[str]] = None,
        test: Optional[List[str]] = None,
        contracttest: Optional[List[str]] = None,
        testsuite: Optional[List[str]] = None,
    ) -> Any:
        """Create relations

        Creates a new relation for an API version. This endpoint accepts multiple relation arrays in a single call."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}/relations"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "documentation": documentation,
            "environment": environment,
            "mock": mock,
            "monitor": monitor,
            "test": test,
            "contracttest": contracttest,
            "testsuite": testsuite,
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def create_schema(
        self, api_id: str, api_version_id: str, *, schema: Optional[Any] = None
    ) -> Any:
        """Create a schema

        Creates an API definition."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}/schemas"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "schema": None if schema is None else schema.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def get_schema(self, api_id: str, api_version_id: str, schema_id: str) -> Any:
        """Get a schema

        Gets information about an API's definition."""
        url = (
            self.base_url
            + f"/apis/{api_id}/versions/{api_version_id}/schemas/{schema_id}"
        )
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def update_schema(
        self,
        api_id: str,
        api_version_id: str,
        schema_id: str,
        *,
        schema: Optional[Any] = None,
    ) -> Any:
        """Update a schema

        Updates an API definition."""
        url = (
            self.base_url
            + f"/apis/{api_id}/versions/{api_version_id}/schemas/{schema_id}"
        )
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "schema": None if schema is None else schema.dict(),
        }
        text = await self.send("PUT", url, headers, params, data)
        return json.loads(text)

    async def create_collection_from_schema(
        self,
        api_id: str,
        api_version_id: str,
        schema_id: str,
        name: str,
        relations: List[Any],
        *,
        workspace_id: Optional[str] = None,
    ) -> Any:
        """Create collection from a schema

        Creates a collection and links it to an API as one or multiple relations."""
        url = (
            self.base_url
            + f"/apis/{api_id}/versions/{api_version_id}/schemas/{schema_id}/collections"
        )
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspaceId": workspace_id,
        }
        data: Dict[str, Any] = {
            "name": name,
            "relations": None if relations is None else [d.dict() for d in relations],
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def get_test_relations(self, api_id: str, api_version_id: str) -> Any:
        """Get all test relations

        Gets all of an API version's test relations."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}/test"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def get_test_suite_relations(self, api_id: str, api_version_id: str) -> Any:
        """Get test suite relations

        This endpoint is **deprecated**. Use the `/apis/{apiId}/versions/{apiVersionId}/test` endpoint."""
        url = self.base_url + f"/apis/{api_id}/versions/{api_version_id}/testsuite"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def sync_relations_with_schema(
        self, api_id: str, api_version_id: str, relation_type: str, entity_id: str
    ) -> Any:
        """Sync API relations with definition

        Syncs an API version's relation with the API's definition."""
        url = (
            self.base_url
            + f"/apis/{api_id}/versions/{api_version_id}/{relation_type}/{entity_id}/syncWithSchema"
        )
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("PUT", url, headers, params, data)
        return json.loads(text)

    async def all_collections(self, *, workspace_id: Optional[str] = None) -> Any:
        """Get all collections

        Gets all of your [collections](https://www.getpostman.com/docs/collections). The response includes all of your subscribed collections."""
        url = self.base_url + "/collections"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspaceId": workspace_id,
        }
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def create_collection(
        self, *, workspace_id: Optional[str] = None, collection: Optional[Any] = None
    ) -> Any:
        """Create a collection

        Creates a collection using the [Postman Collection v2 schema format](https://schema.postman.com/json/collection/v2.1.0/docs/index.html).

        **Note:**

        - For a complete list of available property values for this endpoint, use the following references available in the [collection.json schema file](https://schema.postman.com/json/collection/v2.1.0/collection.json):
          - `info` object — Use the `definitions.info` entry.
          - `item` object — Use the `definitions.items` entry.
        - For all other possible values, refer to the [collection.json schema file](https://schema.postman.com/json/collection/v2.1.0/collection.json).
        """
        url = self.base_url + "/collections"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspaceId": workspace_id,
        }
        data: Dict[str, Any] = {
            "collection": None if collection is None else collection.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def create_a_fork(
        self, workspace: str, collection_uid: str, *, label: Optional[str] = None
    ) -> Any:
        """Create a fork

        Creates a [fork](https://learning.postman.com/docs/collaborating-in-postman/version-control/#creating-a-fork) from an existing collection into a workspace."""
        url = self.base_url + f"/collections/fork/{collection_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspace": workspace,
        }
        data: Dict[str, Any] = {
            "label": label,
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def merge_a_fork(
        self,
        *,
        destination: Optional[str] = None,
        source: Optional[str] = None,
        strategy: Optional[str] = None,
    ) -> Any:
        """Merge a fork

        Merges a forked collection back into its destination collection."""
        url = self.base_url + "/collections/merge"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "destination": destination,
            "source": source,
            "strategy": strategy,
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def single_collection(self, collection_uid: str) -> Any:
        """Get a collection

        Gets information about a collection. For a complete list of this endpoint's possible values, use the [collection.json schema file](https://schema.postman.com/json/collection/v2.1.0/collection.json)."""
        url = self.base_url + f"/collections/{collection_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def update_collection(
        self, collection_uid: str, *, collection: Optional[Any] = None
    ) -> Any:
        """Update a collection

        Updates a collection using the [Postman Collection v2 schema format](https://schema.postman.com/json/collection/v2.1.0/docs/index.html).

        > Use caution when using this endpoint. The system will **replace** the existing collection with the values passed in the request body.

        **Note:**

        - For a complete list of available property values for this endpoint, use the following references available in the [collection.json schema file](https://schema.postman.com/json/collection/v2.1.0/collection.json):
          - `info` object — Use the `definitions.info` entry.
          - `item` object — Use the `definitions.items` entry.
        - For all other possible values, refer to the [collection.json schema file](https://schema.postman.com/json/collection/v2.1.0/collection.json).
        """
        url = self.base_url + f"/collections/{collection_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "collection": None if collection is None else collection.dict(),
        }
        text = await self.send("PUT", url, headers, params, data)
        return json.loads(text)

    async def delete_collection(self, collection_uid: str) -> Any:
        """Delete a collection

        Deletes a collection."""
        url = self.base_url + f"/collections/{collection_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("DELETE", url, headers, params, data)
        return json.loads(text)

    async def all_environments(self, *, workspace_id: Optional[str] = None) -> Any:
        """Get all environments

        Gets information about all of your [environments](https://learning.postman.com/docs/sending-requests/managing-environments/)."""
        url = self.base_url + "/environments"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspaceId": workspace_id,
        }
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def create_environment(
        self, *, workspace_id: Optional[str] = None, environment: Optional[Any] = None
    ) -> Any:
        """Create an environment

        Creates an environment."""
        url = self.base_url + "/environments"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspaceId": workspace_id,
        }
        data: Dict[str, Any] = {
            "environment": None if environment is None else environment.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def single_environment(self, environment_uid: str) -> Any:
        """Get an environment

        Gets information about an environment."""
        url = self.base_url + f"/environments/{environment_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def update_environment(
        self, environment_uid: str, *, environment: Optional[Any] = None
    ) -> Any:
        """Update an environment

        Updates an environment."""
        url = self.base_url + f"/environments/{environment_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "environment": None if environment is None else environment.dict(),
        }
        text = await self.send("PUT", url, headers, params, data)
        return json.loads(text)

    async def delete_environment(self, environment_uid: str) -> Any:
        """Delete an environment

        Deletes an environment."""
        url = self.base_url + f"/environments/{environment_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("DELETE", url, headers, params, data)
        return json.loads(text)

    async def import_exported_data(self) -> Any:
        """Import an exported Postman data dump file

        **This endpoint is deprecated.**

        Imports exported Postman data. This endpoint only accepts [export data dump files](https://postman.postman.co/me/export).

        For more information, read our [Exporting data dumps](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#exporting-data-dumps) documentation.
        """
        url = self.base_url + "/import/exported"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def import_external_api_specification(
        self, body: Any, *, workspace_id: Optional[str] = None
    ) -> Any:
        """Import an OpenAPI definition

        Imports an OpenAPI definition into Postman as a new [Postman Collection](https://learning.postman.com/docs/getting-started/creating-the-first-collection/)."""
        url = self.base_url + "/import/openapi"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspaceId": workspace_id,
        }
        data: Dict[str, Any] = {
            "body": None if body is None else body.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def api_key_owner(self) -> Any:
        """Get authenticated user

        Gets information about the authenticated user."""
        url = self.base_url + "/me"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def all_mocks(self) -> Any:
        """Get all mock servers

        Gets all mock servers."""
        url = self.base_url + "/mocks"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def create_mock(
        self, *, workspace_id: Optional[str] = None, mock: Optional[Any] = None
    ) -> Any:
        """Create a mock server

        Creates a mock server in a collection."""
        url = self.base_url + "/mocks"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspaceId": workspace_id,
        }
        data: Dict[str, Any] = {
            "mock": None if mock is None else mock.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def single_mock(self, mock_uid: str) -> Any:
        """Get a mock server

        Gets information about a mock server."""
        url = self.base_url + f"/mocks/{mock_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def update_mock(self, mock_uid: str, *, mock: Optional[Any] = None) -> Any:
        """Update a mock server

        Updates a mock server."""
        url = self.base_url + f"/mocks/{mock_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "mock": None if mock is None else mock.dict(),
        }
        text = await self.send("PUT", url, headers, params, data)
        return json.loads(text)

    async def delete_mock(self, mock_uid: str) -> Any:
        """Delete a mock server

        Deletes a mock server."""
        url = self.base_url + f"/mocks/{mock_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("DELETE", url, headers, params, data)
        return json.loads(text)

    async def publish_mock(self, mock_uid: str) -> Any:
        """Publish a mock server

        Publishes a mock server. Publishing a mock server sets its **Access Control** configuration setting to public."""
        url = self.base_url + f"/mocks/{mock_uid}/publish"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def unpublish_mock(self, mock_uid: str) -> Any:
        """Unpublish a mock server

        Unpublishes a mock server. Unpublishing a mock server sets its **Access Control** configuration setting to private."""
        url = self.base_url + f"/mocks/{mock_uid}/unpublish"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("DELETE", url, headers, params, data)
        return json.loads(text)

    async def all_monitors(self) -> Any:
        """Get all monitors

        Gets all monitors."""
        url = self.base_url + "/monitors"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def create_monitor(
        self, *, workspace_id: Optional[str] = None, monitor: Optional[Any] = None
    ) -> Any:
        """Create a monitor

        Creates a monitor."""
        url = self.base_url + "/monitors"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspaceId": workspace_id,
        }
        data: Dict[str, Any] = {
            "monitor": None if monitor is None else monitor.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def single_monitor(self, monitor_uid: str) -> Any:
        """Get a monitor

        Gets information about a monitor."""
        url = self.base_url + f"/monitors/{monitor_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def update_monitor(
        self, monitor_uid: str, *, monitor: Optional[Any] = None
    ) -> Any:
        """Update a monitor

        Updates a monitor."""
        url = self.base_url + f"/monitors/{monitor_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "monitor": None if monitor is None else monitor.dict(),
        }
        text = await self.send("PUT", url, headers, params, data)
        return json.loads(text)

    async def delete_monitor(self, monitor_uid: str) -> Any:
        """Delete a monitor

        Deletes a monitor."""
        url = self.base_url + f"/monitors/{monitor_uid}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("DELETE", url, headers, params, data)
        return json.loads(text)

    async def run_a_monitor(self, monitor_uid: str) -> Any:
        """Run a monitor

        Runs a monitor and returns its run results."""
        url = self.base_url + f"/monitors/{monitor_uid}/run"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def get_resource_types(self) -> List[Any]:
        """Get resource types

        Gets all the resource types supported by Postman's SCIM API."""
        url = self.base_url + "/scim/v2/ResourceTypes"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return List[Any].parse_raw(text)

    async def service_provider_config(self) -> Any:
        """Get service provider configuration

        Gets the Postman SCIM API configuration information. This includes a list of supported operations."""
        url = self.base_url + "/scim/v2/ServiceProviderConfig"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def fetch_all_user_resource(
        self,
        *,
        start_index: Optional[float] = None,
        count: Optional[float] = None,
        filter: Optional[str] = None,
    ) -> Any:
        """Get all user resources

        Gets information about all Postman team members."""
        url = self.base_url + "/scim/v2/Users"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "startIndex": start_index,
            "count": count,
            "filter": filter,
        }
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def create_user(
        self,
        *,
        schemas: Optional[List[str]] = None,
        user_name: Optional[str] = None,
        active: Optional[bool] = None,
        external_id: Optional[str] = None,
        groups: Optional[List[str]] = None,
        locale: Optional[str] = None,
        name: Optional[Any] = None,
    ) -> Any:
        """Create a user

        Creates a new user account in Postman and adds the user to your organization's Postman team. If the account does not already exist, this also activates the user so they can authenticate in to your Postman team.

        If the account already exists, the system sends the user an [email invite](https://learning.postman.com/docs/administration/managing-your-team/managing-your-team/#inviting-users) to join the Postman team. The user joins the team once they accept the invite.

        By default, the system assigns new users the developer role. You can [update user roles in Postman](https://learning.postman.com/docs/administration/managing-your-team/managing-your-team/#managing-team-roles).
        """
        url = self.base_url + "/scim/v2/Users"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "schemas": schemas,
            "userName": user_name,
            "active": active,
            "externalId": external_id,
            "groups": groups,
            "locale": locale,
            "name": None if name is None else name.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def fetch_user_resource(self, user_id: str) -> Any:
        """Get user resource

        Gets information about a Postman team member."""
        url = self.base_url + f"/scim/v2/Users/{user_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def update_user_information(
        self,
        user_id: str,
        *,
        schemas: Optional[List[str]] = None,
        name: Optional[Any] = None,
    ) -> Any:
        """Update a user

        Updates a user's first and last name in Postman.

        **Note:**

        You can only use the SCIM API to update a user's first and last name. You cannot update any other user attributes with the API.
        """
        url = self.base_url + f"/scim/v2/Users/{user_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "schemas": schemas,
            "name": None if name is None else name.dict(),
        }
        text = await self.send("PUT", url, headers, params, data)
        return json.loads(text)

    async def update_user_state(
        self,
        user_id: str,
        *,
        schemas: Optional[List[str]] = None,
        operations: Optional[List[Any]] = None,
    ) -> Any:
        """Update a user's state

        Updates a user's active state in Postman.

        ### Reactivating users

        By setting the `active` property from `false` to `true`, this reactivates an account. This allows the account to authenticate in to Postman and adds the account back on to your Postman team.
        """
        url = self.base_url + f"/scim/v2/Users/{user_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "schemas": schemas,
            "Operations": None
            if operations is None
            else [d.dict() for d in operations],
        }
        text = await self.send("PATCH", url, headers, params, data)
        return json.loads(text)

    async def schema_security_validation(self, *, schema: Optional[Any] = None) -> Any:
        """Schema security validation

        Performs a security analysis on the given definition and returns any issues. This can help you understand their impact and provides solutions to help you resolve the errors. You can include this endpoint to your CI/CD process to automate schema validation.

        For more information, read our [API definition warnings](https://learning.postman-beta.com/docs/api-governance/api-definition/api-definition-warnings/) documentation.

        **Note:**

        The maximum allowed size of the definition is 10 MB.
        """
        url = self.base_url + "/security/api-validation"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "schema": None if schema is None else schema.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def create_webhook(
        self, *, workspace_id: Optional[str] = None, webhook: Optional[Any] = None
    ) -> Any:
        """Create a webhook

        Creates a webhook that triggers a collection with a custom payload. You can get the webhook's URL from the `webhookUrl` property in the endpoint's response."""
        url = self.base_url + "/webhooks"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "workspaceId": workspace_id,
        }
        data: Dict[str, Any] = {
            "webhook": None if webhook is None else webhook.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def all_workspaces(self, *, type: Optional[str] = None) -> Any:
        """Get all workspaces

        Gets all [workspaces](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/creating-workspaces/). The response includes your workspaces and any workspaces that you have access to.

        **Note:**

        This endpoint's response contains the visibility field. Visibility determines who can access the workspace:

        - `only-me` — Applies to the **My Workspace** workspace.
        - `personal` — Only you can access the workspace.
        - `team` — All team members can access the workspace.
        - `private-team` — Only invited team members can access the workspace.
        - `public` — Everyone can access the workspace.
        """
        url = self.base_url + "/workspaces"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {
            "type": type,
        }
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def create_workspace(self, *, workspace: Optional[Any] = None) -> Any:
        """Create a workspace

        Creates a new [workspace](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/creating-workspaces/).

        ### Important:

        We **deprecated** linking collections or environments between workspaces. We do **not** recommend that you do this.

        If you have a linked collection or environment, note the following:

        - The endpoint does **not** create a clone of a collection or environment.
        - Any changes you make to a linked collection or environment changes them in **all** workspaces.
        - If you delete a collection or environment linked between workspaces, the system deletes it in **all** the workspaces.
        """
        url = self.base_url + "/workspaces"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "workspace": None if workspace is None else workspace.dict(),
        }
        text = await self.send("POST", url, headers, params, data)
        return json.loads(text)

    async def single_workspace(self, workspace_id: str) -> Any:
        """Get a workspace

        Gets information about a workspace.

        **Note:**

        This endpoint's response contains the `visibility` field. [Visibility](https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/managing-workspaces/#changing-workspace-visibility) determines who can access the workspace:

        - `only-me` — Applies to the **My Workspace** workspace.
        - `personal` — Only you can access the workspace.
        - `team` — All team members can access the workspace.
        - `private-team` — Only invited team members can access the workspace.
        - `public` — Everyone can access the workspace.
        """
        url = self.base_url + f"/workspaces/{workspace_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("GET", url, headers, params, data)
        return json.loads(text)

    async def update_workspace(
        self, workspace_id: str, *, workspace: Optional[Any] = None
    ) -> Any:
        """Update a workspace

        Updates a workspace.

        **Note:**

        You can change a workspace's type from `personal` to `team`, but you **cannot** change a workspace from `team` to `personal`.

        ### Important:

        We **deprecated** linking collections or environments between workspaces. We do **not** recommend that you do this.

        If you have a linked collection or environment, note the following:

        - The endpoint does **not** create a clone of a collection or environment.
        - Any changes you make to a linked collection or environment changes them in **all** workspaces.
        - If you delete a collection or environment linked between workspaces, the system deletes it in **all** the workspaces.
        """
        url = self.base_url + f"/workspaces/{workspace_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {
            "workspace": None if workspace is None else workspace.dict(),
        }
        text = await self.send("PUT", url, headers, params, data)
        return json.loads(text)

    async def delete_workspace(self, workspace_id: str) -> Any:
        """Delete a workspace

        Deletes an existing workspace.

        ### Important:

        If you delete a workspace that has a linked collection or environment with another workspace, this will delete the collection and environment in **all** workspaces.
        """
        url = self.base_url + f"/workspaces/{workspace_id}"
        headers: Dict[str, Union[str, None]] = {}
        params: Dict[str, Union[str, int, None]] = {}
        data: Dict[str, Any] = {}
        text = await self.send("DELETE", url, headers, params, data)
        return json.loads(text)

    def __del__(self) -> None:
        try:
            loop = asyncio.get_event_loop()
            if loop.is_running():
                loop.create_task(self.session.close())
            else:
                loop.run_until_complete(self.session.close())
        except Exception:
            pass

    @classmethod
    def from_env(cls) -> "AsyncPostmanClient":
        url = os.environ["POSTMAN_BASE_URL"]
        return cls(base_url=url, authenticator=PostmanAuthentication.from_env())
