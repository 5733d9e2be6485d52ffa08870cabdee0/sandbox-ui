import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionGroup,
  Alert,
  AlertGroup,
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  FormSection,
  Grid,
  GridItem,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  TextInput,
  Tile,
} from "@patternfly/react-core";
import FiltersEdit from "@app/Processor/ProcessorEdit/FiltersEdit/FiltersEdit";
import { CodeEditor } from "@patternfly/react-code-editor";
import ActionEdit from "@app/Processor/ProcessorEdit/ActionEdit/ActionEdit";
import {
  Action,
  ProcessorRequest,
  ProcessorResponse,
} from "@openapi/generated";
import SourceEdit from "@app/Processor/ProcessorEdit/SourceEdit/SourceEdit";
import { EventFilter, ProcessorFormData } from "../../../types/Processor";
import { useValidateProcessor } from "@app/Processor/ProcessorEdit/useValidateProcessor";
import "./ProcessorEdit.css";

interface ProcessorEditProps {
  processor?: ProcessorResponse;
  existingProcessorName?: string;
  isLoading: boolean;
  saveButtonLabel: string;
  onSave: (requestData: ProcessorRequest) => void;
  onCancel: () => void;
  processorTypeSection?: JSX.Element;
}

const ProcessorEdit = (props: ProcessorEditProps): JSX.Element => {
  const {
    existingProcessorName,
    isLoading,
    saveButtonLabel,
    onSave,
    onCancel,
    processor,
    processorTypeSection,
  } = props;
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const [processorType, setProcessorType] = useState(processor?.type ?? "");
  const [name, setName] = useState(processor?.name ?? "");
  const [filters, setFilters] = useState<EventFilter[]>(
    (processor?.filters as unknown as EventFilter[]) ?? [
      { key: "", type: "", value: "" },
    ]
  );
  const [transformation, setTransformation] = useState(
    processor?.transformationTemplate ?? ""
  );
  const [action, setAction] = useState<Action>(
    processor?.action ?? {
      type: "",
      parameters: {},
    }
  );
  const [source, setSource] = useState(
    processor?.source ?? {
      type: "",
      parameters: {},
    }
  );
  const [request, setRequest] = useState<ProcessorFormData>({
    name,
    type: processorType,
    filters,
    transformationTemplate: transformation,
    action,
    source,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    registerValidateConfig,
    validateName,
    validation,
    validate,
    resetValidation,
  } = useValidateProcessor(request, existingProcessorName);

  useEffect(() => {
    setRequest({
      name,
      type: processorType,
      filters,
      transformationTemplate: transformation,
      action,
      source,
    });
  }, [name, processorType, filters, transformation, action, source]);

  const prepareRequest = (formData: ProcessorFormData): ProcessorRequest => {
    const requestData: ProcessorRequest = { name: formData.name };
    if (formData.type === "sink") {
      requestData.action = formData.action;
    } else {
      requestData.source = formData.source;
    }
    if (formData.filters && formData.filters.length > 0) {
      const filtersData = formData.filters.filter(
        (filter) => filter.type && filter.value && filter.key
      );
      if (filtersData.length > 0) {
        requestData.filters =
          filtersData as unknown as ProcessorRequest["filters"];
      }
    }
    if (
      formData.transformationTemplate &&
      formData.transformationTemplate.trim().length > 0
    ) {
      requestData.transformationTemplate =
        formData.transformationTemplate.trim();
    }
    return requestData;
  };

  const handleSubmit = (): void => {
    setIsSubmitted(true);
    if (validate() && request) {
      const requestData = prepareRequest(request);
      onSave(requestData);
    }
  };

  useEffect(() => {
    if (existingProcessorName) {
      setIsSubmitted(true);
      validate();
    }
  }, [existingProcessorName, validate]);

  useEffect(() => {
    if (isSubmitted) {
      document.querySelector(".processor-field-error")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      setIsSubmitted(false);
    }
  }, [isSubmitted]);

  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        padding={{ default: "noPadding" }}
        className="processor-edit__page-section"
      >
        <section className={"processor-edit__container"}>
          <Flex direction={{ default: "column" }} style={{ height: "100%" }}>
            <Flex
              direction={{ default: "column" }}
              grow={{ default: "grow" }}
              flexWrap={{ default: "nowrap" }}
              className={"processor-edit__outer-wrap"}
            >
              <Flex
                direction={{ default: "column" }}
                grow={{ default: "grow" }}
                className={"processor-edit__inner-wrap"}
              >
                <FlexItem
                  grow={{ default: "grow" }}
                  className={"processor-edit__content-wrap"}
                >
                  <Form className={"processor-edit__form"}>
                    <FormSection
                      title={t("processor.generalInformation")}
                      titleElement="h2"
                    >
                      {processorTypeSection ? (
                        processorTypeSection
                      ) : (
                        <FormGroup
                          label={t("processor.selectProcessorType")}
                          fieldId={"processor-type"}
                          isRequired
                          helperTextInvalid={validation.errors.processorType}
                          validated={
                            validation.errors.processorType
                              ? "error"
                              : "default"
                          }
                          className={
                            validation.errors.processorType &&
                            "processor-field-error"
                          }
                        >
                          <Grid
                            hasGutter={true}
                            className={"processor-form__type-selection"}
                          >
                            <GridItem span={6}>
                              <Tile
                                title={t("processor.sourceProcessor")}
                                isSelected={processorType === "source"}
                                style={{ height: "100%" }}
                                onClick={(): void => {
                                  setProcessorType("source");
                                  resetValidation("processorType");
                                }}
                              >
                                {t("processor.sourceProcessorDescription")}
                              </Tile>
                            </GridItem>
                            <GridItem span={6}>
                              <Tile
                                title={t("processor.sinkProcessor")}
                                style={{ width: "100%", height: "100%" }}
                                isSelected={processorType === "sink"}
                                onClick={(): void => {
                                  setProcessorType("sink");
                                  resetValidation("processorType");
                                }}
                              >
                                {t("processor.sinkProcessorDescription")}
                              </Tile>
                            </GridItem>
                          </Grid>
                        </FormGroup>
                      )}
                      <FormGroup
                        fieldId={"processor-name"}
                        label={t("processor.processorName")}
                        isRequired={true}
                        helperTextInvalid={validation.errors.name}
                        validated={validation.errors.name ? "error" : "default"}
                        className={
                          validation.errors.name && "processor-field-error"
                        }
                      >
                        <TextInput
                          type="text"
                          id="processor-name"
                          ouiaId="processor-name"
                          name="processor-name"
                          aria-describedby="processor-name"
                          isRequired={true}
                          maxLength={255}
                          value={name}
                          onChange={setName}
                          validated={
                            validation.errors.name ? "error" : "default"
                          }
                          onBlur={(): void => {
                            validateName();
                          }}
                        />
                      </FormGroup>
                    </FormSection>
                    {processorType !== "" && (
                      <>
                        {processorType === "source" && (
                          <FormSection title={t("processor.source")}>
                            <TextContent>
                              <Text
                                component="p"
                                ouiaId="source-type-description"
                              >
                                {t(
                                  "processor.selectSourceProcessorTypeDescription"
                                )}
                              </Text>
                            </TextContent>
                            <SourceEdit
                              source={source}
                              onChange={setSource}
                              registerValidation={registerValidateConfig}
                            />
                          </FormSection>
                        )}

                        <FormSection
                          title={t("processor.filters")}
                          titleElement="h2"
                        >
                          <FiltersEdit
                            filters={filters}
                            onChange={setFilters}
                          />
                        </FormSection>
                        <FormSection title={t("processor.transformation")}>
                          <TextContent>
                            <Text
                              component="p"
                              ouiaId={"transformation-description"}
                            >
                              {t("processor.addTransformationDescription")}
                            </Text>
                          </TextContent>
                          <CodeEditor
                            id={"transformation-template"}
                            height={"300px"}
                            isLineNumbersVisible={true}
                            code={transformation}
                            onChange={setTransformation}
                            options={{
                              scrollbar: { alwaysConsumeMouseWheel: false },
                            }}
                          />
                        </FormSection>
                        {processorType === "sink" && (
                          <FormSection title={t("processor.action")}>
                            <TextContent>
                              <Text component="p" ouiaId="action-description">
                                {t("processor.selectActionDescription")}
                              </Text>
                            </TextContent>
                            <ActionEdit
                              action={action}
                              onChange={setAction}
                              registerValidation={registerValidateConfig}
                            />
                          </FormSection>
                        )}
                        {processorType !== "" && (
                          <AlertGroup
                            className={"processor-edit__form__notice"}
                          >
                            <Alert
                              variant="info"
                              ouiaId="info-processor-available-soon"
                              isInline={true}
                              isPlain={true}
                              title={t(
                                "processor.processorWillBeAvailableShortly"
                              )}
                            />
                          </AlertGroup>
                        )}
                      </>
                    )}
                  </Form>
                </FlexItem>
              </Flex>
              <Flex
                flexWrap={{ default: "wrap" }}
                shrink={{ default: "shrink" }}
              >
                <ActionGroup className={"processor-edit__actions"}>
                  <Button
                    variant="primary"
                    ouiaId="submit"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    isDisabled={isLoading}
                  >
                    {saveButtonLabel}
                  </Button>
                  <Button
                    variant="link"
                    ouiaId="cancel"
                    onClick={onCancel}
                    isDisabled={isLoading}
                  >
                    {t("common.cancel")}
                  </Button>
                </ActionGroup>
              </Flex>
            </Flex>
          </Flex>
        </section>
      </PageSection>
    </>
  );
};

export default ProcessorEdit;
