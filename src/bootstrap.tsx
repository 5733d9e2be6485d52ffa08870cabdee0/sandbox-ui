import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import AppMocked from "./AppMocked";
import { inspect } from "@xstate/inspect";

// rendering the app with mocked APIs or the regular one based on env MOCKED_API
if (process.env.MOCKED_API) {
  // xstate inspection
  inspect({
    iframe: false,
  });
  ReactDOM.render(<AppMocked />, document.getElementById("root"));
} else {
  ReactDOM.render(<App />, document.getElementById("root"));
}
