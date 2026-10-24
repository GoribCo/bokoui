// Static demo only: the sample backend runs in the browser, where the JWT code is never reached (sessions
// are bypassed). This stands in for node:crypto so the router can be bundled for the browser.
const unavailable = () => {
  throw new Error("node:crypto is not available in the static demo");
};
export const createHmac = unavailable;
export const timingSafeEqual = unavailable;
