import { ManagedResourceStatus } from "@openapi/generated";

export const CreationStatusOrder: ManagedResourceStatus[] = [
  ManagedResourceStatus.Accepted,
  ManagedResourceStatus.Preparing,
  ManagedResourceStatus.Provisioning,
];
