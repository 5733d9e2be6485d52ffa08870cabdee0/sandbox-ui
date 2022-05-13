import { format } from "date-fns";

const formatDate = (dateStr: string): string =>
  format(new Date(dateStr), "PPPP p");

describe("Instances Test", () => {
  describe("the 'Create a SE instance' Modal", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it.skip("Submit", () => {
      //This test is skipped because of MGDOBR-725
      const newInstanceName: string = "Some new instance";
      cy.ouiaId("create-smart-event-instance", "PF4/Button").click();
      cy.ouiaId("create-instance", "PF4/ModalContent")
        .should("be.visible")
        .within(() => {
          cy.ouiaId("new-name", "PF4/TextInput").type(newInstanceName);
          cy.ouiaId("info-instance-available-soon", "PF4/Alert").should(
            "have.text",
            "Info alert:Your Smart Events instance will be ready for use shortly after creation."
          );
          cy.ouiaId("submit", "PF4/Button").click();
        })
        .should("not.exist");
      //TODO: MGDOBR-706 - uncomment code for the verification that the instance was created (currently mocked server does not support it)
      /*
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(newInstanceName, "PF4/TableRow")
        .should("be.visible");
      */
    });

    it.skip("Cancel", () => {
      //This test is skipped because of MGDOBR-725
      const newInstanceName: string = "Canceled instance";
      cy.ouiaId("create-smart-event-instance", "PF4/Button").click();
      cy.ouiaId("create-instance", "PF4/ModalContent")
        .within(() => {
          cy.ouiaId("new-name", "PF4/TextInput").type(newInstanceName);
          cy.ouiaId("info-instance-available-soon", "PF4/Alert").should(
            "have.text",
            "Info alert:Your Smart Events instance will be ready for use shortly after creation."
          );
          cy.ouiaId("cancel", "PF4/Button").click();
        })
        .should("not.exist");
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(newInstanceName, "PF4/TableRow")
        .should("not.exist");
    });
  });

  describe("Instance Page - Instance six", () => {
    beforeEach(() => {
      cy.visit("/instance/3543edaa-1851-4ad7-96be-ebde7d20d717");
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
      //The InstanceDetails.tsx contains dummy data which are not related to this instance
      cy.ouiaId("instance-details-panel")
        .within(() => {
          cy.ouiaId("instance-details-name", "PF4/Text")
            .should("have.text", "Instance one")
            .should("be.visible");
          cy.ouiaId("instance-details-id")
            .should("have.text", "3543edaa-1851-4ad7-96be-ebde7d20d717")
            .should("be.visible");
          cy.ouiaId("instance-details-endpoint")
            .find("input")
            .should(
              "have.value",
              "https://3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events"
            )
            .should("be.visible");
          cy.ouiaId("instance-details-submitted-date")
            .should("have.text", formatDate("2022-02-24T13:34:00Z"))
            .should("be.visible");
          cy.ouiaId("instance-details-published-date")
            .should("have.text", formatDate("2022-02-24T13:35:00Z"))
            .should("be.visible");
          cy.ouiaId("close-instance-details").click();
        })
        //constructions like "not.exists" or "not.be.visible" fail in this case
        .should("have.attr", "hidden");
    });

    it("Processors Content", () => {
      cy.ouiaId("instance-details", "PF4/Tabs")
        .ouiaId("processors", "PF4/TabButton")
        .click();
      cy.ouiaId("processors", "PF4/TabContent").within(() => {
        cy.ouiaId("rows-toolbar", "PF4/Toolbar")
          .ouiaId("create-processor", "PF4/Button")
          .should("be.visible");
        cy.ouiaId("Processors list table", "PF4/Table")
          .ouiaId("f8f34af4-caed-11ec-9d64-0242ac120002", "PF4/TableRow")
          .find("td")
          .then(($cells) => {
            expect($cells).have.length(6);
            expect($cells.eq(0)).have.text("Processor three");
            expect($cells.eq(1)).have.text(
              "f8f34af4-caed-11ec-9d64-0242ac120002"
            );
            expect($cells.eq(2)).have.text("Source");
            expect($cells.eq(3)).have.text("accepted");
            cy.wrap($cells.eq(5)).ouiaType("PF4/Dropdown").should("be.visible");
          });
      });
    });
  });
});
