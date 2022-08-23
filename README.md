[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

# Sandbox UI

Sandbox UI for the smartevents application.

## Prerequisites

- Node 16.15.1
- npm 8.11.0

## Run the UI as a standalone application

```sh
npm install
npm run start
```

This will start the standalone app on `https://prod.foo.redhat.com:1337/`.

> **Note**
> Make sure you have `127.0.0.1 prod.foo.redhat.com` in your hosts file for this to work.
> This step needs to be done only once.

## Run the UI as a federated module

```sh
npm install
npm run start:federate
```

This will run a dev server on http://localhost:9006 that will serve a federated module named `smart_events`.

## Mocked APIs

Mocked APIs are available to facilitate development and testing.

They are located in the `mocked-api` folder, and they are implemented using a mocked service worker.

To run the mocked version of the app use the following commands:

```sh
npm install
npm run start:mocked
```

### Mocked features

The creation of bridges and processors is simulated with a quicker lifecycle (~30 seconds) to make developing and demoing easier.

It is possible to simulate a longer, more realistic, creation lifecycle (~1m:30s) by adding the word `wait` to a resource name (i.e. "Dummy instance wait").

Similarly, It is also possible to simulate a failure in the process of creating or deleting a resource. To do so, add the word `fail-create` or `fail-delete` to a resource name respectively.

### Limitations

Authentication is not supported. The mocked version of the application is served from `localhost` instead of `prod.foo.redhat.com`.

Any resource created while using the mocked version of the app will be lost after refreshing the page. No persistence layer is implemented.

## Code formatting

The project requires the code to be formatted by `prettier`. This is done automatically as a `pre-commit` hook. To activate the hook, please initialize the project with the command below.

```
npm install
```

If you would like to format code manually, you can do it as:

```
npm run format
```

## Error Catalog TS SDK

The structure containing the error catalog is located in the `openapi/generated/error.ts` file.

It's possible to generate a fresh version of it, by running:

```sh
npm run generate-error-catalog
```
