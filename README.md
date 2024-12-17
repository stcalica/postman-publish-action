# Postman Publish Action

This repository contains GitHub Actions that help automate publishing Postman Collections to the Public API Network. 
You can use these actions to fetch a schema or Postman collection, transform an OpenAPI schema into a Postman collection, and update a Postman collection programmatically as part of your CI/CD workflows.

## Github Marketplace 

I’ve kept it simple by listing just the key GitHub Actions you’ll find on GitHub Marketplace. Some of these live in their own repos, so you can use them without worrying about the full repo path. The table below shows how to call these Actions in your workflows, whether you’re grabbing them from the Marketplace or directly from this repo.

| Action           | Description         |  Public Repo Reference            | Marketplace Reference          |  Marketplace Link          |
|------------------|--------------------------------|---------------------------------|---------------------------------|---------------------------------|
| Fetch Collection | Fetch a collection from a repo you have access to | `stcalica/postman-publish-action/actions/fetch-collection@master`      | `stacalica/fetch-collection@v1.0.0`      | https://github.com/marketplace/actions/fetch-postman-collection |
| Update Collection | Update a postman collection - uses PATCH to preserve forks and metrics | `stcalica/postman-publish-action/actions/update-collection@master`      | `stacalica/update-collection@v1.0.0`      | https://github.com/marketplace/actions/update-postman-collection |
| OpenAPI JSON to Postman Collection | Transform OPENAPI **output** into a Posmtan Collection | `stcalica/postman-publish-action/actions/transform-openapi@master`   | `stcalica/transform-openapi-to-postman-collection@v1.0.0`  | https://github.com/marketplace/actions/transform-openapi-to-postman-collection |
| OpenAPI to Postman Collection from **file** | Transform an OPENAPI file Postman Collection  | `stcalica/postman-publish-action/actions/transform-openapi-from-file@master`   | `stcalica/transform-openapi-from-file@v1.0.0`  | https://github.com/marketplace/actions/transform-openapi-to-postman-collection-from-file
| Update Postman Collection from **file** | Update a Postman Collection from a collection file  | `stcalica/postman-publish-action/actions/update-collection-from-file@master`   | `stcalica/update-collection-from-file-file@v1.0.0`  | 

## Actions

### 1. **Fetch Postman Collection**
   This action retrieves a Postman collection from the Postman API using the collection's UID. You can use this action when you need to pull the latest version of a collection as part of your build or deployment process.

   #### Inputs:
   - `postman_api_key`: Your Postman API key for authentication.
   - `collection_id`: The unique identifier of the Postman collection you want to retrieve.

   #### Example Usage:
   ```yaml
   - name: Fetch Postman Collection
     uses: stcalica/postman-publish-action/actions/fetch-collection@master
     with:
       postman_api_key: ${{ secrets.POSTMAN_API_KEY }}
       collection_id: 'your-collection-id'
   ```

### 2. **Transform OpenAPI to Postman Collection**
   This action converts an OpenAPI schema into a Postman collection. This is useful when you want to ensure your OpenAPI spec is synchronized with your Postman collection for testing or sharing purposes.

   #### Inputs:
   - `postman_api_key`: Your Postman API key for authentication.
   - `openapi_schema_url`: The URL of the OpenAPI schema you want to transform into a Postman collection.
   - `destination_collection_id`: (Optional) If provided, this will be the UID of the Postman collection where the transformed schema will be stored.
   - `output_file`: (Optional) If provided, this will create a file on the runner file system and output the filepath

   #### Example Usage:
   ```yaml
   - name: Transform OpenAPI to Postman Collection
     uses: stcalica/postman-publish-action/actions/transform-openapi@master
     with:
       postman_api_key: ${{ secrets.POSTMAN_API_KEY }}
       openapi_schema_url: 'https://api.example.com/openapi.yaml'
       destination_collection_id: 'your-collection-uid'
   ```

### 3. **Transform OpenAPI to Postman Collection from file**
   This action converts an OpenAPI schema into a Postman collection. This is useful when you want to ensure your OpenAPI spec is synchronized with your Postman collection for testing or sharing purposes.

   #### Inputs:
   - `postman_api_key`: Your Postman API key for authentication.
   - `openapi_schema_path`: (Optional) If provided, this will be the UID of the Postman collection where the transformed schema will be stored.
   - `output_file`: (Optional) If provided, this will create a file on the runner file system and output the filepath

   #### Example Usage:
   ```yaml
   - name: Transform OpenAPI to Postman Collection
     uses: stcalica/postman-publish-action/actions/transform-openapi-from-file@master
     with:
       postman_api_key: ${{ secrets.POSTMAN_API_KEY }}
       openapi_schema_path: './tests/cats.yaml'
 ```

### 4. **Update Postman Collection**
   This action updates a destination Postman collection with the contents of another source collection. You can use this action to keep your collections in sync across environments or projects.

   #### Inputs:
   - `postman_api_key`: Your Postman API key for authentication.
   - `source_collection_id`: The UID of the source Postman collection.
   - `destination_collection_id`: The UID of the destination Postman collection that will be updated with the source's data.

   #### Example Usage:
   ```yaml
   - name: Update Postman Collection
     uses: stcalica/postman-publish-action/actions/update-collection@master
     with:
       postman_api_key: ${{ secrets.POSTMAN_API_KEY }}
       source_collection_id: 'source-collection-id'
       destination_collection_id: 'destination-collection-id'
   ```

## Usage in CI/CD

These actions are designed to fit seamlessly into your existing CI/CD workflows. Here’s an example workflow that fetches a Postman collection, updates it with a transformed OpenAPI schema, and then syncs it with another collection.

```yaml
name: Postman CI Workflow

on:
  push:
    branches:
      - main

jobs:
  postman-sync:
    runs-on: ubuntu-latest

    steps:
      - name: Fetch Postman Collection
        uses: stcalica/postman-publish-action/actions/fetch-collection@master
        with:
          postman_api_key: ${{ secrets.POSTMAN_API_KEY }}
          collection_id: 'your-collection-uid'

      - name: Transform OpenAPI to Postman Collection
        uses: stcalica/postman-publish-action/actions/transform-openapi-from-file@master
        with:
          postman_api_key: ${{ secrets.POSTMAN_API_KEY }}
          openapi_schema_url: 'https://api.example.com/openapi.yaml'
          destination_collection_id: 'your-collection-uid'

      - name: Update Postman Collection
        uses: stcalica/postman-publish-action/actions/update-collection@master
        with:
          postman_api_key: ${{ secrets.POSTMAN_API_KEY }}
          source_collection_id: 'source-collection-uid'
          destination_collection_id: 'destination-collection-uid'
```

## Setup

1. **Generate a Postman API Key**: You can generate an API key in your [Postman account settings](https://go.postman.co/settings/me/api-keys).
2. **Store Secrets in GitHub**: Store your Postman API key securely in your repository by navigating to **Settings > Secrets** in your GitHub repo and adding it as a secret (e.g., `POSTMAN_API_KEY`).
3. **Use the Actions**: Add the steps to your `.github/workflows` YAML file as shown above.

## License

This repository is licensed under the [MIT License](LICENSE).
