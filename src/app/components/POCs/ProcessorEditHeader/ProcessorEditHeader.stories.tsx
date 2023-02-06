import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ProcessorEditHeader from "@app/components/POCs/ProcessorEditHeader/ProcessorEditHeader";

export default {
  title: "PoCs/Create Processor/Components/Processor Header",
  component: ProcessorEditHeader,
  args: {
    name: "Processor name",
    onCreate: () => {},
    showCreateAction: true,
  },
} as ComponentMeta<typeof ProcessorEditHeader>;

const Template: ComponentStory<typeof ProcessorEditHeader> = (args) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onNameChange, name, ...rest } = args;
  const [value, setValue] = useState(args.name);

  return (
    <div style={{ padding: "3em 0" }}>
      <ProcessorEditHeader
        onNameChange={(newValue): void => setValue(newValue)}
        name={value}
        {...rest}
      />
    </div>
  );
};

export const ActionVisible = Template.bind({});
ActionVisible.args = {};

export const ActionHidden = Template.bind({});
ActionHidden.args = {
  showCreateAction: false,
};

export const ProvidedProcessorName = Template.bind({});
ProvidedProcessorName.args = {
  name: "My Slack Processor",
};
