import React, { VoidFunctionComponent } from "react";
import {
  Alert,
  Stack,
  StackItem,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { useTranslation } from "@rhoas/app-services-ui-components";
import { ResourceStatusDelayed } from "@app/components/ResourceStatusLabel/types";
import { CreationStatusOrder } from "@app/components/SEStatusLabel/SEStatusPopover/types";
import SEStatusStepper from "@app/components/SEStatusLabel/SEStatusPopover/SEStatusStepper";

interface SEStatusPopoverContentProps {
  status: ManagedResourceStatus;
  creationDelayed?: ResourceStatusDelayed;
}

const SEStatusPopoverContent: VoidFunctionComponent<
  SEStatusPopoverContentProps
> = (props) => {
  const { status, creationDelayed } = props;
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const currentStep = CreationStatusOrder.findIndex((s) => s === status);

  return (
    <Stack hasGutter>
      <StackItem
        data-ouia-component-id="info-banner"
        data-ouia-component-type="QE/StackItem"
      >
        {creationDelayed && (
          <Alert
            ouiaId="longer-than-expected"
            variant={creationDelayed}
            isInline
            isPlain
            title={t("common.thisIsTakingLongerThanExpected")}
          />
        )}
        {!creationDelayed && (
          <TextContent>
            <Text component={TextVariants.small} ouiaId="ready-shortly">
              {t("common.thisWillBeReadyShortly")}
            </Text>
          </TextContent>
        )}
      </StackItem>
      <StackItem
        data-ouia-component-id="steps-count"
        data-ouia-component-type="QE/StackItem"
      >
        {t("common.resourceSteps.stepsCount", {
          currentStep,
          total: CreationStatusOrder.length,
        })}
      </StackItem>
      <StackItem
        data-ouia-component-id="steps"
        data-ouia-component-type="QE/StackItem"
      >
        <SEStatusStepper status={status} />
      </StackItem>
    </Stack>
  );
};

export default SEStatusPopoverContent;
