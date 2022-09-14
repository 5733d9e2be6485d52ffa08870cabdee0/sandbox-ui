import { assign, createMachine } from "xstate";
import {
  CloudProviderResponse,
  CloudRegionResponse,
} from "@rhoas/smart-events-management-sdk";

interface CreateBridgeMachineContext {
  providers: {
    cloudProviders: CloudProviderResponse[] | null;
    selectedCloudProvider: string | null;
    cloudRegions: CloudRegionResponse[] | null;
    selectedCloudRegion: string | null;
  };
  error: string | null;
}

const createBridgeMachine = createMachine(
  {
    id: "createBridge",
    initial: "idle",
    tsTypes: {} as import("./createBridgeMachine.typegen").Typegen0,
    schema: {
      context: {} as CreateBridgeMachineContext,
      services: {} as {
        fetchCloudProviders: {
          data: CloudProviderResponse[];
        };
      },
    },
    context: {
      providers: {
        cloudProviders: null,
        selectedCloudProvider: null,
        cloudRegions: null,
        selectedCloudRegion: null,
      },
      error: null,
    },
    states: {
      idle: {
        invoke: {
          id: "getUser",
          src: "fetchCloudProviders",
          onDone: {
            actions: "setProviders",
            target: "success",
          },
          // onError: {
          //   target: "failure",
          //   actions: assign({ error: "error" }),
          // },
        },
      },
      failure: {},
      success: {},
    },
  },
  {
    actions: {
      setProviders: assign((context, event) => {
        return {
          ...context,
          providers: {
            ...context.providers,
            cloudProviders: event.data,
          },
        };
      }),
    },
  }
);

export default createBridgeMachine;
