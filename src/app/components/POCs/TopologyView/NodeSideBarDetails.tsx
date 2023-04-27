/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";
import React from "react";
import { NodeModel } from "@patternfly/react-topology";

interface NodeInformationProps {
  node: NodeModel | undefined;
}

const NodeInformation = (props: NodeInformationProps): JSX.Element => {
  const { node } = props;

  return (
    <DescriptionList
      isHorizontal
      isCompact
      style={{ marginLeft: "2rem", marginTop: "2rem" }}
    >
      <DescriptionListGroup>
        <DescriptionListTerm>{"Name"}</DescriptionListTerm>
        <DescriptionListDescription>{node?.label}</DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{"Type"}</DescriptionListTerm>
        <DescriptionListDescription>
          {node?.data.type}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{"Owner"}</DescriptionListTerm>
        <DescriptionListDescription>
          {node?.data.owner}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{"Time created"}</DescriptionListTerm>
        <DescriptionListDescription>
          {node?.data.timeCreated}
        </DescriptionListDescription>
      </DescriptionListGroup>{" "}
      <DescriptionListGroup>
        <DescriptionListTerm>{"Time Updated"}</DescriptionListTerm>
        <DescriptionListDescription>
          {node?.data.timeUpdated}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};

export default NodeInformation;
