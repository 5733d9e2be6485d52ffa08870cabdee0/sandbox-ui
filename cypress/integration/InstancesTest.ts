import { format } from "date-fns";
<<<<<<< HEAD
=======
import { createInstance } from "./Util";
import { deleteInstance } from "./Util";
<<<<<<< HEAD
import { newInstanceStatus } from "./Util";
import { deleteInstanceStatus } from "./Util";
>>>>>>> 8475636 (Fix review comments)
=======
import { waitTillInstanceIsReady } from "./Util";
import { deletedInstanceNotExist } from "./Util";
>>>>>>> 57e9287 (MGDOBR-717 - renaming function name in Util.ts)

const formatDate = (dateStr: string): string =>
  format(new Date(dateStr), "PPPP p");

<<<<<<< HEAD
function createnewInstance() {
  const newInstanceName: string = "Some new instance";
  cy.ouiaId("create-smart-event-instance", "PF4/Button").click();
  cy.ouiaId("create-instance", "PF4/ModalContent").then(($modal) => {
    cy.wrap($modal)
      .should("be.visible")
      .within(() => {
        cy.ouiaId("new-name", "PF4/TextInput").type(newInstanceName);
        cy.ouiaId("info-instance-available-soon", "PF4/Alert").should(
          "have.text",
          "Info alert:Your Smart Events instance will be ready for use shortly after creation."
        );
        cy.ouiaId("submit", "PF4/Button").click();
      });
    cy.wrap($modal, { timeout: 20000 }).should("not.exist");
  });

  cy.ouiaId("Instances list table", "PF4/Table")
    .ouiaId(newInstanceName, "PF4/TableRow")
    .should("be.visible")
    .within(() => {
      cy.get("td:first").should("have.text", newInstanceName);
      cy.get("td:nth-child(2)").then(($state) => {
        cy.wrap($state).should("have.text", "accepted");
        cy.wrap($state, { timeout: 30000 }).should("have.text", "ready");
      });
    });
}

=======
>>>>>>> 8475636 (Fix review comments)
describe("Instances Test", () => {
  describe("the 'Create a SE instance' Modal", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.ouiaId("loading-table", "PF4/Card", { timeout: 30000 }).should(
        "not.exist"
      );
    });

    it("Submit", () => {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      const newInstanceName: string = "Some new instance";
      cy.ouiaId("create-smart-event-instance", "PF4/Button").click();
      cy.ouiaId("create-instance", "PF4/ModalContent").then(($modal) => {
        cy.wrap($modal)
          .should("be.visible")
          .within(() => {
            cy.ouiaId("new-name", "PF4/TextInput").type(newInstanceName);
            cy.ouiaId("info-instance-available-soon", "PF4/Alert").should(
              "have.text",
              "Info alert:Your Smart Events instance will be ready for use shortly after creation."
            );
            cy.ouiaId("submit", "PF4/Button").click();
          });
        cy.wrap($modal, { timeout: 20000 }).should("not.exist");
      });

      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(newInstanceName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td:first").should("have.text", newInstanceName);
          cy.get("td:nth-child(3)").then(($state) => {
=======
      createInstance("Some new instance");
=======
      const newInstanceName: string = "Some new instance";
      createInstance(newInstanceName);
>>>>>>> 57e9287 (MGDOBR-717 - renaming function name in Util.ts)
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(newInstanceName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td:first").should("have.text", newInstanceName);
          cy.get("td:nth-child(2)").then(($state) => {
>>>>>>> 8475636 (Fix review comments)
            cy.wrap($state).should("have.text", "accepted");
            cy.wrap($state, { timeout: 30000 }).should("have.text", "ready");
          });
        });
<<<<<<< HEAD
=======
      createnewInstance();
>>>>>>> 429d980 (Replacing existing test logic with a function)
=======
>>>>>>> 8475636 (Fix review comments)
    });

    it("Submit and expect error", () => {
      const newInstanceName: string = "error-test";
      cy.ouiaId("create-smart-event-instance", "PF4/Button").click();
      cy.ouiaId("create-instance", "PF4/ModalContent").then(($modal) => {
        cy.wrap($modal)
          .should("be.visible")
          .within(() => {
            cy.ouiaId("new-name", "PF4/TextInput").type(newInstanceName);
            cy.ouiaId("submit", "PF4/Button").click();
            cy.ouiaId("error-instance-create-fail", "PF4/Alert").should(
              "have.text",
              "Danger alert:Address form errors to proceed."
            );
          });
      });
    });

    it("Cancel", () => {
      const newInstanceName: string = "Canceled instance";
      cy.ouiaId("create-smart-event-instance", "PF4/Button").click();
      cy.ouiaId("create-instance", "PF4/ModalContent").then(($modal) => {
        cy.wrap($modal)
          .should("be.visible")
          .within(() => {
            cy.ouiaId("new-name", "PF4/TextInput").type(newInstanceName);
            cy.ouiaId("info-instance-available-soon", "PF4/Alert").should(
              "have.text",
              "Info alert:Your Smart Events instance will be ready for use shortly after creation."
            );
            cy.ouiaId("cancel", "PF4/Button").click();
          });
        cy.wrap($modal, { timeout: 7000 }).should("not.exist");
      });

      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(newInstanceName, "PF4/TableRow")
        .should("not.exist");
    });
  });

<<<<<<< HEAD
  describe("the Instance statuses", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.ouiaId("loading-table", "PF4/Card", { timeout: 30000 }).should(
        "not.exist"
      );
=======
    describe("Instance List pagination test", () => {
      it("Select other page", () => {
        cy.get("[aria-label='Go to first page']").should("be.disabled");
        cy.get("[aria-label='Go to previous page']").should("be.disabled");
        cy.get("[aria-label='Go to last page']").should("not.be.disabled");
        cy.get("[aria-label='Go to next page']").should("not.be.disabled");

        // Go to next page
        cy.get("[aria-label='Go to next page']").first().click();
        cy.get("[aria-label='Go to first page']").should("not.be.disabled");
        cy.get("[aria-label='Go to previous page']").should("not.be.disabled");

        // as currently count of instances are covered in 2 pages
        cy.get("[aria-label='Go to last page']").should("be.disabled");
        cy.get("[aria-label='Go to next page']").should("be.disabled");

        // Go to previous page
        cy.get("[aria-label='Go to previous page']").first().click();
      });

      it("Change page size", () => {
        cy.ouiaType("PF4/DropdownToggle").should("be.visible");
        cy.ouiaId(
          "OUIA-Generated-DropdownToggle-1",
          "PF4/DropdownToggle"
        ).click();
        cy.get(".pf-c-options-menu__menu")
          .find("li")
          .then(($cells) => {
            expect($cells).have.length(4);
            expect($cells.eq(0)).have.text("10 per page");
            expect($cells.eq(1)).have.text("20 per page");
            expect($cells.eq(2)).have.text("50 per page");
            expect($cells.eq(3)).have.text("100 per page");
          });

        // page size is changed
        cy.contains("20 per page").click();
        cy.get(".pf-c-pagination__total-items >b:nth-of-type(1)").then(
          (count) => {
            let size = count.text();
            let perPageSize = parseInt(size.slice(-2));
            cy.get(".pf-c-pagination__total-items >b:nth-of-type(2)").then(
              (count) => {
                let pageSize = parseInt(count.text());
                cy.wrap(perPageSize).should("be.lte", pageSize);
              }
            );
          }
        );
      });

      it("Page size after creating a new Instance ", () => {
        cy.get(".pf-c-pagination__total-items >b:nth-of-type(2)").then(
          (count) => {
            let initialInstanceCount = parseInt(count.text());
            createInstance("newInstance");
            waitTillInstanceIsReady("newInstance");
            cy.get(".pf-c-pagination__total-items >b:nth-of-type(2)").then(
              (count) => {
                let instanceCountAfterCreate = parseInt(count.text());
                expect(instanceCountAfterCreate).to.be.equal(
                  initialInstanceCount + 1
                );
              }
            );
          }
        );
      });

      it("Page size after deleting an Instance ", () => {
        cy.get(".pf-c-pagination__total-items >b:nth-of-type(2)").then(
          (count) => {
            let initialInstanceCount = parseInt(count.text());
            deleteInstance("Instance ten");
            deletedInstanceNotExist("Instance ten");
            cy.get(".pf-c-pagination__total-items >b:nth-of-type(2)").then(
              (count) => {
                let instanceCountAfterDelete = parseInt(count.text());
                expect(instanceCountAfterDelete).to.be.equal(
                  initialInstanceCount - 1
                );
              }
            );
          }
        );
      });
>>>>>>> 8475636 (Fix review comments)
    });
  });

<<<<<<< HEAD
=======
  describe("the Instance statuses", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.ouiaId("loading-table", "PF4/Card", { timeout: 30000 }).should(
        "not.exist"
      );
    });

>>>>>>> 8475636 (Fix review comments)
    it("Accepted", () => {
      const instanceName: string = "Instance three";
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(instanceName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td:first").should("have.html", instanceName);
<<<<<<< HEAD
          cy.get("td:nth-child(3)").should("have.text", "accepted");
=======
          cy.get("td:nth-child(2)").should("have.text", "accepted");
>>>>>>> 8475636 (Fix review comments)
          cy.get("td:nth-child(4)")
            .click()
            .within(() => {
              cy.ouiaType("PF4/DropdownItem").then(($items) => {
                expect($items.eq(0)).have.text("Details");
                expect($items.eq(0)).be.enabled;
<<<<<<< HEAD
                expect($items.eq(1)).have.text("Delete instance");
=======
                expect($items.eq(1)).have.text("Delete");
>>>>>>> 8475636 (Fix review comments)
                expect($items.eq(1)).have.attr("aria-disabled", "true");
              });
            });
        });
    });

    it("Provisioning", () => {
      const instanceName: string = "Instance four";
      cy.ouiaId("Instances list table", "PF4/Table")
        .ouiaId(instanceName, "PF4/TableRow")
        .should("be.visible")
        .within(() => {
          cy.get("td:first").should("have.html", instanceName);
<<<<<<< HEAD
          cy.get("td:nth-child(3)").should("have.text", "provisioning");
=======
          cy.get("td:nth-child(2)").should("have.text", "provisioning");
>>>>>>> 8475636 (Fix review comments)
          cy.get("td:nth-child(4)")
            .click()
            .within(() => {
              cy.ouiaType("PF4/DropdownItem").then(($items) => {
                expect($items.eq(0)).have.text("Details");
                expect($items.eq(0)).be.enabled;
<<<<<<< HEAD
                expect($items.eq(1)).have.text("Delete instance");
=======
                expect($items.eq(1)).have.text("Delete");
>>>>>>> 8475636 (Fix review comments)
                expect($items.eq(1)).have.attr("aria-disabled", "true");
              });
            });
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
<<<<<<< HEAD
          cy.get("td:nth-child(3)").should("have.text", "ready");
=======
          cy.get("td:nth-child(2)").should("have.text", "ready");
>>>>>>> 8475636 (Fix review comments)
          cy.get("td:nth-child(4)")
            .click()
            .within(() => {
              cy.ouiaType("PF4/DropdownItem").then(($items) => {
                expect($items.eq(0)).have.text("Details");
                expect($items.eq(0)).be.enabled;
<<<<<<< HEAD
                expect($items.eq(1)).have.text("Delete instance");
=======
                expect($items.eq(1)).have.text("Delete");
>>>>>>> 8475636 (Fix review comments)
                expect($items.eq(0)).be.enabled;
              });
            });
        });
    });
  });

  describe("Instance Page - Instance one", () => {
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

      cy.ouiaId("instance-details-panel")
        .within(() => {
          cy.ouiaId("instance-details-name", "PF4/Text")
            .should("have.text", "Instance one")
            .should("be.visible");
          cy.ouiaId("instance-details-id")
            .should("have.text", "3543edaa-1851-4ad7-96be-ebde7d20d717")
            .should("be.visible");
          cy.ouiaId("instance-details-endpoint")
<<<<<<< HEAD
            .find("span")
            .should(
              "have.text",
              "https://3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events"
            )
            .should("be.visible");
          cy.ouiaId("instance-details-owner")
            .should("have.text", "bebianco@redhat.com")
            .should("be.visible");
=======
            .find("input")
            .should(
              "have.value",
              "https://3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events"
            )
            .should("be.visible");
>>>>>>> 8475636 (Fix review comments)
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

    it("Processors Content", () => {
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
<<<<<<< HEAD
            expect($cells).have.length(5);
            expect($cells.eq(0)).have.text("Processor three");
            expect($cells.eq(1)).have.text("Source");
            expect($cells.eq(3)).have.text("accepted");
            cy.wrap($cells.eq(4)).ouiaType("PF4/Dropdown").should("be.visible");
=======
            expect($cells).have.length(6);
            expect($cells.eq(0)).have.text("Processor three");
            expect($cells.eq(1)).have.text(
              "f8f34af4-caed-11ec-9d64-0242ac120002"
            );
            expect($cells.eq(2)).have.text("Source");
            expect($cells.eq(3)).have.text("accepted");
            cy.wrap($cells.eq(5)).ouiaType("PF4/Dropdown").should("be.visible");
>>>>>>> 8475636 (Fix review comments)
          });
      });
    });

    it("Processor header details are visible", () => {
<<<<<<< HEAD
      const processorHeaderDetails = ["Name", "Type", "Time created", "Status"];
=======
      const processorHeaderDetails = [
        "Name",
        "ID",
        "Type",
        "Status",
        "Time created",
      ];
>>>>>>> 8475636 (Fix review comments)
      cy.ouiaId("Processors list table", "PF4/Table")
        .ouiaId("table-head", "PF4/TableRow")
        .find("th")
        .should("have.length", processorHeaderDetails.length)
        .each((item, index) => {
          cy.wrap(item).should("have.text", processorHeaderDetails[index]);
        });
    });
  });
});
