import Script from 'next/script';
import { UMAMI } from '@/lib/analytics';

// Cookie-less page-view analytics. Respects Do Not Track.
const Analytics = () => (
  <Script
    src={UMAMI.src}
    data-website-id={UMAMI.websiteId}
    data-domains={UMAMI.domains}
    data-do-not-track="true"
    strategy="afterInteractive"
  />
);

export default Analytics;
