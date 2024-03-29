import { onlyOn } from "@cypress/skip-test";
import { LoginConfig } from "cypress/utils/Config";
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
  visitWithCookies,
} from "../../utils/Util";

const newInstanceName: string = uniqueName("new-instance");

describe("the 'Create a SE instance' Modal", () => {
  let loginConfig: LoginConfig;

  before(() => {
    loginConfig = new LoginConfig();
  });

  beforeEach(() => {
    visitWithCookies("/");
    safeLogin(loginConfig);
    pageWasLoaded();
  });

  it("Submit", () => {
    createInstance(newInstanceName);

    //Assert that the process of the instance's creation was started
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
        cy.wait(150);
        cy.ouiaId("creating", "PF4/Button").click();
      });

    //Assert that the process of the instance's creation is monitored
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
      });
    //Assertion of the other steps is not reliable enough. The UI updates the page every 10 seconds and it hides some states.
    cy.ouiaId("se-status", "QE/Popover", { timeout: 60000 }).should(
      "not.exist"
    );

    //Assertion that the instance was created
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

  // instance with name "error-test" already exists
  it("Submit and expect error", () => {
    const errorInstanceName: string = "error-test";
    cy.contains("button", "Create Smart Events instance").click();
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

  onlyOn(isEnvironmentType(EnvType.Mocked), () => {
    // instance with name containing "error-test" causes 4xx response code
    it("Submit and expect error while creating", () => {
      const errorInstanceName: string = "error-test-2";
      cy.contains("button", "Create Smart Events instance").click();
      cy.ouiaId("create-instance", "PF4/ModalContent").then(($modal) => {
        cy.wrap($modal)
          .should("be.visible")
          .within(() => {
            cy.ouiaId("new-name", "PF4/TextInput").type(errorInstanceName);
            cy.ouiaId("submit", "PF4/Button").click();
            cy.ouiaId("error-instance-create-fail", "PF4/Alert").should(
              "have.text",
              "Danger alert:Error while creating a Smart Event instance. Please, try again later."
            );
          });
      });
    });

    it("Submit and expect quota error", () => {
      const errorInstanceName: string = "quota-error";
      cy.contains("button", "Create Smart Events instance").click();
      cy.ouiaId("create-instance", "PF4/ModalContent").then(($modal) => {
        cy.wrap($modal)
          .should("be.visible")
          .within(() => {
            cy.ouiaId("new-name", "PF4/TextInput").type(errorInstanceName);
            cy.ouiaId("submit", "PF4/Button").click();
            cy.ouiaId("error-instance-create-fail", "PF4/Alert").should(
              "contain.text",
              "Warning alert:Your organization is out of quota."
            );
          });
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
     * The best practices does not recommend the "after" method for UI.
     * Cypress guaranteed the order of the test execution.
     */
    it("Clean the new instance", () => {
      deleteInstance(newInstanceName);
      cy.ouiaId("Instances list table", "PF4/Table").within(() => {
        // once delete confirmed, state should change
        cy.ouiaId(newInstanceName, "PF4/TableRow")
          .find("[data-label='Status']")
          .should("have.text", "Deleting");

        // once de-provision is completed, entry should disappear
        cy.ouiaId(newInstanceName, "PF4/TableRow", { timeout: 120000 }).should(
          "not.exist"
        );
      });
    });
  });
});
