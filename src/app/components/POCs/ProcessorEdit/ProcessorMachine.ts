import { assign, createMachine } from "xstate";
import { ProcessorTemplate } from "@app/components/POCs/ProcessorEdit/ProcessorTemplates";

interface ProcessorMachineContext {
  processorName: string;
  templates: ProcessorTemplate[];
  selectedTemplate: string | null;
  code: string;
  codeErrors: number;
  sinkSuggestions: string[];
}

const createProcessorMachine = createMachine(
  {
    tsTypes: {} as import("./ProcessorMachine.typegen").Typegen0,
    schema: {
      context: {} as ProcessorMachineContext,
      events: {} as
        | { type: "next step" }
        | { type: "select template"; templateId: string }
        | { type: "skip template" }
        | { type: "change processor name"; name: string }
        | { type: "change code"; value: string }
        | { type: "update validation"; errorsCount: number }
        | { type: "close invalid alert" }
        | { type: "create processor" }
        | { type: "create success" }
        | { type: "create error" },
    },
    context: {
      processorName: "",
      templates: [],
      selectedTemplate: null,
      code: "",
      codeErrors: 0,
      sinkSuggestions: [],
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    id: "processor",
    initial: "template selection",
    states: {
      "template selection": {
        tags: "step 1",
        on: {
          "next step": {
            target: "code editing",
          },
          "select template": {
            actions: "setSelectedTemplate",
          },
          "skip template": {
            actions: "clearSelectedTemplate",
            target: "code editing",
          },
          "change processor name": {
            actions: "setProcessorName",
          },
        },
      },
      "code editing": {
        tags: "step 2",
        initial: "editing",
        states: {
          "editing": {},
          "deploy blocked": {
            on: {
              "close invalid alert": {
                target: "editing",
              },
            },
          },
        },
        on: {
          "change code": {
            actions: "setCode",
          },
          "update validation": {
            actions: "setValidation",
          },
          "create processor": [
            {
              target: "processor deployment",
              cond: "code is valid",
            },
            {
              target: "code editing.deploy blocked",
              internal: false,
            },
          ],
          "change processor name": {
            actions: "setProcessorName",
          },
        },
      },
      "processor deployment": {
        tags: "step 2",
        initial: "saving",
        states: {
          saving: {
            invoke: {
              src: "createProcessor",
            },
            on: {
              "create success": {
                target: "saved",
              },
              "create error": {
                target: "#processor.code editing",
              },
            },
          },
          saved: {
            type: "final",
          },
        },
      },
    },
  },
  {
    actions: {
      setSelectedTemplate: assign((context, { templateId }) => {
        return {
          selectedTemplate: templateId,
          code: context.templates.find((template) => template.id === templateId)
            ?.code,
        };
      }),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      clearSelectedTemplate: assign((_context) => ({
        selectedTemplate: null,
        code: "",
      })),
      setProcessorName: assign((_context, { name }) => {
        return {
          processorName: name,
        };
      }),
      setCode: assign((_context, { value }) => {
        return {
          code: value,
        };
      }),
      setValidation: assign((_context, { errorsCount }) => {
        return {
          codeErrors: errorsCount,
        };
      }),
    },
    guards: {
      "code is valid": ({ codeErrors }) => codeErrors === 0,
    },
  }
);

export default createProcessorMachine;
