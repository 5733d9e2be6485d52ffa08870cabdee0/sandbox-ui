import React, { useEffect, useState } from "react";
import {
  FormGroup,
  FormSelect,
  FormSelectOption,
  TextInput,
} from "@patternfly/react-core";
import { BaseAction } from "../../../../../openapi/generated";

interface ActionEditProps {
  action?: BaseAction;
  onChange: (action: BaseAction) => void;
}

const ActionEdit = (props: ActionEditProps) => {
  const { action, onChange } = props;
  const [type, setType] = useState(action?.type ?? "");
  const [parameters, setParameters] = useState(action?.parameters ?? {});

  const updateType = (type: string) => {
    setType(type);
    onChange({
      type,
      parameters,
    });
  };

  const updateConfiguration = (parameters: BaseAction["parameters"]) => {
    setParameters(parameters);
    onChange({
      type,
      parameters,
    });
  };

  useEffect(() => {
    if (action) {
      setType(action.type);
      setParameters(action.parameters);
    }
  }, [action]);

  const actionTypes = [
    { value: "", label: "Select an action", isPlaceholder: true },
    { value: "KafkaTopic", label: "Send to Kafka", isPlaceholder: false },
    { value: "Webhook", label: "Webhook", isPlaceholder: false },
    { value: "SendToBridge", label: "Send to Instance", isPlaceholder: false },
    { value: "Slack", label: "Send to Slack", isPlaceholder: false },
  ];

  return (
    <>
      <FormGroup fieldId={`action-type`} label="Action type" isRequired={true}>
        <FormSelect
          id={`action-type`}
          aria-label="Action type"
          isRequired={true}
          value={type}
          onChange={(type) => updateType(type)}
        >
          {actionTypes.map((option, index) => (
            <FormSelectOption
              key={index}
              value={option.value}
              label={option.label}
              isPlaceholder={option.isPlaceholder}
            />
          ))}
        </FormSelect>
      </FormGroup>
      {type === "" && (
        <FormGroup fieldId={`action-config`} label="Action configuration">
          <TextInput
            type="text"
            id="action-config"
            name="action-config"
            aria-describedby="action-config"
            isDisabled={true}
          />
        </FormGroup>
      )}
      {type === "KafkaTopic" && (
        <FormGroup
          fieldId={`kafka-topic`}
          label="Kafka topic"
          isRequired={true}
        >
          <TextInput
            type="text"
            id="kafka-topic"
            name="kafka-topic"
            aria-describedby="kafka-topic"
            isRequired={true}
            value={parameters.topic}
            onChange={(value) => {
              updateConfiguration({
                ...parameters,
                topic: value,
              });
            }}
          />
        </FormGroup>
      )}
      {type === "Webhook" && (
        <FormGroup
          fieldId={`webhook-endpoint`}
          label="Endpoint"
          isRequired={true}
        >
          <TextInput
            type="url"
            id="webhook-endpoint"
            name="webhook-endpoint"
            aria-describedby="webhook-endpoint"
            isRequired={true}
            value={parameters.endpoint}
            onChange={(value) => {
              updateConfiguration({
                ...parameters,
                endpoint: value,
              });
            }}
          />
        </FormGroup>
      )}
      {type === "SendToBridge" && (
        <FormGroup fieldId={`bridge-id`} label="Instance Id" isRequired={true}>
          <TextInput
            type="text"
            id="bridge-id"
            name="bridge-id"
            aria-describedby="bridge-id"
            isRequired={true}
            value={parameters.bridgeId}
            onChange={(value) => {
              updateConfiguration({
                ...parameters,
                bridgeId: value,
              });
            }}
          />
        </FormGroup>
      )}
      {type === "Slack" && (
        <>
          <FormGroup
            fieldId={`slack-channel`}
            label="Slack channel"
            isRequired={true}
          >
            <TextInput
              type="text"
              id="slack-channel"
              name="slack-channel"
              aria-describedby="slack-channel"
              isRequired={true}
              value={parameters.channel}
              onChange={(value) => {
                updateConfiguration({
                  ...parameters,
                  channel: value,
                });
              }}
            />
          </FormGroup>
          <FormGroup
            fieldId={`slack-webhook-url`}
            label="Slack webhook URL"
            isRequired={true}
          >
            <TextInput
              type="url"
              id="slack-webhook-url"
              name="slack-webhook-url"
              aria-describedby="slack-webhook-url"
              isRequired={true}
              value={parameters.webhookUrl}
              onChange={(value) => {
                updateConfiguration({
                  ...parameters,
                  webhookUrl: value,
                });
              }}
            />
          </FormGroup>
        </>
      )}
    </>
  );
};

export default ActionEdit;
