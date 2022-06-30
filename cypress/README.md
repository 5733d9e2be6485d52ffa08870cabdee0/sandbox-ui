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
export OPENSHIFT_OFFLINE_TOKEN=<REPLACE WITH YOUR TOKEN>
export CYPRESS_OB_TOKEN="$(curl -s --insecure -X POST https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'client_id=cloud-services' --data-urlencode 'grant_type=refresh_token' --data-urlencode "refresh_token=$OPENSHIFT_OFFLINE_TOKEN" | jq --raw-output '.access_token')"
```

Set `USER` and `PASSWORD` in [the configuration](cypress.e2e.json).

If the test suite fail as Unauthorized than perform again:

```
export CYPRESS_OB_TOKEN="$(curl -s --insecure -X POST https://sso.redhat.com/auth/realms/redhat-external/protocol/openid-connect/token --header 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'client_id=cloud-services' --data-urlencode 'grant_type=refresh_token' --data-urlencode "refresh_token=$OPENSHIFT_OFFLINE_TOKEN" | jq --raw-output '.access_token')"

```

**Run E2E tests**

```
npm run cypress:open:e2e
```

Clear entities which were added by the test suite.

## Run UI with real data locally

This section is not the supported usecase. The target is to bring an idea how validate new features in the sandbox and sanbox-ui repository locally.

Revert this pull request [#31](https://github.com/5733d9e2be6485d52ffa08870cabdee0/sandbox-ui/pull/31/files).

First, you have to run the backend:

- Follow [the environment set up](https://github.com/5733d9e2be6485d52ffa08870cabdee0/sandbox/blob/main/dev/README.md)
- Follow [DEMO](https://github.com/5733d9e2be6485d52ffa08870cabdee0/sandbox/blob/main/DEMO.md).
- Change the port of the Shard operator in the sandbox repository -> sandbox-ui has similar port as operator
  https://github.com/5733d9e2be6485d52ffa08870cabdee0/sandbox/blob/ff5feff0c21de5d876e7ce50b5840e32232e9fe9/dev/bin/shard-run.sh#L16

### upgrade version of the `keycloak-js` package

It is very important step. Do not forget to delete `promiseType: "native"`. It is not supported by this version.

### change creditals

The guides contain all important creditals. Focus on the setting of [the `OB_TOKEN`](https://github.com/5733d9e2be6485d52ffa08870cabdee0/sandbox/blob/main/DEMO.md#authentication).

| Name                   | How to set it                                                                                                  |
| :--------------------- | -------------------------------------------------------------------------------------------------------------- |
| `realm`                | It is mentioned in the curl command as a part of the url: `auth/realms/**event-bridge-fm**/protocol`           |
| `url`                  | Use the output if this command `echo "http://${KEYCLOAK_UR}/auth/"`. Do not use https, just the http protocol. |
| `clientId`             | It is mentioned in the curl command as `--user **event-bridge**`                                               |
| `login` and `password` | It is mentioned in the curl command as `-d 'username=kermit&password=thefrog&grant_type=password'`             |

### set BASE_URL

Go to [the .env file](https://github.com/5733d9e2be6485d52ffa08870cabdee0/sandbox-ui/blob/main/.env) and set BASE_URL. As a value, use the output of this command `echo $MANAGER_URL`.
