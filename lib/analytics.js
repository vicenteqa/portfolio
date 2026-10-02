// Umami Cloud. The website id is public by design (it ships in the page), so it
// lives here rather than in an env var that would need to exist at build time.
export const UMAMI = {
  src: 'https://cloud.umami.is/script.js',
  websiteId: '8d73b79a-7f09-41c2-b2f8-9fa9a8f49f62',
  // only count visits to the real site, never localhost or previews
  domains: 'vicenteruiz.ddnsfree.com',
};
