import { assign, createMachine, send } from "xstate";
import { CreateBridgeError } from "@app/Instance/CreateBridge/types";

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
  creationError: CreateBridgeError | undefined;
  error: string | null;
}

const createBridgeMachine = createMachine(
  {
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
        | { type: "createSuccess" }
        | { type: "createError"; error: CreateBridgeError }
        | { type: "providersAvailabilityError"; error: CreateBridgeError }
        | { type: "cloudProvidersError" }
        | { type: "submit" },
      // services: {} as {
      //   createBridge: {
      //     data: BridgeResponse;
      //   };
      // },
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
      creationError: undefined,
    },
    id: "createBridgeMachine",
    initial: "configuring",
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
                always: [
                  {
                    cond: "isProviderUnavailable",
                    target: "#createBridgeMachine.unavailable",
                  },
                  {
                    cond: "isGenericError",
                    target: "valid",
                  },
                ],
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
                entry: ["resetCreationErrorMessage"],
                invoke: {
                  id: "saveBridge",
                  src: "createBridge",
                },
                on: {
                  createSuccess: {
                    target: "saved",
                  },
                  createError: {
                    actions: "setCreationError",
                    target: "invalid",
                  },
                },
              },
              saved: {
                type: "final",
              },
            },
            on: {
              fieldInvalid: {
                description:
                  "sent by the fields when their value change to an invalid value. This will transition the form to the invalid state, to then eventually transition to the valid state if the field state is marked as done (which means that all fields have a valid value selected)",
                target: ".invalid",
              },
            },
            onDone: {
              target: "#createBridgeMachine.saved",
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
        on: {
          providersAvailabilityError: {
            actions: "setCreationError",
            target: "#createBridgeMachine.unavailable",
          },
        },
      },
      saved: {
        type: "final",
      },
      unavailable: {
        tags: "creationUnavailable",
        type: "final",
      },
    },
  },
  {
    actions: {
      setName: assign((context, { name }) => {
        return {
          ...context,
          name,
          ...(context.creationError === "name-taken"
            ? { creationError: undefined }
            : {}),
        };
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
      setCreationError: assign((context, { error }) => {
        return {
          ...context,
          creationError: error,
        };
      }),
      resetCreationErrorMessage: assign((context) => ({
        ...context,
        creationError: undefined,
      })),
      fieldInvalid: send("fieldInvalid"),
      triggerSubmit: send("submit"),
    },
    guards: {
      nameIsEmpty: ({ name }) => name === undefined || name.trim().length === 0,
      nameIsValid: ({ name, creationError }) =>
        name !== undefined &&
        name.trim().length > 0 &&
        creationError !== "name-taken",
      isSubmitted: (_context, _event, meta) => meta.state.hasTag("submitted"),
      isGenericError: ({ creationError }) => creationError === "generic-error",
      isProviderUnavailable: ({ creationError }) =>
        creationError === "region-unavailable",
    },
  }
);

export default createBridgeMachine;
