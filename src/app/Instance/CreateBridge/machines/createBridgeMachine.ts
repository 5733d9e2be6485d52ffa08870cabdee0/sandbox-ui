import { assign, createMachine, send } from "xstate";
import { BridgeResponse } from "@rhoas/smart-events-management-sdk";

interface CreateBridgeMachineContext {
  name?: string;
  providers: {
    selectedCloudProvider: string | undefined;
    selectedCloudRegion: string | undefined;
  };
  selectedProvider: {
    providerId: string | undefined;
    regionId: string | undefined;
  };
  errorHandler: {
    method: string | undefined;
    parameters: Record<string, unknown> | undefined;
  };
  error: string | null;
}

const createBridgeMachine = createMachine(
  {
    id: "createBridgeMachine",
    initial: "configuring",
    tsTypes: {} as import("./createBridgeMachine.typegen").Typegen0,
    schema: {
      context: {} as CreateBridgeMachineContext,
      events: {} as
        | { type: "fieldInvalid" }
        | { type: "nameChange"; name: string }
        | { type: "providerChange"; providerId?: string; regionId?: string }
        | {
            type: "errorHandlerChange";
            method: string | undefined;
            parameters: Record<string, unknown> | undefined;
          }
        | { type: "create" }
        | { type: "cloudProvidersError" }
        | { type: "submit" },
      services: {} as {
        createBridge: {
          data: BridgeResponse;
        };
      },
    },
    context: {
      name: undefined,
      providers: {
        selectedCloudProvider: undefined,
        selectedCloudRegion: undefined,
      },
      selectedProvider: {
        providerId: undefined,
        regionId: undefined,
      },
      errorHandler: {
        method: undefined,
        parameters: undefined,
      },
      error: null,
    },
    states: {
      configuring: {
        type: "parallel",
        states: {
          status: {
            initial: "unsubmitted",
            states: {
              unsubmitted: {
                tags: "unsubmitted",
              },
              submitted: {
                tags: "submitted",
              },
            },
            on: {
              create: {
                description:
                  "Save is enabled all the time, if it's clicked before the form is completely filled out we should show the validation for all errored fields",
                actions: "triggerSubmit",
                target: ".submitted",
              },
            },
          },
          form: {
            initial: "invalid",
            states: {
              invalid: {
                tags: "formInvalid",
              },
              valid: {
                tags: "creatable",
                on: {
                  fieldInvalid: {
                    target: "invalid",
                  },
                  submit: [
                    {
                      cond: "errorHandlerIsValid",
                      target: "saving",
                    },
                    {
                      target: "invalid",
                    },
                  ],
                },
              },
              saving: {
                invoke: {
                  id: "saveBridge",
                  src: "createBridge",
                  onDone: {
                    target: "saved",
                  },
                  onError: {
                    target: "invalid",
                  },
                },
              },
              saved: {
                type: "final",
                entry: "onCreateBridge",
              },
            },
            on: {
              fieldInvalid: {
                description:
                  "sent by the fields when their value change to an invalid value. This will transition the form to the invalid state, to then eventually transition to the valid state if the field state is marked as done (which means that all fields have a valid value selected)",
                target: ".invalid",
              },
            },
          },
          fields: {
            tags: "configurable",
            type: "parallel",
            states: {
              name: {
                initial: "validate",
                states: {
                  empty: {
                    tags: "nameEmpty",
                  },
                  invalid: {
                    entry: "fieldInvalid",
                    tags: "nameInvalid",
                  },
                  valid: {
                    tags: "nameValid",
                    type: "final",
                  },
                  validate: {
                    always: [
                      {
                        // get rid of name empty and just use name invalid
                        cond: "nameIsEmpty",
                        target: "empty",
                      },
                      {
                        cond: "nameIsValid",
                        target: "valid",
                      },
                      {
                        target: "invalid",
                      },
                    ],
                  },
                },
                on: {
                  create: {
                    target: ".validate",
                  },
                  nameChange: {
                    actions: "setName",
                    target: ".validate",
                  },
                },
              },
              errorHandler: {
                initial: "validate",
                states: {
                  invalid: {
                    entry: "fieldInvalid",
                    tags: "EHInvalid",
                  },
                  valid: {
                    tags: "EHvalid",
                    type: "final",
                  },
                  validate: {
                    always: [
                      {
                        cond: "errorHandlerIsValid",
                        target: "valid",
                      },
                      {
                        target: "invalid",
                      },
                    ],
                  },
                },
                on: {
                  create: {
                    target: ".validate",
                  },
                  errorHandlerChange: {
                    actions: "setErrorHandler",
                    target: ".validate",
                    cond: "isSubmitted",
                  },
                },
              },
            },
            on: {
              providerChange: {
                actions: "setProvider",
              },
              // errorHandlerChange: {
              //   actions: "setErrorHandler",
              // },
            },
            onDone: {
              target: "#createBridgeMachine.configuring.form.valid",
            },
          },
        },
      },
      failure: {},
      saved: {
        type: "final",
      },
    },
  },
  {
    actions: {
      setName: assign((context, { name }) => {
        return { ...context, name };
      }),
      setProvider: assign((context, { providerId, regionId }) => {
        return {
          ...context,
          selectedProvider: {
            providerId,
            regionId,
          },
        };
      }),
      setErrorHandler: assign((context, { method, parameters }) => {
        return {
          ...context,
          errorHandler: {
            method,
            parameters,
          },
        };
      }),
      fieldInvalid: send("fieldInvalid"),
      triggerSubmit: send("submit"),
    },
    guards: {
      nameIsEmpty: ({ name }) => name === undefined || name.trim().length === 0,
      nameIsValid: ({ name }) => name !== undefined && name.trim().length > 0,
      isSubmitted: (_context, _event, meta) => meta.state.hasTag("submitted"),
    },
  }
);

export default createBridgeMachine;
