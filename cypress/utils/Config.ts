import { EnvType, isEnvironmentType } from "./Util";

export class LoginConfig {
  public readonly user?: string;
  public readonly psw?: string;

  constructor() {
    if (isEnvironmentType(EnvType.Dev)) {
      this.user = Cypress.env("USER");
      this.psw = Cypress.env("PASSWORD");

      if (typeof this.user !== "string" || !this.user) {
        throw new Error("Missing user value, set using CYPRESS_USER");
      } else {
        cy.log("User name is set correctly");
      }

      if (typeof this.psw !== "string" || !this.psw) {
        throw new Error("Missing password value, set using CYPRESS_PASSWORD");
      } else {
        cy.log("Password is set correctly");
      }
    }
  }
}

export class RestConfig {
  public readonly restBaseUrl: string;
  public readonly restPath: string;
  public readonly restUrl: string;
  public readonly token: string;
  public readonly authorization: string;

  constructor() {
    this.restBaseUrl = Cypress.env("SANDBOX_DEV_REST_URL");
    this.restPath = Cypress.env("SANDBOX_DEV_REST_PATH");
    this.restUrl = `${this.restBaseUrl}${this.restPath}/bridges`;
    this.token = Cypress.env("OB_TOKEN");
    this.authorization = `Bearer ${this.token}`;

    if (!this.token) {
      throw new Error("Missing token value, set using CYPRESS_OB_TOKEN");
    } else {
      cy.log("Token is set correctly");
    }

    expect(this.restBaseUrl, "REST base url was set").to.be.a("string").and.not
      .be.empty;
    expect(this.restPath, "REST path was set").to.be.a("string").and.not.be
      .empty;
  }
}
