import React from "react";
import { Grid, GridItem, PageSection } from "@patternfly/react-core";
import { BOGettingStarted } from "./Components/BOGettingStarted";
import { BOProcessorList } from "./Components/BOProcessorList";
import { BOSinkList } from "./Components/BOSinkList";
import { BOSourceList } from "./Components/BOSourceList";
import { ProcessorResponse } from "@rhoas/smart-events-management-sdk";

export interface BridgeOverviewProps {
  instanceId: string;
  onCreateProcessor: () => void;
  deleteProcessor: (processorId: string, processorName: string) => void;
  onEditProcessor: (processorId: string) => void;
  processorList: ProcessorResponse[] | undefined;
  processorsError: unknown;
  bridgeStatus: string | undefined;
  bridgeIngressEndpoint: string | undefined;
}

export const BridgeOverview = (props: BridgeOverviewProps): JSX.Element => {
  const {
    processorList,
    processorsError,
    bridgeStatus,
    instanceId,
    bridgeIngressEndpoint,
    onCreateProcessor,
    onEditProcessor,
    deleteProcessor,
  } = props;

  return (
    <>
      <PageSection isFilled>
        <Grid hasGutter={true} sm={12}>
          <BOGettingStarted />
          <GridItem lg={4} md={6}>
            <BOSourceList
              sourceList={[]}
              bridgeIngressEndpoint={bridgeIngressEndpoint}
            />
          </GridItem>
          <GridItem lg={4} md={6}>
            <BOProcessorList
              instanceId={instanceId}
              processorList={processorList}
              bridgeStatus={bridgeStatus}
              processorsError={processorsError}
              onCreateProcessor={onCreateProcessor}
              deleteProcessor={deleteProcessor}
              onEditProcessor={onEditProcessor}
            />
          </GridItem>
          <GridItem lg={4} md={12}>
            <BOSinkList sinkList={[]} />
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};
