import { LoginConfig } from "cypress/utils/config/LoginConfig";

declare namespace Cypress {
  interface Chainable {
    /**
     * Search elements by data-ouia component attributes. If type is not specified it just filters on the previous subject (does not go deeper into children).
     * Behaves as get/find depending on if is chained or not.
     * @param id string
     * @param type optional string
     * @param opts optional - config object
     */
    ouiaId(
      id: string,
      type?: string,
      opts?: Record<string, any>
    ): Chainable<JQuery<Element>>;

    /**
     * Search elements by data-ouia component-type attribute. Behaves as get/find depending on if is chained or not.
     * @param type string
     * @param opts optional - config object
     */
    ouiaType(
      type: string,
      opts?: Record<string, any>
    ): Chainable<JQuery<Element>>;

    /**
     * Filter element based on data-ouia-safe attribute
     * @param opts optional - config object
     */
    ouiaSafe(opts?: Record<string, any>): Chainable<JQuery<Element>>;

    /**
     *
     * @param value string
     * @param opts optional - config object
     */
    ouiaNavigationName(
      value?: string,
      opts?: Record<string, any>
    ): Chainable<JQuery<Element>>;

    /**
     *
     */
    login(loginConfig: LoginConfig): Chainable<JQuery<Element>>;
  }
}
