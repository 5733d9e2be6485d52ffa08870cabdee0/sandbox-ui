import React, { useCallback, useState } from "react";
import { Grid, GridItem, PageSection } from "@patternfly/react-core";
import { BOGettingStarted } from "./Components/BOGettingStarted";
import { BOProcessorList } from "./Components/BOProcessorList";
import { BOSinkList } from "./Components/BOSinkList";
import { BOSourceList } from "./Components/BOSourceList";
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
          <BOGettingStarted />
          <GridItem lg={4} md={6}>
            <BOSourceList
              sourceList={sourceList}
              onAddingSourceConnector={handleSourceList}
            />
          </GridItem>
          <GridItem lg={4} md={6}>
            <BOProcessorList
              processorList={processorList}
              onAddingProcessor={handleProcessorList}
            />
          </GridItem>
          <GridItem lg={4} md={12}>
            <BOSinkList
              sinkList={sinkList}
              onAddingSinkConnector={handleSinkList}
            />
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};
