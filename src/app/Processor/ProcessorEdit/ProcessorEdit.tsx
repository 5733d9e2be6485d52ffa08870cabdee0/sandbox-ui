import React, { useState } from "react";
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
import FiltersEdit, {
  EventFilter,
} from "@app/Processor/ProcessorEdit/FiltersEdit/FiltersEdit";
import { CodeEditor } from "@patternfly/react-code-editor";
import ActionEdit from "@app/Processor/ProcessorEdit/ActionEdit/ActionEdit";
import { BaseAction } from "../../../../openapi/generated";
import SourceEdit from "@app/Processor/ProcessorEdit/SourceEdit/SourceEdit";
import "./ProcessorEdit.css";

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
                    <FormSection title="General Information" titleElement="h2">
                      <FormGroup
                        label="Select processor type"
                        fieldId={"processor-type"}
                        isRequired
                      >
                        <Grid
                          hasGutter={true}
                          className={"processor-form__type-selection"}
                        >
                          <GridItem span={6}>
                            <Tile
                              title="Source Processor"
                              isSelected={processorType === "source"}
                              style={{ height: "100%" }}
                              onClick={() => setProcessorType("source")}
                            >
                              Source processors are ready-to-use connectors that
                              allow to connect and stream data from external
                              sources without having to write any code.
                            </Tile>
                          </GridItem>
                          <GridItem span={6}>
                            <Tile
                              title="Sink Processor"
                              style={{ width: "100%", height: "100%" }}
                              isSelected={processorType === "sink"}
                              onClick={() => setProcessorType("sink")}
                            >
                              Sink processors help connect events to actions.
                            </Tile>
                          </GridItem>
                        </Grid>
                      </FormGroup>
                      <FormGroup
                        fieldId={"processor-name"}
                        label="Processor name"
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
                          <FormSection title="Source">
                            <TextContent>
                              <Text component="p">
                                Select a source type and provide its
                                configuration.
                              </Text>
                            </TextContent>
                            <SourceEdit source={source} onChange={setSource} />
                          </FormSection>
                        )}

                        <FormSection title="Filters" titleElement="h2">
                          <FiltersEdit
                            filters={filters}
                            onChange={setFilters}
                          />
                        </FormSection>
                        <FormSection title="Transformation">
                          <TextContent>
                            <Text component="p">
                              Add a transformation template.
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
                          <FormSection title="Action">
                            <TextContent>
                              <Text component="p">
                                Select an action and provide its configuration.
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
                    Create
                  </Button>
                  <Button variant="link" onClick={onCancel}>
                    Cancel
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
