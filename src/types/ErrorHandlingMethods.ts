type ErrorHandlingMethod = {
  label: string;
  value: string;
  hasSchema: boolean;
};

export type ErrorHandlingMethods = {
  default: ErrorHandlingMethod;
  deadLetterQueue: ErrorHandlingMethod[];
};

export type EndpointParametersType = {
  endpoint: string;
};

export const ENDPOINT_TYPE = "endpoint";

export const ERROR_HANDLING_METHODS: ErrorHandlingMethods = {
  default: { label: "Ignore", value: "IGNORE", hasSchema: false },
  deadLetterQueue: [
    { label: "Webhook", value: "webhook_sink_0.1", hasSchema: true },
    { label: "Kafka topic", value: "kafka_topic_sink_0.1", hasSchema: true },
    { label: "Endpoint", value: ENDPOINT_TYPE, hasSchema: false },
  ],
};

export const getErrorHandlingMethodByType = (
  type?: string
): ErrorHandlingMethod => {
  return (
    ERROR_HANDLING_METHODS.deadLetterQueue.find(
      (method) => type === method.value
    ) ?? ERROR_HANDLING_METHODS.default
  );
};

export const isEndpointType = (type?: string): boolean => {
  return getErrorHandlingMethodByType(type).value === ENDPOINT_TYPE;
};
