const core = require('@actions/core');
const fs = require('fs');
const axios = require('axios');

async function run() {
    try {
        const collectionPath = core.getInput('collection_path');
        const postmanApiKey = core.getInput('postman_api_key');
        const collectionId = core.getInput('collection_id');
        const collectionData = fs.readFileSync(collectionPath, 'utf8');

        const headers = {
            'Content-Type': 'application/json',
            'X-API-Key': postmanApiKey,
        };

        const response = await axios.put(`https://api.getpostman.com/collections/${collectionId}`, { 'collection': JSON.parse(collectionData) }, {
            headers: { 'X-Api-Key': postmanApiKey, 'Content-Type': 'application/json' }
          });
      
        core.info(`Successfully updated collection: ${response.data.collection.name}`);
        core.setOutput('updated_collection', JSON.stringify(response.data.collection));

    } catch (error) {
        core.setFailed(`Error updating Postman collection: ${error.message}`);
    }
}

run();
