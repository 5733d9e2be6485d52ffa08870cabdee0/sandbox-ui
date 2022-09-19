// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: "errorHandlerIsValid";
    delays: never;
  };
  eventsCausingActions: {
    fieldInvalid: "";
    setErrorHandler: "errorHandlerChange";
    setName: "nameChange";
    setProvider: "providerChange";
  };
  eventsCausingServices: {};
  eventsCausingGuards: {
    errorHandlerIsValid: "";
    nameIsEmpty: "";
    nameIsValid: "";
  };
  eventsCausingDelays: {};
  matchesStates:
    | "configuring"
    | "configuring.fields"
    | "configuring.fields.errorHandler"
    | "configuring.fields.errorHandler.idle"
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
    | "failure"
    | "success"
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
                    errorHandler?: "idle" | "invalid" | "valid" | "validate";
                    name?: "empty" | "invalid" | "valid" | "validate";
                  };
              form?: "invalid" | "saved" | "saving" | "valid";
              status?: "submitted" | "unsubmitted";
            };
      };
  tags:
    | "EHInvalid"
    | "EHvalid"
    | "creatable"
    | "formInvalid"
    | "nameEmpty"
    | "nameInvalid"
    | "nameValid"
    | "submitted"
    | "unsubmitted";
}
