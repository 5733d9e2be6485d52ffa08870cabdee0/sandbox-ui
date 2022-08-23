type ErrorHandlingMethod = {
  label: string;
  value: string;
};

export type ErrorHandlingMethods = {
  default: ErrorHandlingMethod;
  deadLetterQueue: ErrorHandlingMethod[];
};

export const ERROR_HANDLING_METHODS: ErrorHandlingMethods = {
  default: { label: "Ignore", value: "IGNORE" },
  deadLetterQueue: [
    { label: "Webhook", value: "webhook_sink_0.1" },
    { label: "Kafka topic", value: "kafka_topic_sink_0.1" },
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
