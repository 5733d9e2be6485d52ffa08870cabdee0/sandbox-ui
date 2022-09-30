import { onlyOn } from "@cypress/skip-test";
import {
  progressStepsStatuses,
  SEInstanceStatus,
} from "cypress/utils/SEPopoverStatus";
import {
  EnvType,
  isEnvironmentType,
  pageWasLoaded,
  safeLogin,
} from "cypress/utils/Util";

onlyOn(isEnvironmentType(EnvType.Mocked), () => {
  describe("Instance statuses", () => {
    beforeEach(() => {
      cy.visit("/");
      safeLogin();
      pageWasLoaded();
    });

    it("Accepted", () => {
      const instanceName: string = "Instance three";
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(instanceName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          //the name does not contain a link at the detail page
          cy.get("td:first").should("have.html", instanceName);
          //the status
          cy.get("td:nth-child(3)")
            .ouiaId("accepted", "QE/ResourceStatus")
            .within(() => {
              cy.get("span[role='progressbar']").should("exist");
              cy.ouiaId("creating", "PF4/Button").should(
                "have.text",
                "Creating"
              );
              cy.ouiaId("longer-than-expected", "PF4/Alert").should(
                "have.text",
                "Danger alert:This is taking longer than expected."
              );
            });
          cy.get("td:nth-child(4)")
            .click()
            .within(() => {
              cy.ouiaType("PF4/DropdownItem").then(($items) => {
                expect($items.eq(0)).have.text("Details");
                expect($items.eq(0)).be.enabled;
                expect($items.eq(1)).have.text("Delete instance");
                expect($items.eq(1)).have.attr("aria-disabled", "true");
              });
            });
          cy.ouiaId("creating", "PF4/Button").click();
        });
      cy.ouiaId("se-status", "QE/Popover")
        .should("be.visible")
        .within(() => {
          cy.ouiaType("QE/StackItem").should("have.length", "3");
          cy.ouiaId("info-banner", "QE/StackItem")
            .ouiaId("longer-than-expected", "PF4/Alert")
            .should("be.visible");
          cy.ouiaId("steps-count", "QE/StackItem").should(
            "have.text",
            "0 of 3 steps completed"
          );
          progressStepsStatuses(SEInstanceStatus.ACCEPTED);
        });
    });

    it("Preparing", () => {
      const instanceName: string = "Instance eight";
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(instanceName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          //the name does not contain a link at the detail page
          cy.get("td:first").should("have.html", instanceName);
          //the status
          cy.get("td:nth-child(3)")
            .ouiaId("preparing", "QE/ResourceStatus")
            .within(() => {
              cy.get("span[role='progressbar']").should("exist");
              cy.ouiaId("creating", "PF4/Button").should(
                "have.text",
                "Creating"
              );
              cy.ouiaId("longer-than-expected", "PF4/Alert").should(
                "have.text",
                "Danger alert:This is taking longer than expected."
              );
            });
          cy.get("td:nth-child(4)")
            .click()
            .within(() => {
              cy.ouiaType("PF4/DropdownItem").then(($items) => {
                expect($items.eq(0)).have.text("Details");
                expect($items.eq(0)).be.enabled;
                expect($items.eq(1)).have.text("Delete instance");
                expect($items.eq(1)).have.attr("aria-disabled", "true");
              });
            });
          cy.ouiaId("creating", "PF4/Button").click();
        });
      cy.ouiaId("se-status", "QE/Popover")
        .should("be.visible")
        .within(() => {
          cy.ouiaType("QE/StackItem").should("have.length", "3");
          cy.ouiaId("info-banner", "QE/StackItem")
            .ouiaId("longer-than-expected", "PF4/Alert")
            .should("be.visible");
          cy.ouiaId("steps-count", "QE/StackItem").should(
            "have.text",
            "1 of 3 steps completed"
          );
          progressStepsStatuses(SEInstanceStatus.PREPARING);
        });
    });

    it("Provisioning", () => {
      const instanceName: string = "Instance four";
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(instanceName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          //the name does not contain a link at the detail page
          cy.get("td:first").should("have.html", instanceName);
          //the status
          cy.get("td:nth-child(3)")
            .ouiaId("provisioning", "QE/ResourceStatus")
            .within(() => {
              cy.get("span[role='progressbar']").should("exist");
              cy.ouiaId("creating", "PF4/Button").should(
                "have.text",
                "Creating"
              );
              cy.ouiaId("longer-than-expected", "PF4/Alert").should(
                "have.text",
                "Danger alert:This is taking longer than expected."
              );
            });
          cy.get("td:nth-child(4)")
            .click()
            .within(() => {
              cy.ouiaType("PF4/DropdownItem").then(($items) => {
                expect($items.eq(0)).have.text("Details");
                expect($items.eq(0)).be.enabled;
                expect($items.eq(1)).have.text("Delete instance");
                expect($items.eq(1)).have.attr("aria-disabled", "true");
              });
            });
          cy.ouiaId("creating", "PF4/Button").click();
        });
      cy.ouiaId("se-status", "QE/Popover")
        .should("be.visible")
        .within(() => {
          cy.ouiaType("QE/StackItem").should("have.length", "3");
          cy.ouiaId("info-banner", "QE/StackItem")
            .ouiaId("longer-than-expected", "PF4/Alert")
            .should("be.visible");
          cy.ouiaId("steps-count", "QE/StackItem").should(
            "have.text",
            "2 of 3 steps completed"
          );
          progressStepsStatuses(SEInstanceStatus.PROVISIONING);
        });
    });

    it("Ready", () => {
      const instanceName: string = "Instance two";
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(instanceName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td:first")
            .should("have.text", instanceName)
            .should("not.have.html", instanceName)
            .find("a")
            .should("be.visible");
          cy.get("td:nth-child(3)").should("have.text", "Ready");
          cy.get("td:nth-child(4)")
            .click()
            .within(() => {
              cy.ouiaType("PF4/DropdownItem").then(($items) => {
                expect($items.eq(0)).have.text("Details");
                expect($items.eq(0)).be.enabled;
                expect($items.eq(1)).have.text("Delete instance");
                expect($items.eq(0)).be.enabled;
              });
            });
        });
    });
  });
});
