/* tslint:disable @typescript-eslint/no-unsafe-call */

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
  // get all bridges
  rest.get(`${apiUrl}/bridges`, (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get("page") ?? "0");
    const size = parseInt(req.url.searchParams.get("size") ?? "10");

    return res(
      ctx.status(200),
      ctx.delay(apiDelay),
      ctx.json({
        kind: "BridgeList",
        items: db.bridge.findMany({
          take: size,
          skip: page * size,
          orderBy: {
            submitted_at: "desc",
          },
        }),
        page: page,
        size: size,
        total: db.bridge.count(),
      })
    );
  }),
  // get a single bridge
  rest.get(`${apiUrl}/bridges/:bridgeId`, (req, res, ctx) => {
    const { bridgeId } = req.params;

    const bridge = db.bridge.findFirst({
      where: {
        id: {
          equals: bridgeId as string,
        },
      },
    });

    if (bridge) {
      return res(ctx.status(200), ctx.delay(apiDelay), ctx.json(bridge));
    }
    return res(
      ctx.status(404),
      ctx.delay(apiDelay),
      ctx.json({
        kind: "Error",
        id: "4",
        href: "/api/v1/errors/4",
        code: "OPENBRIDGE-4",
        reason: `Bridge with id '${
          bridgeId as string
        }' for customer 'XXXXXXXX' does not exist`,
      })
    );
  }),
  // create a bridge
  rest.post(`${apiUrl}/bridges`, (req, res, ctx) => {
    const { name } = req.body as BridgeRequest;

    const existingBridge = db.bridge.findFirst({
      where: {
        name: {
          equals: name,
        },
      },
    });

    if (existingBridge) {
      return res(
        ctx.status(400),
        ctx.json({
          kind: "Error",
          id: "1",
          href: "/api/v1/errors/1",
          code: "OPENBRIDGE-1",
          reason: `Bridge with name '${name}' already exists for customer with id '${existingBridge.id}'`,
        })
      );
    }

    const id = uuid();
    const bridge = {
      kind: "Bridge",
      id,
      name,
      href: `/api/v1/bridges/${id}`,
      submitted_at: new Date().toISOString(),
      status: "accepted",
    };

    const newBridge = db.bridge.create(bridge);

    // make the process slower if the instance name contains "wait" and make it fail
    // if the name contains "fail"
    instanceStatusFlow(id, name.includes("wait"), name.includes("fail"));

    return res(ctx.status(200), ctx.delay(apiDelay), ctx.json(newBridge));
  }),
  // delete a bridge
  rest.delete(`${apiUrl}/bridges/:bridgeId`, (req, res, ctx) => {
    const { bridgeId } = req.params;

    const existingBridge = db.bridge.findFirst({
      where: {
        id: {
          equals: bridgeId as string,
        },
      },
    });

    if (!existingBridge) {
      return res(
        ctx.status(404),
        ctx.delay(apiDelay),
        ctx.json({
          kind: "Error",
          id: "4",
          href: "/api/v1/errors/4",
          code: "OPENBRIDGE-4",
          reason: `Bridge with id '${
            bridgeId as string
          }' for customer 'XXXXXXXX' does not exist`,
        })
      );
    }

    db.bridge.update({
      where: {
        id: {
          equals: bridgeId as string,
        },
      },
      data: {
        status: "deprovision",
      },
    });

    setTimeout(() => {
      db.bridge.delete({
        where: {
          id: {
            equals: bridgeId as string,
          },
        },
      });
    }, 20000);

    return res(ctx.status(202), ctx.delay(apiDelay), ctx.json({}));
  }),
];

/**
 * Instance status flow
 *
 * @param id Bridge id
 * @param wait Make the creation process slower (~1,3m)
 * @param fail Make the creation process fail
 */
const instanceStatusFlow = (id: string, wait: boolean, fail: boolean): void => {
  const waitTime = wait ? 45000 : 8000;

  if (fail) {
    setTimeout(() => {
      updateInstance(id, "provisioning");
    }, waitTime);
    setTimeout(() => {
      updateInstance(id, "failed");
    }, waitTime * 2);
  } else {
    setTimeout(() => {
      updateInstance(id, "provisioning");
    }, waitTime);

    setTimeout(() => {
      updateInstance(id, "ready");
    }, waitTime * 2);
  }

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
          status === "ready"
            ? `https://ob-${id}.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events`
            : "",
        published_at: status === "ready" ? new Date().toISOString() : "",
      },
    });
  };
};
