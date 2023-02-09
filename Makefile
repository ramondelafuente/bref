.EXPORT_ALL_VARIABLES:

trigger_runtimes:
	aws codepipeline start-pipeline-execution --name bref-php-binary

runtime_build_status:
	aws codepipeline get-pipeline-state --name=bref-php-binary | jq ".stageStates[1].latestExecution.status"

# Generate and deploy the production version of the website using http://couscous.io
website: node_modules
	cd website && vercel pull
	cd website && vercel build --prod
	cd website && vercel --prebuilt --prod
node_modules:
	npm install

# Run a local preview of the website
website-preview: node_modules
	npm run dev

# Deploy the demo functions
demo:
	serverless deploy

layers.json:
	php utils/layers.json/update.php

test-stack:
	serverless deploy -c tests/serverless.tests.yml

.PHONY: website website-preview demo layers.json test-stack
