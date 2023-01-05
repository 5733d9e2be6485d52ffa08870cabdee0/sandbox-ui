import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { BOGettingStarted } from "../Components/BOGettingStarted";

export default {
  title: "Bridge/Bridge overview/Bridge overview getting started",
  component: BOGettingStarted,
} as ComponentMeta<typeof BOGettingStarted>;

export const GettingStarted: ComponentStory<typeof BOGettingStarted> = () => (
  <BOGettingStarted />
);
