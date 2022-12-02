import React from "react";

import { ComponentStory, ComponentMeta } from "@storybook/react";
import { InstanceDetails } from "@app/Instance/InstanceDetails/InstanceDetails";
import {
  Drawer,
  DrawerColorVariant,
  DrawerContent,
} from "@patternfly/react-core";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";

export default {
  title: "Bridge/Details Panel",
  component: InstanceDetails,
  args: {
    onClosingDetails: (): void => {},
  },
} as ComponentMeta<typeof InstanceDetails>;

const bridgeResponse = {
  kind: "Bridge",
  id: "04f131c3-b34c-4ee2-b153-fbff0bb91ece",
  name: "Instance one",
  owner: "bebianco",
  href: "/api/smartevents_mgmt/v2/bridges/04f131c3-b34c-4ee2-b153-fbff0bb91ece",

  submitted_at: "2021-12-15T16:09:00Z",
  published_at: "2021-12-15T16:10:00Z",
  cloud_provider: "aws",
  region: "us-east-1",
};

const Template: ComponentStory<typeof InstanceDetails> = (args) => {
  return (
    <Drawer isExpanded={true}>
      <DrawerContent
        colorVariant={DrawerColorVariant.light200}
        panelContent={<InstanceDetails {...args} />}
      >
        <>drawer content</>
      </DrawerContent>
    </Drawer>
  );
};

export const IngressNotReady = Template.bind({});
IngressNotReady.args = {
  instance: { ...bridgeResponse, status: ManagedResourceStatus.Provisioning },
};

export const IngressReady = Template.bind({});
IngressReady.args = {
  instance: {
    ...bridgeResponse,
    status: ManagedResourceStatus.Ready,
    endpoint:
      "https://04f131c3-b34c-4ee2-b153-fbff0bb91ece.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events",
  },
};
