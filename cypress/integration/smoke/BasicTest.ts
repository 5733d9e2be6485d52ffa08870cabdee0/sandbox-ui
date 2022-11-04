import { onlyOn } from "@cypress/skip-test";
import {
  EnvType,
  isEnvironmentType,
  safeLogin,
  pageWasLoaded,
} from "../../utils/Util";

describe("Basic Elements", () => {
  beforeEach(() => {
    cy.visit("/");
    safeLogin();
    pageWasLoaded();
  });

  it("The Create SE Instance button is visible", () => {
    cy.ouiaId("create-smart-event-instance", "PF4/Button").should("be.visible");
  });

  /**
   * The sidebar and the header are not part of the SE UI we export.
   * So only the page content is relevant to report bugs.
   * This test is relevant only for developing/demoing purposes.
   */
  it("The navigation panel is visible", () => {
    cy.wait(4000); //prevent random failure
    cy.ouiaId("smart-events", "PF4/NavItem").then(($item) => {
      //toggle menu side bar - both directions
      if ($item.is(":visible")) {
        cy.get("button#nav-toggle").click();
        cy.ouiaId("smart-events", "PF4/NavItem").should("not.be.visible");
        cy.get("button#nav-toggle").click();
        cy.ouiaId("smart-events", "PF4/NavItem").should("be.visible");
      } else {
        cy.get("button#nav-toggle").click();
        cy.ouiaId("smart-events", "PF4/NavItem").should("be.visible");
        cy.get("button#nav-toggle").click();
        cy.ouiaId("smart-events", "PF4/NavItem").should("not.be.visible");
      }
    });
  });

  onlyOn(isEnvironmentType(EnvType.Mocked), () => {
    it("Mocked instances are visible", () => {
      //TODO: MGDOBR-710
      cy.wait(10000);
      cy.ouiaType("PF4/TableRow").should("have.length", 11);
      cy.contains("Instance two").should("be.visible").click();
      cy.ouiaId("instance-name", "PF4/Text").should(
        "have.text",
        "Instance two"
      );
    });
  });

  it("Instance header details are available", () => {
    const instanceHeaderDetails = ["Name", "Time created", "Status"];
    cy.ouiaType("PF4/Table")
      .find("th")
      .should("have.length", instanceHeaderDetails.length)
      .each((item, index) => {
        cy.wrap(item).should("have.text", instanceHeaderDetails[index]);
      });
  });
});
