import { assign, createMachine, send } from "xstate";
import { CreateInstanceError } from "@app/Instance/CreateInstance/types";

interface CreateInstanceMachineContext {
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
  creationError: CreateInstanceError | undefined;
}

const createInstanceMachine = createMachine(
  {
    tsTypes: {} as import("./createInstanceMachine.typegen").Typegen0,
    schema: {
      context: {} as CreateInstanceMachineContext,
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
        | { type: "createError"; error: CreateInstanceError }
        | { type: "providersAvailabilityError"; error: CreateInstanceError }
        | { type: "cloudProvidersError" }
        | { type: "submit" },
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
      creationError: undefined,
    },
    id: "createInstanceMachine",
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
                    target: "#createInstanceMachine.unavailable",
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
              target: "#createInstanceMachine.saved",
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
                        cond: "isNameEmpty",
                        target: "empty",
                      },
                      {
                        cond: "isNameValid",
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
            },
            onDone: {
              target: "#createInstanceMachine.configuring.form.valid",
            },
          },
        },
        on: {
          providersAvailabilityError: {
            actions: "setCreationError",
            target: "#createInstanceMachine.unavailable",
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
      isNameEmpty: ({ name }) => name === undefined || name.trim().length === 0,
      isNameValid: ({ name, creationError }) =>
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

export default createInstanceMachine;
