// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.getUser": {
      type: "done.invoke.getUser";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.getUser": { type: "error.platform.getUser"; data: unknown };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchCloudProviders: "done.invoke.getUser";
  };
  missingImplementations: {
    actions: never;
    services: "fetchCloudProviders";
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    setProviders: "done.invoke.getUser";
  };
  eventsCausingServices: {
    fetchCloudProviders: "xstate.init";
  };
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "failure" | "idle" | "success";
  tags: never;
}
