import React, { useEffect, useRef } from 'react';

type HilltopAdsProps = {
  enabled?: boolean;
  className?: string;
};

const HILLTOP_PUSH_SRC =
  'https://stupid-police.com/bcX.VusfdvG_lK0ZYLWHcy/xeKmg9zu/ZmUClRkgPKTnYO3/NyTrAL2mMuzkQ/tAN/jVc/1hMwDQYwzBN/Qv';

const HILLTOP_BANNER_SRC =
  'https://stupid-police.com/bIX.VrsId/GllI0NYCWrcC/Dezm/9rukZpU/l/kHPyTzYJ3cNhT/AP2FMDz/gOtmN_j/cv1mMADhYEzCOcQr';

const BANNER_SLOT_ID = 'hilltopads-banner-slot';

function ensureScript({
  scriptId,
  parent,
  src,
}: {
  scriptId: string;
  parent: HTMLElement;
  src: string;
}) {
  const existing = document.querySelector(`script[data-hilltopads-id="${scriptId}"]`);
  if (existing) return;

  const script = document.createElement('script') as HTMLScriptElement & { settings?: unknown };
  script.dataset.hilltopadsId = scriptId;
  script.settings = {};
  script.src = src;
  script.async = true;
  script.referrerPolicy = 'no-referrer-when-downgrade';
  parent.appendChild(script);
}

function getOrCreateSlot(slotId: string): HTMLDivElement {
  const existing = document.getElementById(slotId);
  if (existing instanceof HTMLDivElement) return existing;

  const slot = document.createElement('div');
  slot.id = slotId;
  slot.dataset.hilltopadsSlot = 'banner';
  document.body.appendChild(slot);
  return slot;
}

export default function HilltopAds({ enabled = true, className }: HilltopAdsProps) {
  const bannerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    ensureScript({
      scriptId: 'push',
      parent: document.head,
      src: HILLTOP_PUSH_SRC,
    });
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const container = bannerContainerRef.current;
    if (!container) return;

    const slot = getOrCreateSlot(BANNER_SLOT_ID);
    container.appendChild(slot);

    ensureScript({
      scriptId: 'banner',
      parent: slot,
      src: HILLTOP_BANNER_SRC,
    });

    return () => {
      if (slot.parentNode !== document.body) {
        document.body.appendChild(slot);
      }
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={className}>
      <div ref={bannerContainerRef} />
    </div>
  );
}
