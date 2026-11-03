import { enableAutoTrack, tracker } from '@affine/track';
import { appSettingAtom } from '@toeverything/infra';
import { useAtomValue } from 'jotai/react';
import { useEffect } from 'react';

export function Telemetry() {
  const settings = useAtomValue(appSettingAtom);

  useEffect(() => {
    if (settings.enableTelemetry === false) {
      tracker.opt_out_tracking();
      return;
    } else {
      tracker.opt_in_tracking();
      return enableAutoTrack(document.body, tracker.track);
    }
  }, [settings.enableTelemetry]);

  return null;
}
