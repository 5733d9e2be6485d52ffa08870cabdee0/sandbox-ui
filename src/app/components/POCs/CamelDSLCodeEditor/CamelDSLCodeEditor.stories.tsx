import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CamelDSLCodeEditor from "@app/components/POCs/CamelDSLCodeEditor/CamelDSLCodeEditor";

export default {
  title: "PoCs/Camel DSL Code Editor",
  component: CamelDSLCodeEditor,
  args: {
    onChange: (): void => {},
  },
  width: "100%",
  height: 500,
} as ComponentMeta<typeof CamelDSLCodeEditor>;

const Template: ComponentStory<typeof CamelDSLCodeEditor> = (args) => (
  <CamelDSLCodeEditor {...args} />
);

export const SampleProcessor = Template.bind({});
SampleProcessor.args = {
  code: `- from:
    uri: "rhose:bridge"
    steps:
      - set-body:
          constant: "Hello Camel K from yaml"
      - to: "log:info"`,
};
