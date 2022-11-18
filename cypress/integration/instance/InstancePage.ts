import {
  progressStepsStatuses,
  SEInstanceStatus,
} from "../../utils/SEPopoverStatus";
import { format } from "date-fns";
import { onlyOn } from "@cypress/skip-test";
import {
  EnvType,
  isEnvironmentType,
  pageWasLoaded,
  safeLogin,
  visitWithCookies,
} from "cypress/utils/Util";
const formatDate = (dateStr: string): string =>
  format(new Date(dateStr), "PPPP p");

onlyOn(isEnvironmentType(EnvType.Mocked), () => {
  describe("Instance Page - Instance one", () => {
    beforeEach(() => {
      visitWithCookies("/instance/3543edaa-1851-4ad7-96be-ebde7d20d717");
      safeLogin();
      pageWasLoaded();
    });

    it("Header", () => {
      cy.ouiaId("instance-name", "PF4/Text").should(
        "have.text",
        "Instance one"
      );
      cy.ouiaId("actions", "PF4/Dropdown")
        .should("be.visible")
        .within(() => {
          cy.ouiaId("actions", "PF4/DropdownToggle").click();
          cy.ouiaId("details", "PF4/DropdownItem").should("be.visible");
          cy.ouiaId("delete", "PF4/DropdownItem").should("be.visible");
        });
    });

    it("Details", () => {
      cy.ouiaId("actions", "PF4/Dropdown")
        .should("be.visible")
        .within(() => {
          cy.ouiaId("actions", "PF4/DropdownToggle").click();
          cy.ouiaId("details", "PF4/DropdownItem").click();
        });

      cy.ouiaId("instance-details-panel")
        .within(() => {
          cy.ouiaId("instance-details-name", "PF4/Text")
            .should("have.text", "Instance one")
            .should("be.visible");
          cy.ouiaId("instance-details-id")
            .should("have.text", "3543edaa-1851-4ad7-96be-ebde7d20d717")
            .should("be.visible");
          cy.ouiaId("instance-details-endpoint")
            .find("span")
            .should(
              "have.text",
              "https://3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events"
            )
            .should("be.visible");
          cy.ouiaId("instance-details-owner")
            .should("have.text", "bebianco")
            .should("be.visible");
          cy.ouiaId("instance-details-submitted-date")
            .should("have.text", formatDate("2022-02-24T13:34:00Z"))
            .should("be.visible");
          cy.ouiaId("instance-details-published-date")
            .should("have.text", formatDate("2022-02-24T13:35:00Z"))
            .should("be.visible");
          cy.ouiaId("close-instance-details").click();
        })
        //constructions like "not.exist" or "not.be.visible" fail in this case
        .should("have.attr", "hidden");
    });

    it("View error handler details", () => {
      cy.ouiaId("error-handling", "PF4/TabButton").click();

      cy.ouiaId("error-handling-section", "PF4/Text")
        .should("have.text", "Error handling method")
        .should("be.visible");

      cy.ouiaType("ProcessorConfig/FormGroup").should("have.length", 5);

      cy.ouiaId("error_handling_method", "ProcessorConfig/FormGroup").within(
        () => {
          cy.get("[data-testid='error_handling_method']").should(
            "have.text",
            "Error handling method"
          );
          cy.get("[data-testid='error_handling_method-value']").should(
            "have.text",
            "Webhook"
          );
        }
      );

      cy.ouiaId("endpoint", "ProcessorConfig/FormGroup").within(() => {
        cy.get("[data-testid='endpoint']").should("have.text", "Endpoint");
        cy.get("[data-testid='endpoint-value']").should(
          "have.text",
          "http://google.com"
        );
      });

      cy.ouiaId("basic_auth_username", "ProcessorConfig/FormGroup").within(
        () => {
          cy.get("[data-testid='basic_auth_username']").should(
            "have.text",
            "Basic Auth Username"
          );
          cy.get("[data-testid='basic_auth_username-value']").should(
            "have.text",
            "user"
          );
        }
      );

      cy.ouiaId("basic_auth_password", "ProcessorConfig/FormGroup").within(
        () => {
          cy.get("[data-testid='basic_auth_password']").should(
            "have.text",
            "Basic Auth Password"
          );
          cy.get("[data-testid='basic_auth_password-value']").should(
            "have.text",
            "**************************"
          );
        }
      );

      cy.ouiaId(
        "ssl_verification_disabled",
        "ProcessorConfig/FormGroup"
      ).within(() => {
        cy.get("[data-testid='ssl_verification_disabled']").should(
          "have.text",
          "SSL Verification Disabled"
        );
        cy.get("[data-testid='ssl_verification_disabled-value']").should(
          "have.text",
          "No"
        );
      });
    });

    it("Pending processor", () => {
      cy.ouiaId("instance-details", "PF4/Tabs")
        .ouiaId("processors", "PF4/TabButton")
        .click();
      cy.ouiaId("processors", "PF4/TabContent").within(() => {
        cy.ouiaId("rows-toolbar", "PF4/Toolbar")
          .ouiaId("create-processor", "PF4/Button")
          .should("be.visible");
        cy.ouiaId("Processors list table", "PF4/Table")
          .ouiaId("Processor three", "PF4/TableRow")
          .find("td")
          .then(($cells) => {
            expect($cells).have.length(5);
            expect($cells.eq(0)).have.text("Processor three");
            expect($cells.eq(1)).have.text("Source");
            cy.wrap($cells)
              .eq(3)
              .ouiaId("creating", "PF4/Button")
              .should("have.text", "Creating");
            cy.wrap($cells.eq(4)).ouiaType("PF4/Dropdown").should("be.visible");
          });
        cy.ouiaId("creating", "PF4/Button").click();
      });

      //Assert that the popover describes the pending state
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

    it("Ready processor", () => {
      cy.ouiaId("instance-details", "PF4/Tabs")
        .ouiaId("processors", "PF4/TabButton")
        .click();
      cy.ouiaId("processors", "PF4/TabContent").within(() => {
        cy.ouiaId("rows-toolbar", "PF4/Toolbar")
          .ouiaId("create-processor", "PF4/Button")
          .should("be.visible");
        cy.ouiaId("Processors list table", "PF4/Table")
          .ouiaId("Processor one", "PF4/TableRow")
          .find("td")
          .then(($cells) => {
            expect($cells).have.length(5);
            expect($cells.eq(0)).have.text("Processor one");
            expect($cells.eq(1)).have.text("Sink");
            cy.wrap($cells)
              .eq(3)
              .ouiaId("ready", "QE/ResourceStatus")
              .should("be.visible")
              .should("have.text", "Ready");
            cy.wrap($cells.eq(4)).ouiaType("PF4/Dropdown").should("be.visible");
          });
      });
    });

    it("Processor header details are visible", () => {
      const processorHeaderDetails = ["Name", "Type", "Time created", "Status"];
      cy.ouiaId("Processors list table", "PF4/Table")
        .find("th")
        .should("have.length", processorHeaderDetails.length)
        .each((item, index) => {
          cy.wrap(item).should("have.text", processorHeaderDetails[index]);
        });
    });
  });
});
