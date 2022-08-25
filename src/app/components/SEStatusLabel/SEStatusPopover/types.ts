import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";

export const CreationStatusOrder: ManagedResourceStatus[] = [
  ManagedResourceStatus.Accepted,
  ManagedResourceStatus.Preparing,
  ManagedResourceStatus.Provisioning,
];
