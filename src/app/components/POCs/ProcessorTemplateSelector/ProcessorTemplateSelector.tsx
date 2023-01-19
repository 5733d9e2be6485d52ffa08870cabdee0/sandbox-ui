import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";
import ProcessorCodeEditor from "@app/components/POCs/ProcessorCodeEditor/ProcessorCodeEditor";
import { ProcessorTemplate } from "@app/components/POCs/ProcessorEdit/ProcessorTemplates";
import "./ProcessorTemplateSelector.css";

export interface ProcessorTemplateSelectorProps {
  templates: ProcessorTemplate[];
  selectedTemplate: ProcessorTemplate["id"];
  onSelect: (templateId: ProcessorTemplate["id"]) => void;
  onNext: () => void;
  onCancel: () => void;
  onSkip: () => void;
}

export const ProcessorTemplateSelector = ({
  templates,
  selectedTemplate,
  onSelect,
  onNext,
  onCancel,
  onSkip,
}: ProcessorTemplateSelectorProps): JSX.Element => {
  const { t } = useTranslation("smartEventsTempDictionary");
  const [selection, setSelection] = useState(selectedTemplate);

  const codePreview = useMemo(
    () => templates.find((template) => template.id === selection)?.code ?? "",
    [templates, selection]
  );

  useEffect(() => {
    setSelection(selectedTemplate);
  }, [selectedTemplate]);

  return (
    <Grid className="processor-template-selector">
      <GridItem
        className="processor-template-selector__left-section"
        lg={3}
        sm={4}
      >
        <Flex
          direction={{ default: "column" }}
          className="processor-template-selector__templates"
        >
          <FlexItem className="processor-template-selector__templates__header">
            <TextContent>
              <Text component="h6">{t("processor.templateSelection")}</Text>
              <Text component="small">
                {t("processor.templateSelectionDescription")}
              </Text>
            </TextContent>
          </FlexItem>
          <FlexItem
            flex={{ default: "flex_1" }}
            className="processor-template-selector__templates__list"
          >
            <Stack
              hasGutter={true}
              className={"processor-template-selector__templates__scrollable"}
            >
              {templates.map((template) => (
                <StackItem key={template.id}>
                  <Card
                    id={template.id}
                    data-testid={template.id}
                    onClick={(event): void => {
                      setSelection(event.currentTarget.id);
                      onSelect(event.currentTarget.id);
                    }}
                    isCompact
                    isSelectableRaised
                    isSelected={selection === template.id}
                  >
                    <CardBody>
                      <EmptyState>
                        <EmptyStateIcon icon={template.icon} />
                        <Title headingLevel="h2" size="lg">
                          {template.title}
                        </Title>
                        <EmptyStateBody>{template.description}</EmptyStateBody>
                      </EmptyState>
                    </CardBody>
                  </Card>
                </StackItem>
              ))}
            </Stack>
          </FlexItem>
        </Flex>
      </GridItem>
      <GridItem
        className="processor-template-selector__right-section"
        lg={9}
        sm={8}
      >
        <Flex
          direction={{ default: "column" }}
          className="processor-template-selector__preview-section"
        >
          <FlexItem flex={{ default: "flex_1" }}>
            <ProcessorCodeEditor
              code={codePreview}
              onGuideClick={(): void => {}}
              readOnly={true}
              sinkConnectorsNames={[]}
              onValidate={(): void => {}}
              onChange={(): void => {}}
            />
          </FlexItem>
          <FlexItem>
            <Button variant="primary" onClick={onNext}>
              {t("common.next")}
            </Button>{" "}
            <Button variant="secondary" onClick={onSkip}>
              {t("common.skipAndUseBlankEditor")}
            </Button>
            <Button variant="link" onClick={onCancel}>
              {t("common.cancel")}
            </Button>
          </FlexItem>
        </Flex>
      </GridItem>
    </Grid>
  );
};
