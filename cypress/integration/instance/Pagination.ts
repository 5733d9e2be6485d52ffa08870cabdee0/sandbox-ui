import { onlyOn } from "@cypress/skip-test";
import {
  createInstance,
  deletedInstanceNotExist,
  deleteInstance,
  EnvType,
  isEnvironmentType,
  pageWasLoaded,
  visitWithCookies,
  waitTillInstanceIsReady,
} from "cypress/utils/Util";

onlyOn(isEnvironmentType(EnvType.Mocked), () => {
  describe("Instance List pagination test", () => {
    beforeEach(() => {
      visitWithCookies("/");
      pageWasLoaded();
    });
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
      cy.get("[aria-label='Go to first page']").should("be.disabled");
      cy.get("[aria-label='Go to previous page']").should("be.disabled");
      cy.get("[aria-label='Go to last page']").should("not.be.disabled");
      cy.get("[aria-label='Go to next page']").should("not.be.disabled");
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
              let totalInstanceCount = parseInt(count.text());
              cy.wrap(perPageSize).should("be.lte", totalInstanceCount);
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
          const instanceTen = "Instance ten";
          let initialInstanceCount = parseInt(count.text());
          deleteInstance(instanceTen);
          deletedInstanceNotExist(instanceTen);
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
  });
});
