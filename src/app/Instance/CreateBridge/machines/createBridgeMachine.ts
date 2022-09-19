import { assign, createMachine, send } from "xstate";

interface CreateBridgeMachineContext {
  name?: string;
  providers: {
    selectedCloudProvider: string | undefined;
    selectedCloudRegion: string | undefined;
  };
  error: string | null;
  info: string | null;
}

const createBridgeMachine = createMachine(
  {
    id: "createBridge",
    initial: "configuring",
    tsTypes: {} as import("./createBridgeMachine.typegen").Typegen0,
    schema: {
      context: {} as CreateBridgeMachineContext,
      events: {} as
        | { type: "fieldInvalid" }
        | { type: "nameChange"; name: string }
        | { type: "create" }
        | { type: "cloudProvidersError" },
    },
    context: {
      name: undefined,
      providers: {
        selectedCloudProvider: undefined,
        selectedCloudRegion: undefined,
      },
      error: null,
      info: "hello create bridge",
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
                // entry: "triggerSubmit",
                tags: "submitted",
              },
            },
            on: {
              create: {
                description:
                  "Save is enabled all the time, if it's clicked before the form is completely filled out we should show the validation for all errored fields",
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
                  // submit: {
                  //   target: "saving",
                  // },
                },
              },
              saving: {},
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
          },
          fields: {
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
                        cond: "nameIsEmpty",
                        target: "empty",
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
            },
          },
        },
      },
      failure: {},
      success: {},
    },
  },
  {
    actions: {
      setName: assign((context, { name }) => {
        return { ...context, name };
      }),
      fieldInvalid: send("fieldInvalid"),
    },
    guards: {
      nameIsEmpty: ({ name }) => name === undefined || name.trim().length === 0,
    },
  }
);

export default createBridgeMachine;
