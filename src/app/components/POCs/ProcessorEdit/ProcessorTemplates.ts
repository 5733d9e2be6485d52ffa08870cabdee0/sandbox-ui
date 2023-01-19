import React from "react";
import { CodeIcon, DataSinkIcon } from "@patternfly/react-icons";

export interface ProcessorTemplate {
  id: string;
  icon?: React.ComponentType;
  title: string;
  code: string;
  description: string;
}

export const PROCESSOR_TEMPLATES: ProcessorTemplate[] = [
  {
    id: "basic",
    title: "Basic Processor",
    description:
      "This basic transformation template has a filter and a transformation template.",
    icon: CodeIcon,
    code: `- from:
    uri: "rhose:bridge"
    steps:
    - filter:
        simple: '\${header.type} == "StorageService"'
        steps:
        - kamelet:
            name: template
            parameters:
              template: '{"text": "hello \${body.name}"}'
        - to:
            uri: "SomeAction"`,
  },
  {
    id: "routing",
    title: "Routing processor",
    description:
      "This routing processor template has a content based routing. It will send events to different sinks based on some conditions.",
    icon: DataSinkIcon,
    code: `- from:
    uri: "rhose:bridge"
    steps:
    - choice:
        when:
          - simple: "\${body.propertyName} <= 5"
            steps:
            - kamelet:
                name: template
                parameters:
                  template: '{"text": "Value is low: \${body.propertyName}"}'
            - to:
                uri: "SlackAction1"
          - simple: "\${body.propertyName} > 5 && \${body.propertyName} <= 10"
            steps:
            - kamelet:
                name: template
                parameters:
                  template: '{"text": "Value is within range: \${body.propertyName}"}'
            - to:
                uri: "HttpAction1"
        otherwise:
          to:
            uri: "ErrorAction1"`,
  },
];
