import {
  Action,
  ProcessorType,
  Source,
} from "@rhoas/smart-events-management-sdk";

export type Processor = SinkProcessor | SourceProcessor;

export interface SinkProcessor extends BaseProcessor {
  type: "sink";
  action: Action;
}

export interface SourceProcessor extends BaseProcessor {
  type: "source";
  source: Source;
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
  values?: (string | number)[];
}

export interface ProcessorFormData {
  name: string;
  type?: ProcessorType;
  action?: Action;
  transformationTemplate?: string;
  filters?: EventFilter[];
  source?: Source;
}

export interface ProcessorValidation {
  isValid: boolean | undefined;
  errors: {
    [key: string]: string;
  };
}

export interface ConfigType {
  name: string;
  label: string;
  isPlaceholder: boolean;
  fields: ConfigField[];
}

interface ConfigField {
  name: string;
  label: string;
  validate: FieldValidateFunction;
}

interface FieldValidateFunction {
  (value: string): FieldValidation;
}

export interface FieldValidation {
  isValid: boolean;
  errorMessage: string;
}

export enum FilterType {
  STRING_EQUALS = "StringEquals",
  STRING_CONTAINS = "StringContains",
  STRING_BEGINS = "StringBeginsWith",
  STRING_IN = "StringIn",
  NUMBER_IN = "NumberIn",
}

export enum ProcessorSchemaType {
  ACTION = "action",
  SOURCE = "source",
}

export interface DataShapeValue {
  [key: string]: {
    format: string;
  };
}
