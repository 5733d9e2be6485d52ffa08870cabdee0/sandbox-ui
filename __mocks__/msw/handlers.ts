import { rest } from "msw";
import { factory, primaryKey } from "@mswjs/data";
import { BridgeRequest } from "../../openapi/generated";
import { v4 as uuid } from "uuid";

const db = factory({
  bridge: {
    id: primaryKey(String),
    name: String,
    kind: String,
    href: String,
    submitted_at: String,
    published_at: String,
    status: String,
    endpoint: String,
  },
});

db.bridge.create({
  kind: "Bridge",
  id: "3543edaa-1851-4ad7-96be-ebde7d20d717",
  name: "re-test-01",
  href: "/api/v1/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717",
  submitted_at: "2022-04-12T12:04:43.044590+0000",
  published_at: "2022-04-12T12:06:22.881959+0000",
  status: "ready",
  endpoint:
    "https://ob-3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
});

db.bridge.create({
  kind: "Bridge",
  id: "3af03c9c-ba8a-11ec-8422-0242ac120002",
  name: "re-test-02",
  href: "/api/v1/bridges/3af03c9c-ba8a-11ec-8422-0242ac120002",
  submitted_at: "2022-04-12T12:36:43.044590+0000",
  published_at: "2022-04-12T12:38:22.881959+0000",
  status: "ready",
  endpoint:
    "https://ob-3af03c9c-ba8a-11ec-8422-0242ac120002.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
});

export const handlers = [
  rest.get("/bridges", (_req, res, ctx) => {
    return res(ctx.status(200), ctx.delay(2000), ctx.json(db.bridge.getAll()));
  }),

  rest.post("/bridges", (req, res, ctx) => {
    const { name } = req.body as BridgeRequest;
    const id = uuid();
    const bridge = {
      kind: "Bridge",
      id,
      name,
      href: `/api/v1/bridges/${id}`,
      submitted_at: new Date().toISOString(),
      status: "accepted",
    };

    db.bridge.create(bridge);

    return res(
      ctx.status(200),
      ctx.delay(2000),
      ctx.json(
        db.bridge.findFirst({
          where: {
            id: {
              equals: id,
            },
          },
        })
      )
    );
  }),
];
