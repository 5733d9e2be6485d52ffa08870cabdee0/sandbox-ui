import { LoginConfig } from "./config/LoginConfig";

export function uniqueName(prefix: string) {
  if (isEnvironmentType(EnvType.Mocked)) {
    return prefix;
  } else if (isEnvironmentType(EnvType.Dev)) {
    return `testui-${prefix}-${Cypress._.uniqueId(Date.now().toString())}`;
  } else {
    throw new Error(
      "The environment type is not recognized. Values of CYPRESS_TEST_TYPE are defined by the 'EnvType' enum."
    );
  }
}

/**
 * Visit the desired page in Cypress.
 * This function covers the necessery cookies settings before the page is loaded.
 * @param path the desired URL. @see Cypress.visit
 */
export function visitWithCookies(path: string) {
  callForEnv(
    () => {
      cy.visit(path);
    },
    () => {
      //The official cypress example (logging__jwt):
      // https://github.com/cypress-io/cypress-example-recipes/blob/194a85456fc04900b182e225c3bfd9979693550f/examples/logging-in__jwt/cypress/integration/spec.js#L24
      cy.visit(path, {
        onBeforeLoad: (win) => {
          // I cannot use: cy.setCookie("notice_gdpr_prefs", "0,1,2:");
          // It causes this CypressError: 'Cypress detected that you returned a promise from a command while also invoking one or more cy commands in that promise.'
          win.document.cookie =
            "notice_gdpr_prefs=0,1,2:;Secure;SameSite=None;Domain=.redhat.com";
          win.document.cookie =
            "notice_preferences=2:;Secure;SameSite=None;Domain=.redhat.com";
        },
      });
    }
  );
}

/**
 * Wait that page is loaded correctly and there is no skeleton.
 * It means no ouiaId("loading-table", "PF4/Card")
 */
export function pageWasLoaded() {
  //added waiting on any element to be clear that dom is not empty
  //If you remove this line the next waiting rutine (loading-table) was succesful even if the page (DOM) was empty
  //Tests was randomly failing that an element was reattached to DOM.
  cy.get("#nav-toggle", { timeout: 30000 }).should("be.visible");
  cy.ouiaId("loading-table", "PF4/Card").should("not.exist");
}

export function createInstance(newInstanceName: string, action?: string) {
  cy.contains("button", "Create Smart Events instance").click();
  cy.ouiaId("create-instance", "PF4/ModalContent").then(($modal) => {
    cy.wrap($modal)
      .should("be.visible")
      .ouiaId("cloud-provider", "skeleton")
      .should("not.exist");
    cy.wrap($modal).within(() => {
      cy.ouiaId("cloud-region", "PF4/Select", { timeout: 20000 }).should(
        "not.have.text",
        "Select Region"
      );
      cy.ouiaId("new-name", "PF4/TextInput").type(newInstanceName);
      cy.ouiaId("info-instance-available-soon", "PF4/Alert").should(
        "have.text",
        "Info alert:Your Smart Events instance will be ready for use shortly after creation."
      );
      cy.ouiaId(action ?? "submit", "PF4/Button").click();
    });
    cy.wrap($modal, { timeout: 20000 }).should("not.exist");
  });
}

export function waitTillInstanceIsReady(instanceName: string) {
  cy.ouiaId("Instances list table", "PF4/Table")
    .ouiaId(instanceName, "PF4/TableRow")
    .within(() => {
      cy.get("td:nth-child(3)", { timeout: 50000 }).should(
        "have.text",
        "Ready"
      );
    });
}

export function deleteInstance(deleteInstanceName: string) {
  cy.ouiaId("Instances list table", "PF4/Table")
    .ouiaId(deleteInstanceName, "PF4/TableRow")
    .find("td")
    .then(($cells) => {
      expect($cells).have.length(4);
      cy.wrap($cells.eq(2))
        .invoke("text")
        .then((status) => {
          expect(status).to.match(/failed|ready/gi);
        });
      cy.wrap($cells.eq(3)).ouiaType("PF4/Dropdown").click();
    });
  cy.ouiaType("PF4/DropdownItem").contains("Delete").click();

  cy.ouiaId("delete-instance", "PF4/ModalContent").within(() => {
    cy.ouiaId("delete-confirmation-value", "PF4/TextInput").type(
      deleteInstanceName
    );
    cy.ouiaId("confirm", "PF4/Button").click();
  });
  cy.ouiaId("delete-instance", "PF4/ModalContent").should("not.exist");
}

export function deletedInstanceNotExist(instanceName: string) {
  cy.ouiaId("Instances list table", "PF4/Table").within(() => {
    cy.ouiaId(instanceName, "PF4/TableRow", { timeout: 30000 }).should(
      "not.exist"
    );
  });
}

/**
 * Assert if the test environment is set by the expected value.
 * @param type a name of the desired test environment
 * @returns
 */
export function isEnvironmentType(type: EnvType) {
  return Cypress.env("TEST_TYPE") === type;
}

/**
 * Handle a login procedure for different environments.
 */
export function safeLogin(loginConfig: LoginConfig) {
  callForEnv(
    () => {
      cy.log("Skip login - mocked env");
    },
    () => {
      cy.login(loginConfig);
    }
  );
}

/**
 * Handle a procedure for different environments.
 */
function callForEnv(mocked: () => void, dev: () => void) {
  if (isEnvironmentType(EnvType.Mocked)) {
    mocked();
  } else if (isEnvironmentType(EnvType.Dev)) {
    dev();
  } else {
    throw new Error(
      "The environment type is not recognized. Values of CYPRESS_TEST_TYPE are defined by the 'EnvType' enum. "
    );
  }
}

/**
 * This enum represents values of the CYPRESS_TEST_TYPE env variable.
 */
export enum EnvType {
  Mocked = "mocked",
  Dev = "dev",
}
