export enum ResourceStatus {
  READY,
  CREATING,
  UPDATING,
  DELETING,
  FAILED,
}

export enum ResourceStatusDelayed {
  WARNING = "warning",
  ERROR = "danger",
}
