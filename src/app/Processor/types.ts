import { BaseAction } from "../../../openapi/generated";

export type Processor = SinkProcessor | SourceProcessor;

export interface SinkProcessor extends BaseProcessor {
  type: "sink";
  action: BaseAction;
}

export interface SourceProcessor extends BaseProcessor {
  type: "source";
  source: BaseSource;
}

interface BaseProcessor {
  name: string;
  status: string;
  transformationTemplate?: string;
  filters?: EventFilter[];
}

export interface EventFilter {
  key: string;
  type: string;
  value: string;
}

export interface BaseSource {
  type: string;
  parameters: {
    [key: string]: string;
  };
}
