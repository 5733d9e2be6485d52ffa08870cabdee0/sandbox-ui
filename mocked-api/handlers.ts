import { rest } from "msw";
import { factory, primaryKey } from "@mswjs/data";
import { BridgeRequest } from "../openapi/generated";
import { v4 as uuid } from "uuid";
import { instancesData } from "./data";

// api url
const apiUrl = `${process.env.BASE_URL ?? ""}${
  process.env.BASE_PATH ?? "/api/v1"
}`;

// api response delay in ms
const apiDelay = 1000;

// set up the model
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

// load demo data
instancesData.map((instance) => {
  db.bridge.create(instance);
});

export const handlers = [
  rest.get(`${apiUrl}/bridges`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(apiDelay),
      ctx.json(db.bridge.getAll())
    );
  }),

  rest.post(`${apiUrl}/bridges`, (req, res, ctx) => {
    const { name } = req.body as BridgeRequest;
    const id = uuid();
    const bridge = {
      kind: "Bridge",
      id,
      name,
      href: `/api/v1/bridges/${id}`,
      submitted_at: new Date().toISOString(),
      status: "ACCEPTED",
    };

    db.bridge.create(bridge);

    instanceStatusFlow(id);

    return res(
      ctx.status(200),
      ctx.delay(apiDelay),
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

const instanceStatusFlow = (id: string): void => {
  setTimeout(() => {
    updateInstance(id, "PROVISIONING");
  }, 8000);

  setTimeout(() => {
    updateInstance(id, "READY");
  }, 12000);

  const updateInstance = (id: string, status: string): void => {
    db.bridge.update({
      where: {
        id: {
          equals: id,
        },
      },
      data: {
        status: status,
        endpoint:
          status === "READY"
            ? `https://ob-${id}.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events`
            : "",
        published_at: status === "READY" ? new Date().toISOString() : "",
      },
    });
  };
};
