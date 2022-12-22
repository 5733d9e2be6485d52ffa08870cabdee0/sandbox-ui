import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ProcessorCodeEditor from "@app/components/POCs/ProcessorCodeEditor/ProcessorCodeEditor";

export default {
  title: "PoCs/Processor Code Editor",
  component: ProcessorCodeEditor,
} as ComponentMeta<typeof ProcessorCodeEditor>;

const Template: ComponentStory<typeof ProcessorCodeEditor> = (args) => (
  <div style={{ height: "100%" }}>
    <ProcessorCodeEditor {...args} />
  </div>
);

export const CodeEditor = Template.bind({});
CodeEditor.args = {
  code: `- from:
    uri: "rhose:bridge"
    steps:
      - set-body:
          constant: "Hello there"
      - to: "log:info"`,
};
