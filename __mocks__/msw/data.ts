import { BridgeResponse } from "../../openapi/generated";

export const instancesData: BridgeResponse[] = [
  {
    kind: "Bridge",
    id: "3543edaa-1851-4ad7-96be-ebde7d20d717",
    name: "Instance one",
    href: "/api/v1/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717",
    submitted_at: "2022-04-12T12:04:43.044590+0000",
    published_at: "2022-04-12T12:06:22.881959+0000",
    status: "READY",
    endpoint:
      "https://ob-3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
  },
  {
    kind: "Bridge",
    id: "3af03c9c-ba8a-11ec-8422-0242ac120002",
    name: "Instance two",
    href: "/api/v1/bridges/3af03c9c-ba8a-11ec-8422-0242ac120002",
    submitted_at: "2022-04-12T12:36:43.044590+0000",
    published_at: "2022-04-12T12:38:22.881959+0000",
    status: "READY",
    endpoint:
      "https://ob-3af03c9c-ba8a-11ec-8422-0242ac120002.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
  },
];
