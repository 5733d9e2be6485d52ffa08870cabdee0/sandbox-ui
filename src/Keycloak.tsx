import Keycloak from 'keycloak-js';
import React from 'react';

import { Auth, AuthContext } from '@rhoas/app-services-ui-shared';

export let keycloak: Keycloak.KeycloakInstance | undefined;

/**
 * Get keycloak instance
 *
 * @return an initiated keycloak instance or `undefined`
 * if keycloak isn't configured
 *
 */
export const setKeycloakInstance = async () => {
  if (!keycloak) await init();
};

/**
 * Initiate keycloak instance.
 *
 * Set keycloak to undefined if
 * keycloak isn't configured
 *
 */
export const init = async () => {
  try {
    /* Keycloak configuration using OB authentication.
     * Thiese params will change after sso is implemented.
     * See https://issues.redhat.com/browse/MGDOBR-466
     */
    keycloak = new (Keycloak as any)({
      realm: 'event-bridge-fm',
      url: 'https://keycloak-event-bridge-prod.apps.openbridge-dev.fdvn.p1.openshiftapps.com/auth/',
      clientId: 'event-bridge',
    });
    if (keycloak) {
      await keycloak.init({
        onLoad: 'login-required',
      });
    }
  } catch (e) {
    keycloak = undefined;
    console.warn(
      'Auth: Unable to initialize keycloak. Client side will not be configured to use authentication',
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
  await keycloak?.updateToken(50);
  if (keycloak?.token) return keycloak.token;
  console.error('No keycloak token available');
  return 'foo';
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
    await keycloak?.updateToken(50);
    if (keycloak?.tokenParsed) return keycloak.tokenParsed;
    console.error('No keycloak token available');
    return {} as Keycloak.KeycloakTokenParsed;
  };

/**
 * logout of keycloak, clear cache and offline store then redirect to
 * keycloak login page
 */
export const logout = async () => {
  if (keycloak) {
    await keycloak.logout();
  }
};

export const KeycloakAuthProvider: React.FunctionComponent = (props) => {
  const getUsername = () => {
    return getParsedKeyCloakToken().then((token: any) => token['username']);
  };

  const authTokenContext = {
    kas: {
      getToken: getKeyCloakToken,
    },
    getUsername: getUsername,
  } as Auth;
  return (
    <AuthContext.Provider value={authTokenContext}>
      {props.children}
    </AuthContext.Provider>
  );
};
