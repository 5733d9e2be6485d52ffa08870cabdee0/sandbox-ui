/* tslint:disable @typescript-eslint/no-unsafe-call */

import { rest } from "msw";
import { factory, oneOf, primaryKey } from "@mswjs/data";
import {
  BridgeRequest,
  BridgeResponse,
  ManagedResourceStatus,
  ProcessorRequest,
  ProcessorResponse,
} from "@rhoas/smart-events-management-sdk";
import { v4 as uuid } from "uuid";
import { instancesData, processorData } from "./data";
import { schemaCatalogData, schemasData } from "./schemasData";
import omit from "lodash.omit";
import cloneDeep from "lodash.clonedeep";
import { cloudProvidersData, cloudRegions } from "./cloudProvidersData";
import { QueryOptions, QuerySelector } from "@mswjs/data/lib/query/queryTypes";

// api url
const apiUrl = `${process.env.BASE_URL ?? ""}${
  process.env.BASE_PATH ?? "/api/smartevents_mgmt/v2"
}`;

// api response delay in ms
export const apiDelay = 1000;
export const shortApiDelay = 200;

// set up the model
const db = factory({
  bridge: {
    id: primaryKey(String),
    name: String,
    kind: String,
    href: String,
    owner: String,
    submitted_at: String,
    published_at: String,
    modified_at: String,
    status: String,
    endpoint: String,
    cloud_provider: String,
    region: String,
  },
  processor: {
    id: primaryKey(String),
    bridge: oneOf("bridge"),
    kind: String,
    name: String,
    href: String,
    submitted_at: String,
    published_at: String,
    modified_at: String,
    status: String,
    flows: String,
  },
  cloudProvider: {
    kind: String,
    id: primaryKey(String),
    name: String,
    href: String,
    display_name: String,
    enabled: Boolean,
  },
  cloudRegion: {
    cloudProvider: oneOf("cloudProvider"),
    kind: String,
    name: primaryKey(String),
    display_name: String,
    enabled: Boolean,
  },
});

// load demo data
instancesData.map((instance, index) => {
  const bridge = db.bridge.create(instance);
  // adding processors to first bridge
  if (index === 0) {
    processorData.map((processorItem) => {
      db.processor.create({
        ...processorItem,
        bridge: bridge,
      });
    });
  }
});
cloudProvidersData.map((provider) => {
  const cloudProvider = db.cloudProvider.create(provider);
  // adding regions for each provider
  const regions = cloudRegions[provider.name];
  if (regions.length) {
    regions.map((region) => {
      db.cloudRegion.create({
        ...region,
        cloudProvider: cloudProvider,
      });
    });
  }
});

export const handlers = [
  // bridges
  // get all bridges
  rest.get(`${apiUrl}/bridges`, (req, res, ctx) => {
    const page = parseInt(req.url.searchParams.get("page") ?? "0");
    const size = parseInt(req.url.searchParams.get("size") ?? "10");
    const name = req.url.searchParams.get("name");
    const status = req.url.searchParams.getAll("status");

    const bridgeQuery = {
      where: {},
    } as QueryOptions & QuerySelector<Partial<BridgeResponse>>;

    if (bridgeQuery.where && name) {
      bridgeQuery.where.name = {
        contains: name,
        gte: name,
      };
    }

    if (bridgeQuery.where && status.length) {
      bridgeQuery.where.status = {
        in: status,
      };
    }

    const items = db.bridge
      .findMany({
        take: size,
        skip: page * size,
        orderBy: {
          submitted_at: "desc",
        },
        ...bridgeQuery,
      })
      .map((item) => prepareBridge(item as unknown as Record<string, unknown>));

    const count = db.bridge.count(bridgeQuery);

    return res(
      ctx.status(200),
      ctx.delay(apiDelay),
      ctx.json({
        kind: "BridgeList",
        items,
        page,
        size: items.length,
        total: count,
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
      return res(
        ctx.status(200),
        ctx.delay(apiDelay),
        ctx.json(prepareBridge(bridge as unknown as Record<string, unknown>))
      );
    }
    return res(
      ctx.status(404),
      ctx.delay(apiDelay),
      ctx.json({
        kind: "ErrorsResponse",
        items: [
          {
            ...error_not_found,
            reason: `Bridge with id '${
              bridgeId as string
            }' for customer 'XXXXXXXX' does not exist`,
          },
        ],
      })
    );
  }),
  // create a bridge
  rest.post(`${apiUrl}/bridges`, async (req, res, ctx) => {
    const bridgeRequest: BridgeRequest = await req.json();
    const { name, cloud_provider, region } = bridgeRequest;

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
          kind: "ErrorsResponse",
          items: [
            {
              ...error_duplicated_resource,
              reason: `Bridge with name '${name}' already exists for customer with id 'XXXXXXXX'`,
            },
          ],
        })
      );
    }

    if (name.includes("error-test")) {
      return res(
        ctx.status(500),
        ctx.delay(apiDelay),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_external_component,
              reason: `Creation was no successful probably due to external component fail'`,
            },
          ],
        })
      );
    }

    if (name.includes("quota-error")) {
      return res(
        ctx.status(402),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_quota_exceeded,
            },
          ],
        })
      );
    }

    const id = uuid();
    const bridge = {
      kind: "Bridge",
      id,
      name,
      owner: "rsanchez",
      href: `/api/smartevents_mgmt/v1/bridges/${id}`,
      submitted_at: new Date().toISOString(),
      status: "accepted",
      cloud_provider,
      region,
    };

    const newBridge = db.bridge.create(bridge);

    // make the process slower if the instance name contains "wait" and make it fail
    // if the name contains "fail"
    resourceStatusFlow(
      "bridge",
      "create",
      id,
      name.includes("wait"),
      name.includes("fail-create")
    );

    return res(ctx.status(200), ctx.delay(apiDelay), ctx.json(newBridge));
  }),
  // update a bridge
  rest.put(`${apiUrl}/bridges/:bridgeId`, async (req, res, ctx) => {
    const { bridgeId } = req.params;
    const bridgeRequest: BridgeRequest = await req.json();
    const { name } = bridgeRequest;

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
          kind: "ErrorsResponse",
          items: [
            {
              ...error_not_found,
              reason: `Bridge with id '${
                bridgeId as string
              }' for customer 'XXXXXXXX' does not exist`,
            },
          ],
        })
      );
    }

    const updatedBridge = db.bridge.update({
      where: {
        id: {
          equals: bridgeId as string,
        },
      },
      data: {
        ...bridgeRequest,
        status: "accepted",
        modified_at: new Date().toISOString(),
      },
    });

    // make the bridge slower if the resource name contains "wait" and make it fail
    // if the name contains "fail"
    resourceStatusFlow(
      "bridge",
      "create",
      bridgeId as string,
      name.includes("wait"),
      name.includes("fail-create")
    );

    return res(
      ctx.status(200),
      ctx.delay(apiDelay),
      ctx.json(
        prepareBridge(
          updatedBridge as unknown as Record<string | number | symbol, unknown>
        )
      )
    );
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

    if (existingBridge?.name == "error-test") {
      return res(
        ctx.status(500),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_external_component,
              reason: `Deletion was no successful probably due to external component fail'`,
            },
          ],
        })
      );
    }

    if (!existingBridge) {
      return res(
        ctx.status(404),
        ctx.delay(apiDelay),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_not_found,
              reason: `Bridge with id '${
                bridgeId as string
              }' for customer 'XXXXXXXX' does not exist`,
            },
          ],
        })
      );
    }

    const processorsCount = db.processor.count({
      where: {
        bridge: {
          id: {
            equals: bridgeId as string,
          },
        },
      },
    });

    if (processorsCount > 0) {
      return res(
        ctx.status(400),
        ctx.delay(apiDelay),
        ctx.json({
          kind: "ErrorsResponse",
          items: [error_bridge_not_deletable],
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

    resourceStatusFlow(
      "bridge",
      "delete",
      bridgeId as string,
      existingBridge.name.includes("wait"),
      existingBridge.name.includes("fail-delete")
    );

    return res(ctx.status(202), ctx.delay(apiDelay), ctx.json({}));
  }),

  // processors
  // get all processors of a bridge
  rest.get(`${apiUrl}/bridges/:bridgeId/processors`, (req, res, ctx) => {
    const { bridgeId } = req.params;

    const page = parseInt(req.url.searchParams.get("page") ?? "0");
    const size = parseInt(req.url.searchParams.get("size") ?? "10");
    const name = req.url.searchParams.get("name");
    const status = req.url.searchParams.getAll("status");

    const bridge = db.bridge.findFirst({
      where: {
        id: {
          equals: bridgeId as string,
        },
      },
    });

    if (!bridge) {
      return res(
        ctx.status(404),
        ctx.delay(apiDelay),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_not_found,
              reason: `Bridge with id '${
                bridgeId as string
              }' for customer 'XXXXXXXX' does not exist`,
            },
          ],
        })
      );
    }

    const query = {
      where: {
        bridge: {
          id: {
            equals: bridgeId as string,
          },
        },
      },
    } as QueryOptions & QuerySelector<Partial<ProcessorResponse>>;

    if (query.where && name) {
      query.where.name = {
        contains: name,
        gte: name,
      };
    }

    if (query.where && status.length) {
      query.where.status = {
        in: status,
      };
    }

    const count = db.processor.count(query);

    const items = db.processor
      .findMany({
        take: size,
        skip: page * size,
        orderBy: {
          submitted_at: "desc",
        },
        ...query,
      })
      .map((item) =>
        prepareProcessor(
          item as unknown as Record<string | number | symbol, unknown>
        )
      );
    return res(
      ctx.status(200),
      ctx.delay(apiDelay),
      ctx.json({
        kind: "ProcessorList",
        items,
        page,
        size: items.length,
        total: count,
      })
    );
  }),
  // get a single processor
  rest.get(
    `${apiUrl}/bridges/:bridgeId/processors/:processorId`,
    (req, res, ctx) => {
      const { bridgeId, processorId } = req.params;
      const bridge = db.bridge.findFirst({
        where: {
          id: {
            equals: bridgeId as string,
          },
        },
      });

      if (!bridge) {
        return res(
          ctx.status(404),
          ctx.delay(apiDelay),
          ctx.json({
            kind: "ErrorsResponse",
            items: [
              {
                ...error_not_found,
                reason: `Bridge with id '${
                  bridgeId as string
                }' for customer 'XXXXXXXX' does not exist`,
              },
            ],
          })
        );
      }

      const processor = db.processor.findFirst({
        where: {
          id: {
            equals: processorId as string,
          },
        },
      });

      if (processor) {
        return res(
          ctx.status(200),
          ctx.delay(apiDelay),
          ctx.json(
            prepareProcessor(
              processor as unknown as Record<string | number | symbol, unknown>
            )
          )
        );
      }
      return res(
        ctx.status(404),
        ctx.delay(apiDelay),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_not_found,
              reason: `Processor with id '${
                processorId as string
              }' for customer 'XXXXXXXX' does not exist`,
            },
          ],
        })
      );
    }
  ),
  // create a processor
  rest.post(`${apiUrl}/bridges/:bridgeId/processors`, async (req, res, ctx) => {
    const { bridgeId } = req.params;
    const processorRequest: ProcessorRequest = await req.json();
    const { name, flows } = processorRequest;

    const bridge = db.bridge.findFirst({
      where: {
        id: {
          equals: bridgeId as string,
        },
      },
    });

    if (!bridge) {
      return res(
        ctx.status(404),
        ctx.delay(apiDelay),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_not_found,
              reason: `Bridge with id '${
                bridgeId as string
              }' for customer 'XXXXXXXX' does not exist`,
            },
          ],
        })
      );
    }

    const existingProcessor = db.processor.findFirst({
      where: {
        name: {
          equals: name,
        },
        bridge: {
          id: {
            equals: bridgeId as string,
          },
        },
      },
    });

    if (existingProcessor) {
      return res(
        ctx.status(400),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_duplicated_resource,
              reason: `Processor with name '${name}' already exists for bridge with id ${
                bridgeId as string
              } for customer with id 'XXXXXXXXXX'`,
            },
          ],
        })
      );
    }

    if (name.includes("quota-error")) {
      return res(
        ctx.status(402),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_quota_exceeded,
            },
          ],
        })
      );
    }

    const id = uuid();
    const processor = {
      kind: "Processor",
      id,
      name,
      href: `/api/smartevents_mgmt/v1/bridges/${
        bridge?.id ?? ""
      }/processors/${id}`,
      submitted_at: new Date().toISOString(),
      status: "accepted",
      flows: JSON.stringify(flows),
      bridge,
    };

    const newProcessor = db.processor.create(processor);

    // make the process slower if the resource name contains "wait" and make it fail
    // if the name contains "fail"
    resourceStatusFlow(
      "processor",
      "create",
      id,
      name.includes("wait"),
      name.includes("fail-create")
    );

    return res(
      ctx.status(200),
      ctx.delay(apiDelay),
      ctx.json(
        prepareProcessor(
          newProcessor as unknown as Record<string | number | symbol, unknown>
        )
      )
    );
  }),
  // update a processor
  rest.put(
    `${apiUrl}/bridges/:bridgeId/processors/:processorId`,
    async (req, res, ctx) => {
      const { bridgeId, processorId } = req.params;
      const processorRequest: ProcessorRequest = await req.json();
      const { name, flows } = processorRequest;

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
            kind: "ErrorsResponse",
            items: [
              {
                ...error_not_found,
                reason: `Bridge with id '${
                  bridgeId as string
                }' for customer 'XXXXXXXX' does not exist`,
              },
            ],
          })
        );
      }

      const processor = db.processor.findFirst({
        where: {
          id: {
            equals: processorId as string,
          },
        },
      });

      if (!processor) {
        return res(
          ctx.status(404),
          ctx.delay(apiDelay),
          ctx.json({
            kind: "ErrorsResponse",
            items: [
              {
                ...error_not_found,
                reason: `Processor with id '${
                  processorId as string
                }' for customer 'XXXXXXXX' does not exist`,
              },
            ],
          })
        );
      }

      const existingProcessors = db.processor.findMany({
        where: {
          name: {
            equals: name,
          },
          bridge: {
            id: {
              equals: bridgeId as string,
            },
          },
        },
      });

      const processorNameCollision =
        existingProcessors.length === 1 &&
        existingProcessors[0].id !== processorId;
      if (processorNameCollision || existingProcessors.length > 1) {
        return res(
          ctx.status(400),
          ctx.json({
            kind: "ErrorsResponse",
            items: [
              {
                ...error_duplicated_resource,
                reason: `Processor with name '${name}' already exists for bridge with id ${
                  bridgeId as string
                } for customer with id 'XXXXXXXXXX'`,
              },
            ],
          })
        );
      }

      const updatedProcessor = db.processor.update({
        where: {
          id: {
            equals: processorId as string,
          },
        },
        data: {
          name,
          status: "accepted",
          modified_at: new Date().toISOString(),
          flows: JSON.stringify(flows),
        },
      });

      // make the process slower if the resource name contains "wait" and make it fail
      // if the name contains "fail"
      resourceStatusFlow(
        "processor",
        "create",
        processorId as string,
        name.includes("wait"),
        name.includes("fail-create")
      );

      return res(
        ctx.status(200),
        ctx.delay(apiDelay),
        ctx.json(
          prepareProcessor(
            updatedProcessor as unknown as Record<
              string | number | symbol,
              unknown
            >
          )
        )
      );
    }
  ),
  // delete a processor
  rest.delete(
    `${apiUrl}/bridges/:bridgeId/processors/:processorId`,
    (req, res, ctx) => {
      const { bridgeId, processorId } = req.params;

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
            kind: "ErrorsResponse",
            items: [
              {
                ...error_not_found,
                reason: `Bridge with id '${
                  bridgeId as string
                }' for customer 'XXXXXXXX' does not exist`,
              },
            ],
          })
        );
      }

      const existingProcessor = db.processor.findFirst({
        where: {
          id: {
            equals: processorId as string,
          },
          bridge: {
            id: {
              equals: bridgeId as string,
            },
          },
        },
      });

      if (!existingProcessor) {
        return res(
          ctx.status(404),
          ctx.delay(apiDelay),
          ctx.json({
            kind: "ErrorsResponse",
            items: [
              {
                ...error_not_found,
                reason: `Processor with id '${
                  bridgeId as string
                }' for customer 'XXXXXXXX' does not exist`,
              },
            ],
          })
        );
      }

      db.processor.update({
        where: {
          id: {
            equals: processorId as string,
          },
        },
        data: {
          status: "deprovision",
        },
      });

      resourceStatusFlow(
        "processor",
        "delete",
        processorId as string,
        existingProcessor.name.includes("wait"),
        existingProcessor.name.includes("fail-delete")
      );

      return res(ctx.status(202), ctx.delay(apiDelay), ctx.json({}));
    }
  ),
  // get schema catalog
  rest.get(`${apiUrl}/schemas`, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.delay(apiDelay),
      ctx.json({
        kind: "SchemaCatalog",
        items: schemaCatalogData,
      })
    );
  }),
  // get single action schema
  rest.get(`${apiUrl}/schemas/actions/:schemaId`, (req, res, ctx) => {
    const { schemaId } = req.params;

    const requestedSchema = schemasData[schemaId as string];

    if (!requestedSchema) {
      return res(
        ctx.status(404),
        ctx.delay(apiDelay),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_not_found,
              reason: `The processor json schema '${
                schemaId as string
              }' is not in the catalog.`,
            },
          ],
        })
      );
    }

    return res(ctx.status(200), ctx.delay(100), ctx.json(requestedSchema));
  }),
  // get single source schema
  rest.get(`${apiUrl}/schemas/sources/:schemaId`, (req, res, ctx) => {
    const { schemaId } = req.params;

    const requestedSchema = schemasData[schemaId as string];

    if (!requestedSchema) {
      return res(
        ctx.status(404),
        ctx.delay(apiDelay),
        ctx.json({
          kind: "ErrorsResponse",
          items: [
            {
              ...error_not_found,
              reason: `The processor json schema '${
                schemaId as string
              }' is not in the catalog.`,
            },
          ],
        })
      );
    }

    return res(ctx.status(200), ctx.delay(100), ctx.json(requestedSchema));
  }),
  rest.get(`${apiUrl}/cloud_providers`, (_req, res, ctx) => {
    const items = db.cloudProvider.getAll();

    return res(
      ctx.status(200),
      ctx.delay(shortApiDelay),
      ctx.json({
        kind: "CloudProviderList",
        items,
        page: 0,
        size: items.length,
        total: items.length,
      })
    );
  }),
  rest.get(`${apiUrl}/cloud_providers/:providerId/regions`, (req, res, ctx) => {
    const { providerId } = req.params;

    const query = {
      where: {
        cloudProvider: {
          id: {
            equals: providerId as string,
          },
        },
      },
    };

    const items = db.cloudRegion
      .findMany(query)
      .map((item) => omit(item, ["cloudProvider"]));

    return res(
      ctx.status(200),
      ctx.delay(shortApiDelay),
      ctx.json({
        kind: "CloudRegionList",
        items,
        page: 0,
        size: items.length,
        total: items.length,
      })
    );
  }),
];

/**
 * Resource status flow
 *
 * @param type Resource type: "bridge" or "processor"
 * @param mode Flow mode: "create" or "delete"
 * @param id Resource id
 * @param wait Make the creation process slower (~1,3m)
 * @param fail Make the creation process fail
 */
const resourceStatusFlow = (
  type: "processor" | "bridge",
  mode: "create" | "delete",
  id: string,
  wait: boolean,
  fail: boolean
): void => {
  const waitTime = wait ? 30000 : 9000;

  const updateProcessor = (id: string, status: string): void => {
    db.processor.update({
      where: {
        id: {
          equals: id,
        },
      },
      data: {
        status() {
          return status;
        },
        published_at(published_at) {
          return status === "ready" ? new Date().toISOString() : published_at;
        },
      },
    });
  };

  const updateBridge = (id: string, status: string): void => {
    db.bridge.update({
      where: {
        id: {
          equals: id,
        },
      },
      data: {
        status() {
          return status;
        },
        endpoint(endpoint) {
          return status === "ready"
            ? `https://ob-${id}.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events`
            : endpoint;
        },
        published_at(published_at) {
          return status === "ready" ? new Date().toISOString() : published_at;
        },
      },
    });
  };

  const deleteBridge = (id: string): void => {
    db.bridge.delete({
      where: {
        id: {
          equals: id,
        },
      },
    });
  };

  const deleteProcessor = (id: string): void => {
    db.processor.delete({
      where: {
        id: {
          equals: id,
        },
      },
    });
  };

  const updateResource = type === "processor" ? updateProcessor : updateBridge;

  const creationStatusSteps = [
    ManagedResourceStatus.Preparing,
    ManagedResourceStatus.Provisioning,
    ManagedResourceStatus.Ready,
  ];

  const deletionStatusSteps = [
    ManagedResourceStatus.Deleting,
    ManagedResourceStatus.Deleted,
  ];

  const steps = mode === "create" ? creationStatusSteps : deletionStatusSteps;
  let currentStep = 0;

  const timer = setInterval(() => {
    if (currentStep < steps.length) {
      if (fail) {
        // if the process was set to fail, update status accordingly and clear setInterval
        updateResource(id, ManagedResourceStatus.Failed);
        clearInterval(timer);
      } else {
        updateResource(id, steps[currentStep]);
      }
      if (currentStep === steps.length - 1) {
        // this is the last step. if needed, delete resources after 3 seconds
        if (mode === "delete" && !fail) {
          setTimeout(() => {
            if (type === "processor") {
              deleteProcessor(id);
            } else {
              deleteBridge(id);
            }
          }, 3000);
        }
        // finally clear the setInterval
        clearInterval(timer);
      }
    }
    currentStep++;
  }, waitTime);
};

/**
 * Prepare bridge data to be returned by APIs
 *
 * @param data Bridge data to be processed
 * */
const prepareBridge = (data: Record<string, unknown>): BridgeResponse => {
  let bridge = cloneDeep(data);

  if (bridge.modified_at === "") {
    bridge = omit(bridge, "modified_at");
  }

  return bridge as unknown as BridgeResponse;
};

/**
 * Prepare processor data to be returned by APIs
 *
 * @param data Processor to clean from unwanted properties before response
 */
const prepareProcessor = (data: Record<string, unknown>): ProcessorResponse => {
  // removing properties not needed for the response
  const omitProperties = ["bridge"];
  const processor = cloneDeep(data);

  processor.flows = JSON.parse(processor.flows as string);

  if (processor.modified_at === "") {
    omitProperties.push("modified_at");
  }

  return omit(processor, omitProperties) as ProcessorResponse;
};

const error_not_found = {
  kind: "Error",
  id: "5",
  href: "/api/smartevents_mgmt/v2/errors/5",
  code: "OPENBRIDGE-5",
};

const error_duplicated_resource = {
  kind: "Error",
  id: "3",
  href: "/api/smartevents_mgmt/v2/errors/3",
  code: "OPENBRIDGE-3",
};

const error_external_component = {
  kind: "Error",
  id: "1",
  href: "/api/smartevents_mgmt/v2/errors/1",
  code: "OPENBRIDGE-1",
};

const error_bridge_not_deletable = {
  kind: "Error",
  id: "4",
  href: "/api/smartevents_mgmt/v2/errors/4",
  code: "OPENBRIDGE-4",
  reason:
    "It is not possible to delete a Bridge instance with active Processors.",
};

const error_quota_exceeded = {
  kind: "Error",
  id: "16",
  href: "/api/smartevents_mgmt/v2/errors/16",
  code: "OPENBRIDGE-16",
  reason:
    "The requested resource could not be deployed because you are out of available quota.",
};
