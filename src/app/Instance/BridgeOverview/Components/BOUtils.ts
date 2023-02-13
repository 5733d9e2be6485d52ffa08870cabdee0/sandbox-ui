import { ProcessorResponse } from "@rhoas/smart-events-management-sdk";
import { BOTableItem } from "./BODashboardTableView";

export const convertProcessorsToTableItems = (
  processorsList: ProcessorResponse[] | undefined,
  instanceId: string
): BOTableItem[] | undefined => {
  return processorsList?.map(
    ({ id, name, status, modified_at, submitted_at }) => ({
      id,
      name,
      status,
      modified_at,
      submitted_at,
      url: `/instance/${instanceId}/processor/${id}`,
      labels: [],
    })
  );
};
