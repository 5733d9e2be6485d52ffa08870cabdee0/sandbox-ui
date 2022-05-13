import { IRow } from "@patternfly/react-table";

export interface Instance extends IRow {
  id?: string;
  endpoint?: string;
  name?: string;
  published_at?: string;
  status?: string;
  submitted_at?: string;
}
