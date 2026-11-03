/**
 * Air-gapped build: error reporting is disabled.
 * Keep the same API so existing call sites remain no-ops.
 */
const noop = () => undefined;

export const sentry = {
  init: noop,
  enable: noop,
  disable: noop,
};
