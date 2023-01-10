import React, { FunctionComponent, useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  FormProps,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import {
  CheckIcon,
  ExclamationCircleIcon,
  PencilAltIcon,
  TimesIcon,
} from "@patternfly/react-icons";
import { useTranslation } from "@rhoas/app-services-ui-components";
import "./ProcessorEditHeader.css";

export interface ProcessorEditHeaderProps {
  name?: string;
  onNameChange: (name: string) => void;
  showCreateAction: boolean;
  onCreate: () => void;
}

const ProcessorEditHeader: FunctionComponent<ProcessorEditHeaderProps> = (
  props
) => {
  const { t } = useTranslation("smartEventsTempDictionary");
  const {
    name = t("processor.processorName") ?? "Processor name",
    onNameChange,
    onCreate,
    showCreateAction,
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [nameValue, setNameValue] = useState(name);

  const onStartEditing = (): void => {
    setIsEditing(true);
  };

  const onDoneEditing = (): void => {
    setIsEditing(false);
    onNameChange(nameValue.trim());
  };

  const onCancelEditing = (): void => {
    setIsEditing(false);
    setNameValue(name);
  };

  const onChangeInputValue = (value: string): void => {
    setNameValue(value);
  };

  const onFormSubmit: FormProps["onSubmit"] = (event): void => {
    event.preventDefault();
    if (isNameValid) {
      onDoneEditing();
    }
  };

  const isNameValid = useMemo(() => nameValue.trim().length > 0, [nameValue]);

  useEffect(() => {
    setNameValue(name);
  }, [name]);

  return (
    <PageSection variant={PageSectionVariants.light} hasShadowBottom={true}>
      <Split hasGutter={true}>
        <SplitItem isFilled={true}>
          {isEditing ? (
            <div className="pf-c-inline-edit pf-m-inline-editable">
              <div className="pf-c-inline-edit__group">
                <div className="pf-c-inline-edit__input processor-name-input">
                  <Form id={"processor-name-form"} onSubmit={onFormSubmit}>
                    <FormGroup
                      fieldId="processor-name"
                      validated={
                        isNameValid
                          ? ValidatedOptions.default
                          : ValidatedOptions.error
                      }
                      helperTextInvalid={t(
                        "processor.pleaseEnterAProcessorName"
                      )}
                      helperTextInvalidIcon={<ExclamationCircleIcon />}
                    >
                      <TextInput
                        className="pf-c-form-control"
                        id={"processor-name"}
                        value={nameValue}
                        type="text"
                        onChange={onChangeInputValue}
                        validated={
                          isNameValid
                            ? ValidatedOptions.default
                            : ValidatedOptions.error
                        }
                        autoFocus={true}
                      />
                    </FormGroup>
                  </Form>
                </div>
                <div className="pf-c-inline-edit__group pf-m-action-group pf-m-icon-group">
                  <div className="pf-c-inline-edit__action pf-m-valid">
                    <Button
                      variant={"plain"}
                      onClick={onDoneEditing}
                      aria-label={t("processor.setName")}
                      isDisabled={!isNameValid}
                    >
                      <CheckIcon />
                    </Button>
                  </div>
                  <div className="pf-c-inline-edit__action">
                    <Button
                      variant={"plain"}
                      onClick={onCancelEditing}
                      aria-label={t("processor.cancelEdits")}
                    >
                      <TimesIcon />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <TextContent>
              <Text component="h1">
                <span>{name}</span>
                <Button
                  variant={"plain"}
                  aria-label={t("processor.editName")}
                  onClick={onStartEditing}
                >
                  <PencilAltIcon />
                </Button>
              </Text>
            </TextContent>
          )}
        </SplitItem>
        {showCreateAction && (
          <SplitItem>
            <Button onClick={onCreate}>{t("processor.deployProcessor")}</Button>
          </SplitItem>
        )}
      </Split>
    </PageSection>
  );
};

export default ProcessorEditHeader;
