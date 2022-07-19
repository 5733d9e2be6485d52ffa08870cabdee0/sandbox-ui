#!/usr/bin/env bash

echo "CYPRESS_OB_TOKEN="`curl -s --insecure -X POST https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'client_id=cloud-services' --data-urlencode 'grant_type=refresh_token' --data-urlencode "refresh_token=$TOKEN" | jq --raw-output '.access_token'`

