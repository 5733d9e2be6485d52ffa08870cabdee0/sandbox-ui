import React from "react";

import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ProcessorTemplateSelector } from "@app/components/POCs/ProcessorTemplateSelector/ProcessorTemplateSelector";
import { PlusCircleIcon } from "@patternfly/react-icons";

export default {
  title: "PoCs/Processor Template Selector",
  component: ProcessorTemplateSelector,
} as ComponentMeta<typeof ProcessorTemplateSelector>;

const Template: ComponentStory<typeof ProcessorTemplateSelector> = (args) => (
  <ProcessorTemplateSelector {...args} />
);

export const TemplateSelection = Template.bind({});

TemplateSelection.args = {
  templates: [
    {
      icon: PlusCircleIcon,
      title: "Basic Processor",
      description:
        "This basic processor template has a filter and a transformation template.",
      code: `- from:
    uri: "rhose:bridge"
    steps:
    - filter:
        simple: '\${header.type} == "StorageService"'
        steps:
        - kamelet:
            name: template
            parameters:
              template: '{"text": "hello {body.name}"}'
        - to:
            uri: "sink-name"`,
    },
    {
      icon: PlusCircleIcon,
      title: "Routing Processor",
      description:
        "This routing processor template has context based routing. It will send events to different sinks based on some conditions.",
      code: `- from:
    uri: rhose:bridge
    steps:
    - choice:
        when:
          - simple: "\${body.nutritions.sugar} <= 5"
            to:
              uri: "SlackAction1"
          - simple: "\${body.nutritions.sugar} > 5 && \${body.nutritions.sugar} <= 10"
            to:
              uri: "HttpAction1"`,
    },
  ],
};
