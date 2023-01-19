// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  "internalEvents": {
    "xstate.init": { type: "xstate.init" };
  };
  "invokeSrcNameMap": {
    createProcessor: "done.invoke.processor.processor deployment.saving:invocation[0]";
  };
  "missingImplementations": {
    actions: never;
    services: "createProcessor";
    guards: never;
    delays: never;
  };
  "eventsCausingActions": {
    clearSelectedTemplate: "skip template";
    resetCreationErrorMessage: "close error alert";
    setCode: "change code";
    setCreationError: "create error";
    setProcessorName: "change processor name";
    setSelectedTemplate: "select template";
    setValidation: "update validation";
  };
  "eventsCausingServices": {
    createProcessor: "create processor";
  };
  "eventsCausingGuards": {
    "code is valid": "create processor";
  };
  "eventsCausingDelays": {};
  "matchesStates":
    | "code editing"
    | "code editing.deploy blocked"
    | "code editing.editing"
    | "processor deployment"
    | "processor deployment.saved"
    | "processor deployment.saving"
    | "template selection"
    | {
        "code editing"?: "deploy blocked" | "editing";
        "processor deployment"?: "saved" | "saving";
      };
  "tags": "step 1" | "step 2";
}
