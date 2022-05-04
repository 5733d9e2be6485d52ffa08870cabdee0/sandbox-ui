export const instancesData = [
  {
    kind: "Bridge",
    id: "3543edaa-1851-4ad7-96be-ebde7d20d717",
    name: "Instance one",
    href: "/api/v1/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717",
    submitted_at: "2022-04-12T12:04:43.044590+0000",
    published_at: "2022-04-12T12:06:22.881959+0000",
    status: "ready",
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
    status: "ready",
    endpoint:
      "https://ob-3af03c9c-ba8a-11ec-8422-0242ac120002.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
  },
];

export const processorData = [
  {
    kind: "Processor",
    id: "a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7",
    name: "Processor one",
    type: "sink",
    href: "/api/v1/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7",
    submitted_at: "2022-04-12T12:10:46.029400+0000",
    published_at: "2022-04-12T12:12:52.416527+0000",
    transformationTemplate: "Hi! This is a test message",
    status: "ready",
    action: {
      type: "Slack",
      parameters: {
        channel: "test",
        webhookUrl:
          "https://hooks.slack.com/services/XXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXX",
      },
    },
  },
  {
    kind: "Processor",
    id: "fa373030-c0d2-11ec-9d64-0242ac120002",
    name: "Processor two",
    type: "sink",
    href: "/api/v1/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/fa373030-c0d2-11ec-9d64-0242ac120002",
    submitted_at: "2022-04-15T12:10:46.029400+0000",
    published_at: "2022-04-15T12:12:52.416527+0000",
    filters: [
      {
        type: "StringEquals",
        key: "data.name",
        value: "John",
      },
    ],
    status: "ready",
    action: {
      type: "Slack",
      parameters: {
        channel: "test",
        webhookUrl:
          "https://hooks.slack.com/services/XXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXX",
      },
    },
  },
  {
    kind: "Processor",
    id: "f8f34af4-caed-11ec-9d64-0242ac120002",
    name: "Processor three",
    type: "source",
    href: "/api/v1/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/f8f34af4-caed-11ec-9d64-0242ac120002",
    submitted_at: "2022-04-15T12:10:46.029400+0000",
    published_at: "2022-04-15T12:12:52.416527+0000",
    filters: [
      {
        type: "StringEquals",
        key: "data.name",
        value: "John",
      },
    ],
    status: "ready",
    source: {
      type: "Slack",
      parameters: {
        channel: "test",
        token: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      },
    },
  },
];
