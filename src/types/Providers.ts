import {
  CloudProviderResponse,
  CloudRegionResponse,
} from "@rhoas/smart-events-management-sdk";

export interface CloudProviderWithRegions extends CloudProviderResponse {
  regions: CloudRegionResponse[];
}
