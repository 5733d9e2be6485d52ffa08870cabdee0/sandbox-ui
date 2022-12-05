// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  "internalEvents": {
    "": { type: "" };
    "done.invoke.saveBridge": {
      type: "done.invoke.saveBridge";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.saveBridge": {
      type: "error.platform.saveBridge";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  "invokeSrcNameMap": {
    createBridge: "done.invoke.saveBridge";
  };
  "missingImplementations": {
    actions: never;
    services: "createBridge";
    guards: never;
    delays: never;
  };
  "eventsCausingActions": {
    fieldInvalid: "";
    resetCreationErrorMessage: "submit";
    resetSubmittedState: "createError";
    setCreationError: "createError" | "providersAvailabilityError";
    setName: "nameChange";
    setProvider: "providerChange";
    triggerSubmit: "create";
  };
  "eventsCausingServices": {
    createBridge: "submit";
  };
  "eventsCausingGuards": {
    isGenericError: "";
    isNameValid: "";
    isProviderUnavailable: "";
  };
  "eventsCausingDelays": {};
  "matchesStates":
    | "configuring"
    | "configuring.fields"
    | "configuring.fields.name"
    | "configuring.fields.name.invalid"
    | "configuring.fields.name.valid"
    | "configuring.fields.name.validate"
    | "configuring.form"
    | "configuring.form.invalid"
    | "configuring.form.saved"
    | "configuring.form.saving"
    | "configuring.form.valid"
    | "configuring.status"
    | "configuring.status.submitted"
    | "configuring.status.unsubmitted"
    | "saved"
    | "unavailable"
    | {
        configuring?:
          | "fields"
          | "form"
          | "status"
          | {
              fields?: "name" | { name?: "invalid" | "valid" | "validate" };
              form?: "invalid" | "saved" | "saving" | "valid";
              status?: "submitted" | "unsubmitted";
            };
      };
  "tags":
    | "configurable"
    | "creatable"
    | "creationUnavailable"
    | "formInvalid"
    | "nameInvalid"
    | "nameValid"
    | "submitted"
    | "unsubmitted";
}
