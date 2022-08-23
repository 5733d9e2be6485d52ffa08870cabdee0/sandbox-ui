## RHOSE UI - Integration tests

This project contains Cypress test suites to verify UI of RHOSE.

All steps should be performed from the sandbox-ui root folder (it means `cd ..`).

Integration tests are running as GitHub Actions:

- Smart Events UI :: Mocked :: Quality Checks ([the workflow definition](../../.github/workflows/quality-checks.yml))
- Smart Events UI :: Dev :: Quality Checks ([the workflow definition](../../.github/workflows/quality-checks-e2e.yml))

### Run integration tests with mocked data

This is a basis test suite which should verify that UI is running and mocked data are shown as expected.

#### Steps

Follow steps from the root README how to set up the environment to run RHOSE UI.

```
npm run start:mocked
```

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

**Set credentials for E2E tests**

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

### How to create tests

If you want to write your own test than you should:

- create a new '\*.ts' file in the [integration](integration) folder
- write the content of the test suite. The skeleton can be:

```
describe("The New Test - describe briefly ", () => {

    beforeEach(() => {
    ...
    });

    it("Test 1", () => {
    ...
    });

    it("Test 2", () => {
    ...
    });

    describe("Feature 0", () => {
        beforeEach(() => {
            ...
        });

        it("Valid input", () => {
            ...
        });

        it("Error input", () => {
            ...
        });
    });

    describe("Feature 1", () => {

        it("Valid input", () => {
            ...
        });

        it("Error input", () => {
            ...
        });
    });
});
```

- You can use functions in [Utils](utils/Util.ts)
- You can use commands in [Support](support)

Such test will run in both quality checks GitHub Actions.
Note: our target is run 90 % of tests on both environment.

In case that your test is possible to run only with one environment, please define it by:

- Import

```
import { onlyOn } from "@cypress/skip-test";
import { isEnvironmentType, EnvType } from "../utils/Util";
```

- Marked test suite as

```
onlyOn(isEnvironmentType(EnvType.Mocked), () => {
  describe("Test 1", () => {
    ...
  });
});
```

or

```
onlyOn(isEnvironmentType(EnvType.Dev), () => {
  it("Test 2", () => {
    ...
  });
});
```
