import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import CamelDSLCodeEditor from "@app/components/POCs/CamelDSLCodeEditor/CamelDSLCodeEditor";

export default {
  title: "PoCs/Camel DSL Code Editor",
  component: CamelDSLCodeEditor,
  args: {
    onChange: (): void => {},
    onValidate: (): void => {},
    width: "100%",
    height: 500,
    sinkConnectorsNames: [],
  },
} as ComponentMeta<typeof CamelDSLCodeEditor>;

const Template: ComponentStory<typeof CamelDSLCodeEditor> = (args) => (
  <CamelDSLCodeEditor {...args} />
);

export const SampleProcessor = Template.bind({});
SampleProcessor.args = {
  code: `- from:
    uri: "rhose:bridge"
    steps:
      - filter:
          simple: '\${header.type} == "StorageService"'
          steps:
          - kamelet:
              name: template
              parameters:
                template: 'hello \${body.name}'
          - to:
              uri: "SomeAction"`,
};

export const InvalidSource = Template.bind({});
InvalidSource.args = {
  code: `- from:
    uri: "some:source"
    steps:
      - filter:
          simple: '\${header.type} == "StorageService"'
          steps:
          - kamelet:
              name: template
              parameters:
                template: 'hello \${body.name}'
          - to:
              uri: "SomeAction"`,
};

export const ToSinkNamesSuggestions = Template.bind({});
ToSinkNamesSuggestions.args = {
  code: `- from:
    uri: "rhose:bridge"
    steps:
      - filter:
          simple: '\${header.type} == "StorageService"'
          steps:
          - kamelet:
              name: template
              parameters:
                template: 'hello \${body.name}'
          - to:
              uri: `,
  sinkConnectorsNames: ["myFirstSinkName", "mySecondSinkName"],
};
