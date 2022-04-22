/*
 * Copyright 2022 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

Cypress.Commands.add(
  "ouiaId",
  { prevSubject: ["optional", "element"] },
  (subject, id: string, type?: string, options = {}) => {
    const typeSelector = type ? ouiaAttrSelector("component-type", type) : "";
    const idSelector = ouiaAttrSelector("component-id", id);
    if (subject) {
      if (type) {
        cy.wrap(subject, options).find(typeSelector + idSelector, options);
      } else {
        cy.wrap(subject).filter(idSelector);
      }
    } else {
      // eslint-disable-next-line cypress/require-data-selectors
      cy.get(typeSelector + idSelector, options);
    }
  }
);

Cypress.Commands.add(
  "ouiaType",
  { prevSubject: ["optional", "element"] },
  (subject, type: string, options = {}) => {
    const typeSelector = ouiaAttrSelector("component-type", type);
    if (subject) {
      cy.wrap(subject, options).find(typeSelector, options);
    } else {
      // eslint-disable-next-line cypress/require-data-selectors
      cy.get(typeSelector, options);
    }
  }
);

Cypress.Commands.add(
  "ouiaSafe",
  { prevSubject: ["element"] },
  (subject, options = {}) => {
    cy.wrap(subject).filter(ouiaSafeSelector(), options);
  }
);

const ouiaAttrSelector = (name: string, value?: string): string => {
  return `[data-ouia-${name}` + (value ? `='${value}']` : "]");
};

const ouiaSafeSelector = (): string => {
  return ouiaAttrSelector("safe", "true");
};

Cypress.Commands.add(
  "ouiaNavigationName",
  { prevSubject: ["optional", "element"] },
  (subject, value?: string, options = {}) => {
    const selector = ouiaAttrSelector("navigation-name", value);
    if (subject) {
      cy.wrap(subject, options).find(selector, options);
    } else {
      // eslint-disable-next-line cypress/require-data-selectors
      cy.get(selector, options);
    }
  }
);
