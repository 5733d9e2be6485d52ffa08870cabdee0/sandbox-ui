/* eslint-disable @typescript-eslint/await-thenable */
import Keycloak from "keycloak-js";

export let keycloak: Keycloak.KeycloakInstance | undefined;

/* Token min validity in seconds
 * Passed to updateToken(). When the token is going to expire before
 * the minimum validity, the token is refreshed.
 */
const TOKEN_MIN_VALIDITY_SECONDS = 50;

/**
 * Get keycloak instance
 *
 * @return an initiated keycloak instance or `undefined`
 * if keycloak isn't configured
 *
 */
export const setKeycloakInstance = async (): Promise<void> => {
  if (!keycloak) await init();
};
/**
 * Initiate keycloak instance.
 *
 * Set keycloak to undefined if
 * keycloak isn't configured
 *
 */
export const init = async (): Promise<void> => {
  try {
    keycloak = Keycloak({
      realm: "redhat-external",
      url: "https://sso.redhat.com/auth/",
      clientId: "cloud-services",
    });
    if (keycloak) {
      await keycloak.init({
        onLoad: "login-required",
        promiseType: "native",
      });
    }
  } catch (e) {
    keycloak = undefined;
    console.warn(
      "Auth: Unable to initialize keycloak. Client side will not be configured to use authentication",
      e
    );
  }
};

/**
 * Use keycloak update token function to retrieve
 * keycloak token
 *
 * @return keycloak token or empty string if keycloak
 * isn't configured
 *
 */
export const getKeyCloakToken = async (): Promise<string> => {
  await keycloak?.updateToken(TOKEN_MIN_VALIDITY_SECONDS);
  if (keycloak?.token) return keycloak.token;
  console.error("No keycloak token available");
  return "foo";
};

/**
 * Use keycloak update token function to retrieve
 * keycloak token
 *
 * @return keycloak token or empty string if keycloak
 * isn't configured
 *
 */
export const getParsedKeyCloakToken =
  async (): Promise<Keycloak.KeycloakTokenParsed> => {
    await keycloak?.updateToken(TOKEN_MIN_VALIDITY_SECONDS);
    if (keycloak?.tokenParsed) return keycloak.tokenParsed;
    console.error("No keycloak token available");
    return {} as Keycloak.KeycloakTokenParsed;
  };

export const getUsername = (): Promise<string> => {
  return getParsedKeyCloakToken().then(
    (token: unknown) =>
      (
        token as {
          [index: string]: string;
        }
      )["username"] ?? ""
  );
};

/**
 * logout of keycloak, clear cache and offline store then redirect to
 * keycloak login page
 */
export const logout = async (): Promise<void> => {
  if (keycloak) {
    await keycloak.logout();
  }
};
