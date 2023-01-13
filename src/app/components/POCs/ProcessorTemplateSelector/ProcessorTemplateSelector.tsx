import React, { useState } from "react";
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
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import { useTranslation } from "@rhoas/app-services-ui-components";
import "./ProcessorTemplateSelector.css";
import ProcessorCodeEditor from "@app/components/POCs/ProcessorCodeEditor/ProcessorCodeEditor";

interface ProcessorTemplate {
  icon?: React.ComponentType;
  title: string;
  description: string;
  code: string;
}

export interface ProcessorTemplateSelectorProps {
  onCancel: () => void;
  onNext: (templateCode: string) => void;
  onSkip: () => void;
  templates: ProcessorTemplate[];
}

export const ProcessorTemplateSelector = ({
  onCancel,
  onNext,
  onSkip,
  templates,
}: ProcessorTemplateSelectorProps): JSX.Element => {
  const { t } = useTranslation("smartEventsTempDictionary");

  const [selectedTemplate, setSelectedTemplate] = useState<ProcessorTemplate>(
    templates[0]
  );

  return (
    <Grid className="processor-template-selector" hasGutter>
      <GridItem
        className="processor-template-selector__left-section"
        lg={3}
        sm={4}
      >
        <Flex direction={{ default: "column" }}>
          <FlexItem>
            <TextContent>
              <Text component="h6">{t("processor.templateSelection")}</Text>
              <Text component="small">
                {t("processor.templateSelectionDescription")}
              </Text>
            </TextContent>
          </FlexItem>
          {templates.map((template) => (
            <FlexItem key={template.title}>
              <Card
                id={template.title}
                onClick={(event): void => {
                  const clickedTemplateTitle = event.currentTarget.id;
                  if (clickedTemplateTitle !== selectedTemplate.title) {
                    const clickedTemplate =
                      templates.find(
                        (template) => template.title === clickedTemplateTitle
                      ) ?? selectedTemplate;
                    setSelectedTemplate(clickedTemplate);
                  }
                }}
                isCompact
                isSelectableRaised
                isSelected={selectedTemplate.title === template.title}
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
            </FlexItem>
          ))}
        </Flex>
      </GridItem>
      <GridItem lg={9} sm={8}>
        <Flex
          direction={{ default: "column" }}
          className="processor-template-selector__preview-section"
        >
          <FlexItem flex={{ default: "flex_1" }}>
            <ProcessorCodeEditor
              code={selectedTemplate.code}
              onChange={(): void => {}}
              onValidate={(): void => {}}
              onGuideClick={(): void => {}}
              readOnly={true}
              sinkConnectorsNames={[]}
            />
          </FlexItem>
          <FlexItem>
            <Button
              variant="primary"
              onClick={(): void => onNext(selectedTemplate.code)}
            >
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
