import { ServerDeploymentType, ServerFeature } from '@affine/graphql';

import { DEFAULT_SELF_HOSTED_SERVER_NAME } from './server-name';
import type { ServerConfig, ServerMetadata } from './types';

export const AFFINE_HOSTED_ORIGINS = new Set([
  'https://app.affine.pro',
  'https://insider.affine.pro',
  'https://affine.fail',
  'https://apple.getaffineapp.com',
]);

function getDefaultServerBaseUrl() {
  if (BUILD_CONFIG.defaultServerUrl) {
    return BUILD_CONFIG.defaultServerUrl.replace(/\/+$/, '');
  }

  if (
    typeof location !== 'undefined' &&
    (location.protocol === 'http:' || location.protocol === 'https:') &&
    !AFFINE_HOSTED_ORIGINS.has(location.origin)
  ) {
    return location.origin;
  }

  // Native builds have no meaningful `location.origin` (Electron uses a
  // custom protocol, Capacitor uses a local webview origin). This is only a
  // local placeholder; users can add their real self-hosted server in the
  // sign-in flow or bake it in with AFFINE_DEFAULT_SERVER_URL.
  return 'http://localhost:3010';
}

/**
 * Air-gapped build: the only built-in server is a local/self-hosted one.
 * No AFFiNE-hosted cloud server is registered, so the app never contacts
 * app.affine.pro / insider.affine.pro / affine.fail at startup.
 */
export const BUILD_IN_SERVERS: (ServerMetadata & { config: ServerConfig })[] = [
  {
    id: 'affine-cloud',
    baseUrl: getDefaultServerBaseUrl(),
    config: {
      serverName: DEFAULT_SELF_HOSTED_SERVER_NAME,
      features: [ServerFeature.LocalWorkspace],
      oauthProviders: [],
      type: ServerDeploymentType.Selfhosted,
      version: BUILD_CONFIG.appVersion,
      credentialsRequirement: {
        password: {
          minLength: 8,
          maxLength: 32,
        },
      },
    },
  },
];

/**
 * Telemetry is disabled in air-gapped builds. Returning an empty endpoint
 * keeps any remaining call sites from resolving to an AFFiNE-hosted URL.
 */
export function getOfficialTelemetryEndpoint(
  _channel = BUILD_CONFIG.appBuildType
): string {
  return '';
}
