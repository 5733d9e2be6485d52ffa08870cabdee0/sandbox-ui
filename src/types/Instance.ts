import { IRow } from "@patternfly/react-table";

export interface Instance extends IRow {
  id: string;
  endpoint: string;
  name: string;
  owner: string;
  published_at: string;
  status: string;
  submitted_at: string;
}
