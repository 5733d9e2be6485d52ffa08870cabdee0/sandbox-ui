describe("Basic Elements", () => {
  const bridgeName = uniqueName("myBridge");
  let bridgeId;

  before(() => {
    const token = Cypress.env("OB_TOKEN");
    const authorization = `Bearer ${token}`;
    const options = {
      method: "POST",
      url: "https://event-bridge-event-bridge-prod.apps.openbridge-dev.fdvn.p1.openshiftapps.com/api/v1/bridges",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: authorization,
      },
      body: {
        name: bridgeName,
      },
    };
    cy.request(options).then((response) => {
      // response.body is automatically serialized into JSON
      expect(response.body).to.not.be.null;
      expect(response.body.id).to.not.be.null;
      bridgeId = response.body.id;
    });
  });

  beforeEach(() => {
    cy.visit("/");
    const user: string = Cypress.env("USER");
    const psw: string = Cypress.env("PASSWORD");
    cy.get("#username-verification").type(user);
    cy.get("#login-show-step2").click();
    cy.get("#password").should("be.visible").type(psw);
    cy.get("#rh-password-verification-submit-button").click();
  });

  it("The Create SE Instance button is visible", () => {
    cy.ouiaId("create-smart-event-instance", "PF4/Button").should("be.visible");
  });

  it("Data are visible", () => {
    cy.ouiaId(bridgeName).should("be.visible");
  });

  it("Instance header details are available", () => {
    const instanceHeaderDetails = ["Name", "Status", "Time created"];
    cy.ouiaId("Instances list table", "PF4/Table")
      .ouiaType("PF4/TableRow")
      .find("th")
      .should("have.length", instanceHeaderDetails.length)
      .each((item, index) => {
        cy.wrap(item).should("have.text", instanceHeaderDetails[index]);
      });
  });
});

function uniqueName(name: string) {
  return `testui-${name}-${Cypress._.uniqueId(Date.now().toString())}`;
}
