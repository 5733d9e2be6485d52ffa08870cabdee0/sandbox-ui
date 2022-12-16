import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";

export type ResourceStatus = ManagedResourceStatus & "creating";

export const CREATING_STATUS = "creating";

export function getUserFacingStatuses(
  statusesReq?: ResourceStatus[]
): Set<ManagedResourceStatus> | undefined {
  return statusesReq?.reduce((set, status) => {
    if (status === CREATING_STATUS) {
      set.add(ManagedResourceStatus.Accepted);
      set.add(ManagedResourceStatus.Preparing);
      set.add(ManagedResourceStatus.Provisioning);
    } else {
      set.add(status);
    }
    return set;
  }, new Set<ManagedResourceStatus>());
}
