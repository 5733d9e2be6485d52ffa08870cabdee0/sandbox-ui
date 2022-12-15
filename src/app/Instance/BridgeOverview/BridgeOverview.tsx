import { Grid, PageSection } from "@patternfly/react-core";
import React from "react";
import { GettingStarted } from "./Components/GettingStarted";
import { EventProcessor } from "./Components/EventProcessor";
import { EventSink } from "./Components/EventSink";
import { EventSource } from "./Components/EventSource";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";

export type ButtonProps = {
  changeState?: () => void | undefined;
};

export interface ProcessorList {
  name: string;
  connectors: string[];
  status: ManagedResourceStatus;
}
[];

export const BridgeOverview = (): JSX.Element => {
  const data: ProcessorList[] = [
    {
      name: " disk-space-cleanup",
      connectors: ["Ansible playbook", "AI/ML learning Azure Database"],
      status: ManagedResourceStatus.Ready,
    },
    {
      name: " 870-du29c-9nc-w-1ik",
      connectors: ["AI/ML learning Azure Database"],
      status: ManagedResourceStatus.Failed,
    },
    {
      name: " wi-9nc-w-1ik-ygsds",
      connectors: ["Azure Bigdata serverless Sink"],
      status: ManagedResourceStatus.Failed,
    },
  ];

  return (
    <>
      <PageSection isFilled>
        <Grid hasGutter={true}>
          {/* Getting started */}
          <GettingStarted />
          {/* Event Source */}
          <EventSource EventSourceList={data} />
          {/* Event Processor */}
          <EventProcessor EventProcessorList={data} />
          {/* Event Sinks */}
          <EventSink EventSinkList={data} />
        </Grid>
      </PageSection>
    </>
  );
};
