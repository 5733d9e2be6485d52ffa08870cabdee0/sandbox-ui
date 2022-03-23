#!/usr/bin/env bash

openapi_filename=$(dirname $0)/../openapi/smart-events.yaml
output_path=$(dirname $0)/../openapi/generated
package_name="smart-events"
additional_properties="ngVersion=6.1.7,npmName=${package_name},supportsES6=true,withInterfaces=true,withSeparateModelsAndApi=true,modelPackage=model,apiPackage=api"

npx @openapitools/openapi-generator-cli version-manager set 5.4.0
echo "Generating SDKs"

# validate the openapi spec for smart-events

echo "Validating OpenAPI ${openapi_filename}"
npx @openapitools/openapi-generator-cli validate -i "$openapi_filename"

echo "Clearing existing client"

# remove old generated models

rm -Rf $output_path/model $output_path/api

# generate an API client for smart-events

echo "Generating source code based on ${openapi_filename}"

npx --yes @openapitools/openapi-generator-cli generate -g typescript-axios --api-name-suffix "sdk" -i \
"$openapi_filename" -o "$output_path" \
--package-name=$package_name \
--additional-properties=$additional_properties
