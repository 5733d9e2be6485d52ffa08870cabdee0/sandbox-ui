#!/usr/bin/env bash

# get the download URL of the OpenAPI spec file
OPENAPI_FILE_URL="https://raw.githubusercontent.com/5733d9e2be6485d52ffa08870cabdee0/sandbox/main/openapi/rhose-api.yaml"
OPENAPI_FILE_NAME=$(dirname $0)/../openapi/smart-events.yaml

# download the OpenAPI file
curl "$OPENAPI_FILE_URL" --output $OPENAPI_FILE_NAME
if [ $? != 0 ]; then
  exit $?
fi

echo -e "# This file was downloaded automatically by 'fetch_openapi.sh'.\n# Do not edit this file manually!\n$(cat $OPENAPI_FILE_NAME)" > $OPENAPI_FILE_NAME
