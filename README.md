[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

# Sandbox UI

Sandbox UI for the smartevents application.

## Prerequisites

- Node 16
- npm 7

### Code formatting

The project requires the code to be formatted by `prettier`. This is done automatically as a `pre-commit` hook. To activate the hook, please initialize the project with the command below.

```
npm install
```

If you would like to format code manually, you can do it as:

```
npm run format
```

## Run the UI as a standalone application

```sh
npm install
npm run start
```

This will start the standalone app on `https://prod.foo.redhat.com:1337/`.

- make sure you have `127.0.0.1 prod.foo.redhat.com` in your hosts file for this to work.

## Run the UI as a federated module

```sh
npm install
npm run start:federate
```

This will run a dev server on http://localhost:9006 that will serve a federated module named `smartevents`.

## OpenAPI TS SDK

The OpenAPI SDK is located in the `openapi/generated` directory.

It's possible to generate a fresh SDK by running:

```sh
npm run fetch-openapi
npm run generate-openapi
```

The first script will download the OpenAPI spec from the `sandbox` repo, replacing `openapi/smart-events.yml`.

The second one will delete the existing SDK and generate a new one.
