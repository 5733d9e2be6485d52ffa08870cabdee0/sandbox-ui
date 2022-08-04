/* tslint:disable @typescript-eslint/no-unsafe-call */

import { rest } from "msw";
import { factory, oneOf, primaryKey } from "@mswjs/data";
import {
  BridgeRequest,
  ProcessorRequest,
  ProcessorResponse,
  ProcessorType,
} from "@rhoas/smart-events-management-sdk";
import { v4 as uuid } from "uuid";
import { instancesData, processorData } from "./data";
import { schemaCatalogData, schemasData } from "./schemasData";
import omit from "lodash.omit";
import cloneDeep from "lodash.clonedeep";
import { EventFilter, ProcessorSchemaType } from "../src/types/Processor";
import { cloudProvidersData, cloudRegions } from "./cloudProvidersData";

// api url
const apiUrl = `${process.env.BASE_URL ?? ""}${
  process.env.BASE_PATH ?? "/api/smartevents_mgmt/v1"
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
    status: String,
    endpoint: String,
  },
  processor: {
    id: primaryKey(String),
    bridge: oneOf("bridge"),
    type: String,
    kind: String,
    name: String,
    href: String,
    submitted_at: String,
    published_at: String,
    status: String,
    filters: Array,
    transformationTemplate: String,
    action: {
      type: String,
      parameters: String,
    },
    source: {
      type: String,
      parameters: String,
    },
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

    const items = db.bridge.findMany({
      take: size,
      skip: page * size,
      orderBy: {
        submitted_at: "desc",
      },
    });

    return res(
      ctx.status(200),
      ctx.delay(apiDelay),
      ctx.json({
        kind: "BridgeList",
        items,
        page,
        size: items.length,
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

    if (name == "error-test") {
      return res(
        ctx.status(500),
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

    const id = uuid();
    const bridge = {
      kind: "Bridge",
      id,
      name,
      href: `/api/smartevents_mgmt/v1/bridges/${id}`,
      submitted_at: new Date().toISOString(),
      status: "accepted",
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
    };

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
              processor as unknown as Record<string | number | symbol, unknown>,
              true
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
  rest.post(`${apiUrl}/bridges/:bridgeId/processors`, (req, res, ctx) => {
    const { bridgeId } = req.params;
    const { name, transformationTemplate, filters, action, source } =
      req.body as MockProcessorRequest;

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

    const id = uuid();
    const processor = {
      kind: "Processor",
      id,
      type: action ? "sink" : "source",
      name,
      href: `/api/smartevents_mgmt/v1/bridges/${
        bridge?.id ?? ""
      }/processors/${id}`,
      submitted_at: new Date().toISOString(),
      status: "accepted",
      filters: filters,
      transformationTemplate,
      ...(action
        ? {
            action: convertParametersToString(action),
          }
        : {}),
      ...(source
        ? {
            source: convertParametersToString(source),
          }
        : {}),
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
          newProcessor as unknown as Record<string | number | symbol, unknown>,
          true
        )
      )
    );
  }),
  // update a processor
  rest.put(
    `${apiUrl}/bridges/:bridgeId/processors/:processorId`,
    (req, res, ctx) => {
      const { bridgeId, processorId } = req.params;
      const { name, filters, transformationTemplate, source, action } =
        req.body as ProcessorRequest;

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
          filters: filters as unknown as EventFilter[],
          transformationTemplate,
          ...(action ? { action: convertParametersToString(action) } : {}),
          ...(source ? { source: convertParametersToString(source) } : {}),
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
            >,
            true
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
  const waitTime = wait ? 45000 : 8000;

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

  const stepOne = mode === "create" ? "provisioning" : "deleting";
  const stepTwo = mode === "create" ? "ready" : "deleted";

  setTimeout(() => {
    updateResource(id, stepOne);
  }, waitTime);

  setTimeout(() => {
    updateResource(id, fail ? "failed" : stepTwo);
  }, waitTime * 2);

  if (mode === "delete" && !fail) {
    setTimeout(() => {
      if (type === "processor") {
        deleteProcessor(id);
      } else {
        deleteBridge(id);
      }
    }, waitTime * 2.2);
  }
};

/**
 * Prepare processor data to be returned by APIs
 *
 * @param data Processor to clean from unwanted properties before response
 * @param parseConfigParameters Flag indicating if action/source parameters should be parsed
 */
const prepareProcessor = (
  data: Record<string, unknown>,
  parseConfigParameters = false
): ProcessorResponse => {
  // removing properties not needed for the response
  const omitProperties = ["bridge"];
  const processor = cloneDeep(data);

  if (!(processor.filters as Array<Record<string, unknown>>)?.length) {
    omitProperties.push("filters");
  }
  if (processor.transformationTemplate === "") {
    omitProperties.push("transformationTemplate");
  }

  if (processor.type === "source") {
    omitProperties.push("action");
  } else {
    omitProperties.push("source");
  }

  if (parseConfigParameters) {
    const configSection =
      processor.type === ProcessorType.Source
        ? ProcessorSchemaType.SOURCE
        : ProcessorSchemaType.ACTION;
    const parsedParameters = JSON.parse(
      (
        processor[configSection] as {
          type: string;
          parameters: string;
        }
      ).parameters
    ) as { [key: string]: unknown };
    if (processor.type === ProcessorType.Source) {
      (processor.source as typeof parsedParameters).parameters =
        parsedParameters;
    } else {
      (processor.action as typeof parsedParameters).parameters =
        parsedParameters;
    }
  }

  return omit(processor, omitProperties) as ProcessorResponse;
};

/**
 * Convert actions/sources parameters to string because that's how they are stored
 * in our fake db
 *
 * @param data Processor action or source to convert
 * @returns Processor action or source with parameters property containing stringified parameters.
 */
const convertParametersToString = (
  data: MockProcessorRequest["action"] | MockProcessorRequest["source"]
): { type: string; parameters: string } => {
  return {
    type: data?.type ?? "",
    parameters: JSON.stringify(data?.parameters),
  };
};

const error_not_found = {
  kind: "Error",
  id: "4",
  href: "/api/smartevents_mgmt/v1/errors/4",
  code: "OPENBRIDGE-4",
};

const error_duplicated_resource = {
  kind: "Error",
  id: "1",
  href: "/api/smartevents_mgmt/v1/errors/1",
  code: "OPENBRIDGE-1",
};

const error_external_component = {
  kind: "Error",
  id: "1",
  href: "/api/smartevents_mgmt/v1/errors/5",
  code: "OPENBRIDGE-5",
};

const error_bridge_not_deletable = {
  kind: "Error",
  id: "2",
  href: "/api/smartevents_mgmt/v1/errors/2",
  code: "OPENBRIDGE-2",
  reason:
    "It is not possible to delete a Bridge instance with active Processors.",
};

interface MockProcessorRequest extends Omit<ProcessorRequest, "filters"> {
  filters: unknown[];
}
