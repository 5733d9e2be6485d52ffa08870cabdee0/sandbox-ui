import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";

const canDeleteResource = (resourceStatus: ManagedResourceStatus): boolean => {
  /** It's only possible to delete a resource if it's in the "ready" or "failed" status
   * see https://issues.redhat.com/browse/MGDOBR-398 for more details */
  return (
    resourceStatus === ManagedResourceStatus.Ready ||
    resourceStatus === ManagedResourceStatus.Failed
  );
};

export { canDeleteResource };
