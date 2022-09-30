/**
 * This enum represents variants of the attribute in PF ProgressStep.
 */
export enum SEStepStatus {
  Success = "pf-m-success",
  Info = "pf-m-info",
  Default = "",
  //Failed = "", //TODO: ask if it could exists
}

interface SEStepEnumInterface {
  ouiaId: string;
  innerText: string;
}

interface SEStepEnum {
  [key: string]: SEStepEnumInterface;
}

export const SEStep: SEStepEnum = {
  CREATION_PENDIMG: { ouiaId: "pending", innerText: "Creation pending" },
  PREPARING: { ouiaId: "preparing", innerText: "Preparing" },
  PROVISIONING: { ouiaId: "provisioning", innerText: "Provisioning" },
};

interface SEInstanceStatusEnumInterface {
  creatingStep: SEStepStatus;
  preparingStep: SEStepStatus;
  provisioningStep: SEStepStatus;
}

interface SEInstanceStatusEnum {
  [key: string]: SEInstanceStatusEnumInterface;
}

export const SEInstanceStatus: SEInstanceStatusEnum = {
  ACCEPTED: {
    creatingStep: SEStepStatus.Info,
    preparingStep: SEStepStatus.Default,
    provisioningStep: SEStepStatus.Default,
  },
  PREPARING: {
    creatingStep: SEStepStatus.Success,
    preparingStep: SEStepStatus.Info,
    provisioningStep: SEStepStatus.Default,
  },
  PROVISIONING: {
    creatingStep: SEStepStatus.Success,
    preparingStep: SEStepStatus.Success,
    provisioningStep: SEStepStatus.Info,
  },
  //READY status is not visible in the popover
};

/**
 * Assert progress of the one step status in the SE status popover.
 * @param status
 * @param step
 */
export function progressStepStatus(
  status: SEStepStatus,
  step: SEStepEnumInterface
) {
  cy.ouiaId(step.ouiaId, "QE/ProgressStep").then(($li) => {
    //this `li` element is not visible - size 0,0
    switch (status) {
      case SEStepStatus.Info:
      case SEStepStatus.Success:
        expect($li).have.class(status);
        cy.ouiaId("span.pf-c-progress-stepper__step-icon").should(
          "not.be.empty"
        );
        break;
      case SEStepStatus.Default:
        expect($li.attr("class")).equals("pf-c-progress-stepper__step");
        cy.ouiaId("span.pf-c-progress-stepper__step-icon").should("not.exist");
        break;
      default: {
        throw new Error("Unexpected SE status in the popover");
        break;
      }
    }
    cy.get("div#" + step.ouiaId)
      .should("be.visible")
      .should("have.text", step.innerText);
  });
}

/**
 * Assert progress of all steps in the SE status popover.
 * @param creating the result of the step (Info, Default, Success)
 * @param preparing the result of the step (Info, Default, Success)
 * @param provisioning the result of the step (Info, Default, Success)
 */
export function progressStepsStatuses(
  instanceStatus: SEInstanceStatusEnumInterface
) {
  cy.ouiaId("steps", "QE/StackItem").within(() => {
    cy.ouiaType("QE/ProgressStep").should("have.length", 3);
    progressStepStatus(instanceStatus.creatingStep, SEStep.CREATION_PENDIMG);
    progressStepStatus(instanceStatus.preparingStep, SEStep.PREPARING);
    progressStepStatus(instanceStatus.provisioningStep, SEStep.PROVISIONING);
  });
}
