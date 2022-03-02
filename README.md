[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

# Sandbox UI

Sandbox UI for the bridge application.

## Prerequisites
* Node 16
* npm 7

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

This will run a dev server on http://localhost:9006 that will serve a federated module named `openbridge`.