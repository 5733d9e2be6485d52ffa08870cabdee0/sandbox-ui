// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.getProviders": {
      type: "done.invoke.getProviders";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.getProviders": {
      type: "error.platform.getProviders";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    fetchCloudProviders: "done.invoke.getProviders";
  };
  missingImplementations: {
    actions: "notifyProviderUnavailable";
    services: "fetchCloudProviders";
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    notifyProviderUnavailable: "" | "error.platform.getProviders";
    setProvider: "providerChange";
    setProviders: "done.invoke.getProviders";
    setRegion: "regionChange";
  };
  eventsCausingServices: {
    fetchCloudProviders: "providerChange" | "regionChange" | "xstate.init";
  };
  eventsCausingGuards: {
    availableProviders: "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "failure"
    | "fetching providers"
    | "ready"
    | "service unavailable"
    | "verify availability";
  tags: never;
}
