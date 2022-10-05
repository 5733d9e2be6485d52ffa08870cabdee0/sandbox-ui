import {
  CloudProviderResponse,
  CloudRegionResponse,
} from "@rhoas/smart-events-management-sdk";

export type CreateInstanceError =
  | "name-taken"
  | "region-unavailable"
  | "generic-error";

export interface CloudProviderWithRegions extends CloudProviderResponse {
  regions: CloudRegionResponse[];
}
