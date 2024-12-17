const core = require('@actions/core');
const fs = require('fs');
var Converter = require('openapi-to-postmanv2')
const path = process.env.GITHUB_ENV;

async function run() {
    const openapiSchema = core.getInput('openapi_schema');
    const outputFilePath = core.getInput('output_file');  

    Converter.convert({ type: 'string', data: openapiSchema },
        {}, (err, conversionResult) => {
          if (!conversionResult.result) {
            console.log('Could not convert', conversionResult.reason);
          }
          else {
            if (outputFilePath) {
                fs.writeFileSync(outputFilePath, JSON.stringify(postmanCollection, null, 2), 'utf8');
                console.log(`Postman collection written to ${outputFilePath}`);
                core.setOutput('postman_collection', outputFilePath);
            } else {
                core.setOutput('postman_collection', JSON.stringify(postmanCollection, null, 2));
            }
          }
        }
      );
}

run();