## RHOSE UI - Integration tests

This project contains Cypress test suites to verify UI of RHOSE.

All steps should be performed from the sandbox-ui root folder (it means `cd ..`).

### Run integration tests with mocked data

This is a basis test suite which should verify that UI is running and mocked data are shown as expected.

#### Steps

Follow steps from the root README how to set up the environment to run RHOSE UI.

To run Cypress test suite with mocked data

```
npm run test:it
```

### Run integration tests with real data

**Run UI**

Before you start. Please [set](../README.md) the environment which is required.

The UI runs against the url which is stored in [the .env file](https://github.com/5733d9e2be6485d52ffa08870cabdee0/sandbox-ui/blob/main/.env).
The default value of the `BASE_URL` is set to the DEV environment. It is shared environment. Please use the hash for each name of bridges to protect name conflict.

Then run:

```
npm run start
```

**Set credentials**

Get a valid offline [token](https://console.redhat.com/openshift/token).

```
export CYPRESS_USER=<replce with your value>
export CYPRESS_PASSWORD=<replce with your value>
export OPENSHIFT_OFFLINE_TOKEN=<REPLACE WITH YOUR TOKEN>
export CYPRESS_OB_TOKEN="$(curl -s --insecure -X POST https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'client_id=cloud-services' --data-urlencode 'grant_type=refresh_token' --data-urlencode "refresh_token=$OPENSHIFT_OFFLINE_TOKEN" | jq --raw-output '.access_token')"
```

If the test suite fail as Unauthorized than perform again:

```
export CYPRESS_OB_TOKEN="$(curl -s --insecure -X POST https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'client_id=cloud-services' --data-urlencode 'grant_type=refresh_token' --data-urlencode "refresh_token=$OPENSHIFT_OFFLINE_TOKEN" | jq --raw-output '.access_token')"

```

**Run E2E tests**

```
npm run cypress:open:e2e
```

Clear entities which were added by the test suite.
