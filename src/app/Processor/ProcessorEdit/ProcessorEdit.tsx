import React from "react";
import { useTranslation } from "@rhoas/app-services-ui-components";
import {
  ActionGroup,
  Alert,
  Button,
  PageSection,
  PageSectionVariants,
} from "@patternfly/react-core";

import StickyActionsLayout from "@app/components/StickyActionsLayout/StickyActionsLayout";
import CamelDSLCodeEditor from "@app/components/POCs/CamelDSLCodeEditor/CamelDSLCodeEditor";

const ProcessorEdit = (): JSX.Element => {
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  return (
    <PageSection
      variant={PageSectionVariants.light}
      padding={{ default: "noPadding" }}
    >
      <StickyActionsLayout
        actions={
          <ActionGroup>
            <Button variant="primary" ouiaId="submit">
              {t("common.save")}
            </Button>
            <Button variant="link" ouiaId="cancel">
              {t("common.cancel")}
            </Button>
          </ActionGroup>
        }
        contentId={"processor-form-container"}
      >
        <Alert variant="default" isInline title="TBD" />
        <CamelDSLCodeEditor
          code={defaultValue}
          onChange={(): void => console.log("change")}
        />
      </StickyActionsLayout>
    </PageSection>
  );
};

export default ProcessorEdit;

const defaultValue = `- from:
    uri: "rhose:bridge"
    parameters:
      period: "1000"
    steps:
      - set-body:
          constant: "Hello Camel K from yaml"
      - to: "log:info"
`;
