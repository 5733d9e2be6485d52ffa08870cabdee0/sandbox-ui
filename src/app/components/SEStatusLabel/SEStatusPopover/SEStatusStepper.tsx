import React, { VoidFunctionComponent } from "react";
import { ProgressStep, ProgressStepper } from "@patternfly/react-core";
import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { CreationStatusOrder } from "@app/components/SEStatusLabel/SEStatusPopover/types";
import { ProgressStepProps } from "@patternfly/react-core/dist/esm/components/ProgressStepper/ProgressStep";
import { useTranslation } from "@rhoas/app-services-ui-components";

interface SEStatusStepperProps {
  status: ManagedResourceStatus;
}

const SEStatusStepper: VoidFunctionComponent<SEStatusStepperProps> = (
  props
) => {
  const { status } = props;
  const { t } = useTranslation(["smartEventsTempDictionary"]);

  const currentStep = CreationStatusOrder.findIndex((s) => s === status);

  const getVariant = (index: number): ProgressStepProps["variant"] =>
    (currentStep === index && "info") ||
    (currentStep > index && "success") ||
    "default";

  return (
    <ProgressStepper isVertical={true}>
      <ProgressStep
        id={"pending"}
        titleId={"pending"}
        isCurrent={status === ManagedResourceStatus.Accepted}
        aria-label={t("common.resourceSteps.pending.title")}
        variant={getVariant(0)}
        data-ouia-component-id="pending"
        data-ouia-component-type="QE/ProgressStep"
      >
        {t("common.resourceSteps.pending.title")}
      </ProgressStep>
      <ProgressStep
        id={"preparing"}
        titleId={"preparing"}
        isCurrent={status === ManagedResourceStatus.Preparing}
        aria-label={t("common.resourceSteps.preparing.title")}
        variant={getVariant(1)}
        data-ouia-component-id="preparing"
        data-ouia-component-type="QE/ProgressStep"
      >
        {t("common.resourceSteps.preparing.title")}
      </ProgressStep>
      <ProgressStep
        id={"provisioning"}
        titleId={"provisioning"}
        isCurrent={status === ManagedResourceStatus.Provisioning}
        aria-label={t("common.resourceSteps.provisioning.title")}
        variant={getVariant(2)}
        data-ouia-component-id="provisioning"
        data-ouia-component-type="QE/ProgressStep"
      >
        {t("common.resourceSteps.provisioning.title")}
      </ProgressStep>
    </ProgressStepper>
  );
};

export default SEStatusStepper;
