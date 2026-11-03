export type TelemetryEvent = {
  schemaVersion: 1;
  eventName: string;
  params?: Record<string, unknown>;
  userProperties?: Record<string, unknown>;
  userId?: string;
  clientId: string;
  sessionId?: string | number;
  eventId: string;
  timestampMicros?: number;
  context?: {
    appVersion?: string;
    editorVersion?: string;
    environment?: string;
    distribution?: string;
    channel?: 'stable' | 'beta' | 'internal' | 'canary';
    isDesktop?: boolean;
    isMobile?: boolean;
    locale?: string;
    timezone?: string;
    url?: string;
    referrer?: string;
  };
};

export type TelemetryContext = {
  isAuthed: boolean;
  isSelfHosted: boolean;
  channel: 'stable' | 'beta' | 'internal' | 'canary';
  userId?: string;
  userProperties?: Record<string, unknown>;
  officialEndpoint: string;
};

export type TelemetryAck =
  | { ok: true; accepted: number; dropped: number }
  | { ok: false; error: { name: string; message: string } };

export type TelemetryTransport = {
  setContext: (context: TelemetryContext) => Promise<void> | void;
  track: (event: TelemetryEvent) => Promise<{ queued: boolean }> | void;
  pageview?: (event: TelemetryEvent) => Promise<{ queued: boolean }> | void;
  flush?: () => Promise<TelemetryAck> | void;
};

type TelemetryContextUpdate = Partial<TelemetryContext> & {
  userProperties?: Record<string, unknown>;
};

type TelemetryContextUpdateOptions = {
  replaceUserProperties?: boolean;
};

/**
 * Air-gapped build: telemetry is intentionally a no-op.
 * No transport is installed, no events are queued and nothing is sent.
 */
export function setTelemetryTransport(_next: TelemetryTransport | null) {
  // no-op: telemetry is disabled in air-gapped builds.
}

export function setTelemetryContext(
  _update: TelemetryContextUpdate,
  _options: TelemetryContextUpdateOptions = {}
) {
  // no-op: telemetry is disabled in air-gapped builds.
}

export function getTelemetryContext(): TelemetryContext {
  return {
    isAuthed: false,
    isSelfHosted: false,
    channel: 'stable',
    officialEndpoint: '',
    userProperties: {},
  };
}

export async function sendTelemetryEvent(
  _event: TelemetryEvent
): Promise<{ queued: boolean }> {
  return { queued: false };
}

export async function flushTelemetry(): Promise<TelemetryAck> {
  return { ok: true, accepted: 0, dropped: 0 };
}
