import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Trans, useTranslation } from "react-i18next";
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
  Label,
  PageSection,
  PageSectionVariants,
  Popover,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextInput,
  Tile,
} from "@patternfly/react-core";
import FiltersEdit from "@app/Processor/ProcessorEdit/FiltersEdit/FiltersEdit";
import { CodeEditor } from "@patternfly/react-code-editor";
import {
  Action,
  ProcessorRequest,
  ProcessorResponse,
  ProcessorSchemaEntryResponse,
  ProcessorType,
} from "@rhoas/smart-events-management-sdk";
import {
  EventFilter,
  ProcessorFormData,
  ProcessorSchemaType,
} from "../../../types/Processor";
import { useValidateProcessor } from "@app/Processor/ProcessorEdit/useValidateProcessor";
import ConfigurationEdit from "@app/Processor/ProcessorEdit/ConfigurationEdit/ConfigurationEdit";
import { GetSchema } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import "./ProcessorEdit.css";
import { prepareRequest } from "@utils/processorUtils";
import axios from "axios";
import {
  getErrorCode,
  isServiceApiError,
} from "@openapi/generated/errorHelpers";
import { APIErrorCodes } from "@openapi/generated/errors";
import { ActionModal } from "@app/components/ActionModal/ActionModal";
import { css } from "@patternfly/react-styles";
import { HelpIcon } from "@patternfly/react-icons";
import { ExternalLink } from "@rhoas/app-services-ui-components";

export interface ProcessorEditProps {
  /** The processor data to populate the form. Used when updating an existing processor.
   * Not required when creating a new processor */
  processor?: ProcessorResponse;
  /** Flag indicating if the save request is loading */
  isLoading: boolean;
  /** Label for the "Save" button */
  saveButtonLabel: string;
  /** Callback for when the save button is clicked */
  onSave: (requestData: ProcessorRequest) => void;
  /** Callback for when the cancel button is clicked */
  onCancel: () => void;
  /** Already existing processor name that prevents from saving the processor */
  existingProcessorName?: string;
  /** Malformed transformation template error that prevents from saving the processor */
  malformedTransformationTemplate?: string;
  /** Catalog of all the actions/sources */
  schemaCatalog: ProcessorSchemaEntryResponse[];
  /** Callback to retrieve a single action/source schema */
  getSchema: GetSchema;
  /** Callback to redirect to SE Instance */
  goBackToInstance?: () => void;
}

const ProcessorEdit = (props: ProcessorEditProps): JSX.Element => {
  const {
    existingProcessorName,
    malformedTransformationTemplate,
    isLoading,
    saveButtonLabel,
    onSave,
    onCancel,
    processor,
    schemaCatalog,
    getSchema,
    goBackToInstance,
  } = props;
  const { t } = useTranslation(["openbridgeTempDictionary"]);
  const isExistingProcessor = useMemo(
    () => processor !== undefined,
    [processor]
  );
  const [processorType, setProcessorType] = useState<ProcessorType | undefined>(
    processor?.type
  );
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
  const [schema, setSchema] = useState<object>();
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const actionModalMessage = useRef<string>("");
  const actionModalFn = useRef<() => void>((): void =>
    setShowActionModal(false)
  );

  const resetActionOrSource = useCallback(() => {
    if (processorType === ProcessorType.Source) {
      setSource({ type: "", parameters: {} });
    } else {
      setAction({ type: "", parameters: {} });
    }
  }, [processorType]);

  useEffect(() => {
    let type;
    if (processorType === ProcessorType.Source && source.type) {
      type = source.type;
    }
    if (processorType === ProcessorType.Sink && action.type) {
      type = action.type;
    }
    if (type) {
      setSchema(undefined);
      getSchema(
        type,
        processorType === ProcessorType.Sink
          ? ProcessorSchemaType.ACTION
          : ProcessorSchemaType.SOURCE
      )
        .then((data) => setSchema(data))
        .catch((error) => {
          if (error && axios.isAxiosError(error)) {
            if (
              isServiceApiError(error) &&
              getErrorCode(error) === APIErrorCodes.ERROR_4
            ) {
              actionModalFn.current = (): void => {
                setShowActionModal(false);
                resetActionOrSource();
              };
              actionModalMessage.current = t(
                "processor.errors.cantCreateProcessorOfThatType"
              );
              setShowActionModal(true);
            } else {
              setShowActionModal(true);
              actionModalFn.current = (): void => {
                setShowActionModal(false);
                goBackToInstance?.();
              };
              actionModalMessage.current = t("common.tryAgainLater");
            }
          }
        });
    }
  }, [
    action.type,
    source.type,
    processorType,
    getSchema,
    t,
    goBackToInstance,
    resetActionOrSource,
  ]);

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

  const handleSubmit = useCallback((): void => {
    setIsSubmitted(true);
    if (validate() && request && schema) {
      const requestData = prepareRequest(request, isExistingProcessor, schema);
      onSave(requestData);
    }
  }, [validate, request, schema, isExistingProcessor, onSave]);

  useEffect(() => {
    if (existingProcessorName) {
      setIsSubmitted(true);
      validate();
    }
  }, [existingProcessorName, validate]);

  useEffect(() => {
    if (isSubmitted || malformedTransformationTemplate) {
      document
        .querySelector(".processor-field-error, .pf-m-error")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      setIsSubmitted(false);
    }
  }, [isSubmitted, malformedTransformationTemplate]);

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
                  <Form className={"processor-edit__form"} autoComplete="off">
                    <FormSection
                      title={t("processor.generalInformation")}
                      titleElement="h2"
                    >
                      {isExistingProcessor ? (
                        <Stack>
                          <StackItem>
                            <FormGroup
                              label={t("processor.processorType")}
                              fieldId={"processor-type"}
                            />
                          </StackItem>
                          <StackItem>
                            <Label
                              color={"blue"}
                              data-testid="processor-type-label"
                            >
                              {processor?.type &&
                                t(`processor.${processor.type}`)}
                            </Label>
                          </StackItem>
                        </Stack>
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
                                data-ouia-component-id="source"
                                data-ouia-component-type="Tile"
                                isSelected={
                                  processorType === ProcessorType.Source
                                }
                                style={{ height: "100%" }}
                                onClick={(): void => {
                                  setProcessorType(ProcessorType.Source);
                                  resetValidation("processorType");
                                }}
                              >
                                {t("processor.sourceProcessorDescription")}
                              </Tile>
                            </GridItem>
                            <GridItem span={6}>
                              <Tile
                                title={t("processor.sinkProcessor")}
                                data-ouia-component-id="sink"
                                data-ouia-component-type="Tile"
                                style={{ width: "100%", height: "100%" }}
                                isSelected={
                                  processorType === ProcessorType.Sink
                                }
                                onClick={(): void => {
                                  setProcessorType(ProcessorType.Sink);
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
                          isDisabled={isExistingProcessor}
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
                    {processorType && (
                      <>
                        {processorType === ProcessorType.Source && (
                          <FormSection
                            title={t("processor.source")}
                            data-ouia-component-id="sources"
                            data-ouia-component-type="form-section"
                          >
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
                            <ConfigurationEdit
                              configType={ProcessorSchemaType.SOURCE}
                              source={source}
                              registerValidation={registerValidateConfig}
                              onChange={setSource}
                              editMode={isExistingProcessor}
                              schemaCatalog={schemaCatalog}
                              schema={schema}
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

                        {processorType === ProcessorType.Sink && (
                          <>
                            <FormSection title={t("processor.transformation")}>
                              <TextContent>
                                <Text
                                  component="p"
                                  id="transformation-description"
                                  ouiaId="transformation-description"
                                >
                                  {t("processor.addTransformationDescription")}
                                  <Popover
                                    headerContent={t(
                                      "processor.transformationTemplate"
                                    )}
                                    bodyContent={
                                      <Trans
                                        i18nKey={
                                          "openbridgeTempDictionary:processor.transformationTemplateTooltip"
                                        }
                                        components={[
                                          <ExternalLink
                                            key="qute-reference-link"
                                            testId="qute-reference-link"
                                            href="https://quarkus.io/guides/qute-reference"
                                          />,
                                        ]}
                                      />
                                    }
                                  >
                                    <button
                                      type="button"
                                      aria-label={t(
                                        "processor.moreInfoForTransformationTemplate"
                                      )}
                                      onClick={(e): void => e.preventDefault()}
                                      aria-describedby="transformation-description"
                                      className="pf-c-form__group-label-help"
                                    >
                                      <HelpIcon noVerticalAlign={true} />
                                    </button>
                                  </Popover>
                                </Text>
                              </TextContent>
                              <CodeEditor
                                id={"transformation-template"}
                                className={css(
                                  "processor-edit__transformation-template",
                                  malformedTransformationTemplate
                                    ? "processor-field-error"
                                    : ""
                                )}
                                height={"300px"}
                                isLineNumbersVisible={true}
                                code={transformation}
                                onChange={setTransformation}
                                options={{
                                  scrollbar: { alwaysConsumeMouseWheel: false },
                                }}
                              />
                              {malformedTransformationTemplate && (
                                <p
                                  className="processor-edit__transformation-template__helper-text pf-c-form__helper-text pf-m-error"
                                  aria-live="polite"
                                >
                                  {malformedTransformationTemplate}
                                </p>
                              )}
                            </FormSection>
                            <FormSection
                              title={t("processor.action")}
                              data-ouia-component-id="actions"
                              data-ouia-component-type="form-section"
                            >
                              <TextContent>
                                <Text component="p" ouiaId="action-description">
                                  {t("processor.selectActionDescription")}
                                </Text>
                              </TextContent>
                              <ConfigurationEdit
                                configType={ProcessorSchemaType.ACTION}
                                action={action}
                                registerValidation={registerValidateConfig}
                                onChange={setAction}
                                editMode={isExistingProcessor}
                                schemaCatalog={schemaCatalog}
                                schema={schema}
                              />
                            </FormSection>
                          </>
                        )}
                        {processorType && (
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
        <ActionModal
          action={actionModalFn.current}
          message={actionModalMessage.current}
          showDialog={showActionModal}
          title={t("processor.errors.cantCreateProcessor")}
        />
      </PageSection>
    </>
  );
};

export default ProcessorEdit;
