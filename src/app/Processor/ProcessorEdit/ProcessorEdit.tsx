import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActionGroup,
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
import { BaseAction } from "../../../../openapi/generated";
import SourceEdit from "@app/Processor/ProcessorEdit/SourceEdit/SourceEdit";
import "./ProcessorEdit.css";
import { EventFilter } from "@app/Processor/types";

interface ProcessorEditProps {
  onSave: () => void;
  onCancel: () => void;
}

const ProcessorEdit = (props: ProcessorEditProps) => {
  const { onSave, onCancel } = props;
  const [processorType, setProcessorType] = useState("");
  const [filters, setFilters] = useState<EventFilter[]>([
    { key: "", type: "", value: "" },
  ]);
  const [transformation, setTransformation] = useState("");
  const [action, setAction] = useState<BaseAction>({
    type: "",
    parameters: {},
  });
  const [source, setSource] = useState({
    type: "",
    parameters: {},
  });

  const { t } = useTranslation(["openbridgeTempDictionary"]);

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
                      <FormGroup
                        label={t("processor.selectProcessorType")}
                        fieldId={"processor-type"}
                        isRequired
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
                              onClick={() => setProcessorType("source")}
                            >
                              {t("processor.sourceProcessorDescription")}
                            </Tile>
                          </GridItem>
                          <GridItem span={6}>
                            <Tile
                              title={t("processor.sinkProcessor")}
                              style={{ width: "100%", height: "100%" }}
                              isSelected={processorType === "sink"}
                              onClick={() => setProcessorType("sink")}
                            >
                              {t("processor.sinkProcessorDescription")}
                            </Tile>
                          </GridItem>
                        </Grid>
                      </FormGroup>
                      <FormGroup
                        fieldId={"processor-name"}
                        label={t("processor.processorName")}
                        isRequired={true}
                      >
                        <TextInput
                          type="text"
                          id="processor-name"
                          name="processor-name"
                          aria-describedby="processor-name"
                          isRequired={true}
                          maxLength={255}
                        />
                      </FormGroup>
                    </FormSection>
                    {processorType !== "" && (
                      <>
                        {processorType === "source" && (
                          <FormSection title={t("processor.source")}>
                            <TextContent>
                              <Text component="p">
                                {t(
                                  "processor.selectSourceProcessorTypeDescription"
                                )}
                              </Text>
                            </TextContent>
                            <SourceEdit source={source} onChange={setSource} />
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
                            <Text component="p">
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
                              <Text component="p">
                                {t("processor.selectActionDescription")}
                              </Text>
                            </TextContent>
                            <ActionEdit action={action} onChange={setAction} />
                          </FormSection>
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
                  <Button variant="primary" onClick={onSave}>
                    {t("common.create")}
                  </Button>
                  <Button variant="link" onClick={onCancel}>
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
