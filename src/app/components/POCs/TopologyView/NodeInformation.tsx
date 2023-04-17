/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import React from "react";
import { NODES_12 } from "./Topology";

interface NodeInformationProps {
  nodeId: string;
}
const NodeInformation = (props: NodeInformationProps): JSX.Element => {
  const { nodeId } = props;
  const nodeInfo = NODES_12.find((node) => node.id === nodeId);

  return (
    <DescriptionList
      isHorizontal
      isCompact
      style={{ marginLeft: "2rem", marginTop: "2rem" }}
    >
      <DescriptionListGroup>
        <DescriptionListTerm>{"Name"}</DescriptionListTerm>
        <DescriptionListDescription>
          {nodeInfo?.label}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{"Type"}</DescriptionListTerm>
        <DescriptionListDescription>
          {nodeInfo?.data.type}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{"Owner"}</DescriptionListTerm>
        <DescriptionListDescription>
          {nodeInfo?.data.owner}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{"Time created"}</DescriptionListTerm>
        <DescriptionListDescription>
          {nodeInfo?.data.timeCreated}
        </DescriptionListDescription>
      </DescriptionListGroup>{" "}
      <DescriptionListGroup>
        <DescriptionListTerm>{"Time Updated"}</DescriptionListTerm>
        <DescriptionListDescription>
          {nodeInfo?.data.timeUpdated}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};

export default NodeInformation;
