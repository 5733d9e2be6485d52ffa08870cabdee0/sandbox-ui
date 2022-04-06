import { IRow } from "@patternfly/react-table";

export interface Instance extends IRow {
  id: string;
  name: string;
  status: string;
  submitted_at: string;
}
