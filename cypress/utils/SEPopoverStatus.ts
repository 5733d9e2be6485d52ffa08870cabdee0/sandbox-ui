/**
 * This enum represents variants of the attribute in PF ProgressStep.
 */
export enum SEStepStatus {
  Success = "pf-m-success",
  Info = "pf-m-info",
  Default = "",
  //Failed = "", //TODO: ask if it could exists
}

/**
 * Assert progress step status in the SE status popover.
 * @param status
 * @param elementId - the element id which represent the step status
 * @param elementText - the content of the step status inside of the element
 */
export function progressStepStatus(
  status: SEStepStatus,
  elementId: string,
  elementText: string
) {
  cy.ouiaId(elementId, "QE/ProgressStep").then(($li) => {
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
    cy.get("div#" + elementId)
      .should("be.visible")
      .should("have.text", elementText);
  });
}
