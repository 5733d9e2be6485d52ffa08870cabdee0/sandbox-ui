// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
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
  invokeSrcNameMap: {
    createBridge: "done.invoke.saveBridge";
  };
  missingImplementations: {
    actions: never;
    services: "createBridge";
    guards: "errorHandlerIsValid";
    delays: never;
  };
  eventsCausingActions: {
    fieldInvalid: "";
    resetCreationErrorMessage: "submit";
    setCreationError: "createError" | "providersAvailabilityError";
    setErrorHandler: "errorHandlerChange";
    setName: "nameChange";
    setProvider: "providerChange";
    triggerSubmit: "create";
  };
  eventsCausingServices: {
    createBridge: "submit";
  };
  eventsCausingGuards: {
    errorHandlerIsValid: "" | "submit";
    isGenericError: "";
    isNameEmpty: "";
    isNameValid: "";
    isProviderUnavailable: "";
    isSubmitted: "errorHandlerChange";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "configuring"
    | "configuring.fields"
    | "configuring.fields.errorHandler"
    | "configuring.fields.errorHandler.invalid"
    | "configuring.fields.errorHandler.valid"
    | "configuring.fields.errorHandler.validate"
    | "configuring.fields.name"
    | "configuring.fields.name.empty"
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
              fields?:
                | "errorHandler"
                | "name"
                | {
                    errorHandler?: "invalid" | "valid" | "validate";
                    name?: "empty" | "invalid" | "valid" | "validate";
                  };
              form?: "invalid" | "saved" | "saving" | "valid";
              status?: "submitted" | "unsubmitted";
            };
      };
  tags:
    | "EHInvalid"
    | "EHvalid"
    | "configurable"
    | "creatable"
    | "creationUnavailable"
    | "formInvalid"
    | "nameEmpty"
    | "nameInvalid"
    | "nameValid"
    | "submitted"
    | "unsubmitted";
}
