import { onlyOn } from "@cypress/skip-test";
import {
  progressStepsStatuses,
  SEInstanceStatus,
} from "cypress/utils/SEPopoverStatus";
import {
  createInstance,
  deleteInstance,
  safeLogin,
  uniqueName,
  isEnvironmentType,
  EnvType,
  pageWasLoaded,
} from "../../utils/Util";

const newInstanceName: string = uniqueName("new-instance");

describe("the 'Create a SE instance' Modal", () => {
  beforeEach(() => {
    cy.visit("/");
    safeLogin();
    pageWasLoaded();
  });

  it("Submit", () => {
    createInstance(newInstanceName);

    //Assert that the process of the instnace's creation was started
    cy.ouiaId("Instances list table", "PF4/Table")
      .ouiaId(newInstanceName, "PF4/TableRow")
      .should("be.visible")
      .within(() => {
        //The user cannot go to the instance's details if it is not ready
        //Assert that the inner text contains only the name of the instance and no <a>
        cy.get("td:first").should("have.html", newInstanceName);
        //The status column is loading and contains ready
        cy.get("td:nth-child(3)")
          .ouiaId("accepted", "QE/ResourceStatus")
          .within(() => {
            cy.get("span[role='progressbar']").should("exist");
            cy.ouiaId("creating", "PF4/Button").should("have.text", "Creating");
            cy.ouiaId("ready-shortly", "QE/HelperTextItem").should(
              "have.text",
              "This will be ready shortly."
            );
          });
        cy.ouiaId("creating", "PF4/Button").click();
      });

    //Assert that the process of the instnace's creation is monitored
    cy.ouiaId("se-status", "QE/Popover")
      .should("be.visible")
      .within(() => {
        cy.ouiaType("QE/StackItem").should("have.length", "3");
        cy.ouiaId("info-banner", "QE/StackItem")
          .ouiaId("ready-shortly", "PF4/Text")
          .should("be.visible");
        cy.ouiaId("steps-count", "QE/StackItem").should(
          "have.text",
          "0 of 3 steps completed"
        );
        progressStepsStatuses(SEInstanceStatus.ACCEPTED);
        cy.ouiaId("steps-count", "QE/StackItem", { timeout: 120000 }).should(
          "have.text",
          "1 of 3 steps completed"
        );
        progressStepsStatuses(SEInstanceStatus.PREPARING);
        cy.ouiaId("steps-count", "QE/StackItem", { timeout: 120000 }).should(
          "have.text",
          "2 of 3 steps completed"
        );
        progressStepsStatuses(SEInstanceStatus.PROVISIONING);
      });
    cy.ouiaId("se-status", "QE/Popover", { timeout: 60000 }).should(
      "not.exist"
    );

    //Assertation that the instance was created
    cy.ouiaId("Instances list table", "PF4/Table")
      .ouiaId(newInstanceName, "PF4/TableRow")
      .within(() => {
        cy.get("td:first a[data-testid='tableInstances-linkInstance']").should(
          "be.visible"
        );
        cy.ouiaId("ready", "QE/ResourceStatus")
          .should("be.visible")
          .should("have.text", "Ready");
      });
  });

  it("Submit and expect error", () => {
    const errorInstanceName: string = "error-test";
    cy.ouiaId("create-smart-event-instance", "PF4/Button").click();
    cy.ouiaId("create-instance", "PF4/ModalContent").then(($modal) => {
      cy.wrap($modal)
        .should("be.visible")
        .within(() => {
          cy.ouiaId("new-name", "PF4/TextInput").type(errorInstanceName);
          cy.ouiaId("submit", "PF4/Button").click();
          cy.ouiaId("error-instance-create-fail", "PF4/Alert").should(
            "have.text",
            "Danger alert:Address form errors to proceed."
          );
        });
    });
  });

  it("Cancel", () => {
    const canceledInstanceName: string = uniqueName("canceled-instance");
    createInstance(canceledInstanceName, "cancel");

    cy.ouiaId("Instances list table", "PF4/Table")
      .ouiaId(canceledInstanceName, "PF4/TableRow")
      .should("not.exist");
  });

  onlyOn(isEnvironmentType(EnvType.Dev), () => {
    /*
     * The best practices does not recommand the "after" metod for UI.
     * Cypress guaranted the order of the test execution.
     */
    it("Clean the new instance", () => {
      deleteInstance(newInstanceName);
      cy.ouiaId("Instances list table", "PF4/Table").within(() => {
        // once delete confirmed, state should change
        cy.ouiaId(newInstanceName, "PF4/TableRow")
          .find("td")
          .eq(2)
          .should("have.text", "Deleting");

        // once deprovision is completed, entry should disappear
        cy.ouiaId(newInstanceName, "PF4/TableRow", { timeout: 120000 }).should(
          "not.exist"
        );
      });
    });
  });
});
