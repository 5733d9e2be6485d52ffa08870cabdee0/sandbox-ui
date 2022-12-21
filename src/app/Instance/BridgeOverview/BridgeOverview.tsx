import { Grid, PageSection } from "@patternfly/react-core";
import React, { useCallback, useState } from "react";
import { GettingStarted } from "./Components/GettingStarted";
import { EventProcessor } from "./Components/EventProcessor";
import { EventSink } from "./Components/EventSink";
import { EventSource } from "./Components/EventSource";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";

export interface DemoData {
  name: string;
  connectors: string[];
  status: ManagedResourceStatus;
}

export const BridgeOverview = (): JSX.Element => {
  const [sourceList, setSourceList] = useState<DemoData[]>([]);
  const [processorList, setProcessorList] = useState<DemoData[]>([]);
  const [sinkList, setSinkList] = useState<DemoData[]>([]);

  const handleSourceList = useCallback((): void => {
    setSourceList([
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
    ]);
  }, []);

  const handleProcessorList = useCallback((): void => {
    setProcessorList([
      {
        name: "disk space cleanup",
        connectors: ["Ansible playbook", "AI/ML learning Azure Database"],
        status: ManagedResourceStatus.Ready,
      },
      {
        name: "confirmed order analysis",
        connectors: ["AI/ML learning Azure Database"],
        status: ManagedResourceStatus.Failed,
      },
      {
        name: "invoices generation and fulfillment notification",
        connectors: ["Azure Bigdata serverless Sink"],
        status: ManagedResourceStatus.Failed,
      },
    ]);
  }, []);

  const handleSinkList = useCallback((): void => {
    setSinkList([
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
        status: ManagedResourceStatus.Ready,
      },
    ]);
  }, []);

  return (
    <>
      <PageSection isFilled>
        <Grid hasGutter={true} sm={12}>
          {/* Getting started */}
          <GettingStarted />
          {/* Event Source */}
          <EventSource
            eventSourceList={sourceList}
            onAddingSourceConnector={handleSourceList}
          />
          {/* Event Processor */}
          <EventProcessor
            eventProcessorList={processorList}
            onAddingProcessor={handleProcessorList}
          />
          {/* Event Sinks */}
          <EventSink
            eventSinkList={sinkList}
            onAddingSinkConnector={handleSinkList}
          />
        </Grid>
      </PageSection>
    </>
  );
};
