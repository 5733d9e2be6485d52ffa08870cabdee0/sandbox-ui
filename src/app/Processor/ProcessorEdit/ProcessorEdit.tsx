import React, { useEffect, useMemo, useState } from "react";
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
  FilterType,
  ProcessorFormData,
  ProcessorSchemaType,
} from "../../../types/Processor";
import { useValidateProcessor } from "@app/Processor/ProcessorEdit/useValidateProcessor";
import { isCommaSeparatedFilterType } from "@utils/filterUtils";
import ConfigurationEdit from "@app/Processor/ProcessorEdit/ConfigurationEdit/ConfigurationEdit";
import { GetSchema } from "../../../hooks/useSchemasApi/useGetSchemaApi";
import "./ProcessorEdit.css";
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

  const prepareFilters: (filters: EventFilter[]) => Partial<EventFilter>[] = (
    filters: EventFilter[]
  ) =>
    filters
      .filter(
        (filter) => filter.type && (filter.value || filter.values) && filter.key
      )
      .map((filter) => {
        if (filter.value && isCommaSeparatedFilterType(filter)) {
          const multipleValuesMapper = (item: string): number | string =>
            filter.type === FilterType.NUMBER_IN
              ? parseFloat(item.trim())
              : item.trim();

          const multipleValuesPredicate =
            filter.type === FilterType.NUMBER_IN
              ? (item: number | string): boolean =>
                  item !== null && !isNaN(item as number)
              : String;

          const values = filter.value
            .split(",")
            .map(multipleValuesMapper)
            .filter(multipleValuesPredicate);

          return {
            key: filter.key,
            type: filter.type,
            values,
          };
        }
        return filter;
      })
      .filter(
        (item: Partial<EventFilter>) =>
          item.value || (item.values && item.values.length > 0)
      );

  const prepareRequest = (formData: ProcessorFormData): ProcessorRequest => {
    const requestData: ProcessorRequest = { name: formData.name };
    if (formData.type === ProcessorType.Sink) {
      requestData.action = formData.action;
    } else {
      requestData.source = formData.source;
    }
    if (formData.filters && formData.filters.length > 0) {
      const filtersData = prepareFilters(formData.filters) as EventFilter[];
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
                  <Form className={"processor-edit__form"}>
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
                              readOnly={isExistingProcessor}
                              schemaCatalog={schemaCatalog}
                              getSchema={getSchema}
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
                                readOnly={isExistingProcessor}
                                schemaCatalog={schemaCatalog}
                                getSchema={getSchema}
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
      </PageSection>
    </>
  );
};

export default ProcessorEdit;
