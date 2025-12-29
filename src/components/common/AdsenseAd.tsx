// components/AdsenseAd.tsx
'use client';

import Script from 'next/script';
import { useEffect } from 'react';

type AdsenseAdProps = {
  adSlot: string;
  adFormat?: string;
  style?: React.CSSProperties;
  className?: string;
};

export const AdsenseAd = ({
  adSlot,
  adFormat = 'auto',
  style = { display: 'block' },
  className = '',
}: AdsenseAdProps) => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // To be replaced with your AdSense client ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};
