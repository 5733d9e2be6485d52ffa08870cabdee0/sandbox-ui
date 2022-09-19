import { assign, createMachine } from "xstate";
import { CloudProviderWithRegions } from "../../../../types/Providers";
import { getFirstAvailableRegion } from "@app/Instance/CreateBridge/utils";

interface CloudProvidersMachineContext {
  cloudProviders: CloudProviderWithRegions[];
  selectedCloudProvider?: string;
  selectedCloudRegion?: string;
}

const cloudProvidersMachine = createMachine(
  {
    id: "cloudProvidersMachine",
    initial: "fetching providers",
    tsTypes: {} as import("./cloudProvidersMachine.typegen").Typegen0,
    schema: {
      context: {} as CloudProvidersMachineContext,
      events: {} as
        | { type: "providerChange"; providerId: string }
        | { type: "regionChange"; regionId: string },
      services: {} as {
        fetchCloudProviders: {
          data: CloudProviderWithRegions[];
        };
      },
    },
    context: {
      cloudProviders: [],
      selectedCloudProvider: undefined,
      selectedCloudRegion: undefined,
    },
    states: {
      "fetching providers": {
        invoke: {
          id: "getProviders",
          src: "fetchCloudProviders",
          onDone: {
            actions: "setProviders",
            target: "verify availability",
          },
          onError: {
            target: "failure",
          },
        },
      },
      "verify availability": {
        always: [
          {
            cond: "availableProviders",
            target: "ready",
          },
          {
            target: "service unavailable",
          },
        ],
      },
      ready: {},
      failure: {
        type: "final",
      },
      "service unavailable": {
        type: "final",
      },
    },
    on: {
      providerChange: {
        actions: "setProvider",
        target: "ready",
      },
      regionChange: {
        actions: "setRegion",
        target: "ready",
      },
    },
  },
  {
    actions: {
      setProviders: assign((context, event) => {
        const providers = event.data;
        const { providerId, regionId } = getFirstAvailableRegion(providers);
        return {
          ...context,
          cloudProviders: event.data,
          selectedCloudRegion: regionId,
          selectedCloudProvider: providerId,
        };
      }),
      setProvider: assign((context, event) => {
        console.log("inside setProvider action");
        return {
          ...context,
          selectedCloudProvider: event.providerId,
        };
      }),
      setRegion: assign((context, event) => {
        console.log("inside set region action");
        return {
          ...context,
          selectedCloudRegion: event.regionId,
        };
      }),
    },
    guards: {
      availableProviders: ({ selectedCloudProvider, selectedCloudRegion }) =>
        selectedCloudProvider !== undefined &&
        selectedCloudRegion !== undefined,
    },
  }
);

export default cloudProvidersMachine;
