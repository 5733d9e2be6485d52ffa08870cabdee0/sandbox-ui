import { assign, createMachine } from "xstate";
import { getFirstAvailableRegion } from "@app/Instance/CreateInstance/utils";
import { CloudProviderWithRegions } from "@app/Instance/CreateInstance/types";

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
      "ready": {
        type: "final",
        on: {
          providerChange: {
            actions: "setProvider",
          },
          regionChange: {
            actions: "setRegion",
          },
        },
      },
      "failure": {
        type: "final",
        entry: "notifyProviderUnavailable",
      },
      "service unavailable": {
        type: "final",
        entry: "notifyProviderUnavailable",
      },
    },
  },
  {
    actions: {
      setProviders: assign((_context, event) => {
        const providers = event.data;
        const { providerId, regionId } = getFirstAvailableRegion(providers);
        return {
          cloudProviders: event.data,
          selectedCloudRegion: regionId,
          selectedCloudProvider: providerId,
        };
      }),
      setProvider: assign((_context, event) => {
        return {
          selectedCloudProvider: event.providerId,
        };
      }),
      setRegion: assign((_context, event) => {
        return {
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
