/**
 * Unified Analytics: Meta Pixel (1690563088540181) + TikTok Pixel (DBNK5NJC77U6CGRG7ETG)
 * and Server-Side Events API (Meta Conversions API + TikTok Events API)
 *
 * Implements dual-tracking with shared event_id for 100% deduplication across
 * browser pixels and server-side Conversions / Events APIs.
 */

export const META_PIXEL_ID = '1690563088540181';
export const TIKTOK_PIXEL_ID = 'DBNK5NJC77U6CGRG7ETG';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    ttq?: any;
    TiktokAnalyticsObject?: any;
  }
}

/**
 * Generate a unique event ID shared between client-side pixels and server-side APIs
 */
export function generateEventId(): string {
  return 'ml_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Extract browser cookie helper
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Get Facebook click ID from URL (?fbclid=...) or _fbc cookie
 */
export function getFbc(): string | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get('fbclid');
  if (fbclid) {
    return `fb.1.${Date.now()}.${fbclid}`;
  }
  return getCookie('_fbc');
}

/**
 * Get Facebook browser ID from _fbp cookie
 */
export function getFbp(): string | null {
  return getCookie('_fbp');
}

/**
 * Get TikTok Click ID from URL (?ttclid=...) or cookie
 */
export function getTtclid(): string | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  const param = urlParams.get('ttclid');
  if (param) return param;
  return getCookie('ttclid') || getCookie('_ttp');
}

/**
 * Get Meta Test Event Code from URL (?test_event_code=...)
 */
export function getTestEventCode(): string | null {
  if (typeof window === 'undefined') return null;
  const urlParams = new URLSearchParams(window.location.search);
  return (
    urlParams.get('test_event_code') ||
    urlParams.get('test_code') ||
    urlParams.get('testEventCode') ||
    null
  );
}

/**
 * Initialize Meta Pixel in browser if not already loaded
 */
export function initMetaPixel(pixelId: string = META_PIXEL_ID): void {
  const activePixelId = pixelId || import.meta.env.VITE_META_PIXEL_ID || META_PIXEL_ID;
  if (!activePixelId || typeof window === 'undefined') return;

  if (window.fbq && typeof window.fbq === 'function') {
    return;
  }

  const win = window as any;
  const doc = document;
  const n: any = (win.fbq = function (...args: any[]) {
    if (n.callMethod) {
      n.callMethod.apply(n, args);
    } else {
      n.queue.push(args);
    }
  });
  if (!win._fbq) win._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  const t = doc.createElement('script');
  t.async = true;
  t.src = 'https://connect.facebook.net/en_US/fbevents.js';
  const s = doc.getElementsByTagName('script')[0];
  if (s && s.parentNode) {
    s.parentNode.insertBefore(t, s);
  }

  if (typeof window.fbq === 'function') {
    window.fbq('init', activePixelId);
  }
}

/**
 * Initialize TikTok Pixel in browser if not already loaded
 */
export function initTikTokPixel(pixelId: string = TIKTOK_PIXEL_ID): void {
  const activePixelId = pixelId || import.meta.env.VITE_TIKTOK_PIXEL_ID || TIKTOK_PIXEL_ID;
  if (!activePixelId || typeof window === 'undefined') return;

  if (window.ttq && typeof window.ttq.page === 'function') {
    return;
  }

  const w = window as any;
  const d = document;
  const t = 'ttq';
  w.TiktokAnalyticsObject = t;
  const ttq = (w[t] = w[t] || []);
  ttq.methods = [
    'page',
    'track',
    'identify',
    'instances',
    'debug',
    'on',
    'off',
    'once',
    'ready',
    'alias',
    'group',
    'enableCookie',
    'disableCookie',
    'holdConsent',
    'revokeConsent',
    'grantConsent',
  ];
  ttq.setAndDefer = function (target: any, method: string) {
    target[method] = function (...args: any[]) {
      target.push([method, ...args]);
    };
  };
  for (let i = 0; i < ttq.methods.length; i++) {
    ttq.setAndDefer(ttq, ttq.methods[i]);
  }
  ttq.instance = function (id: string) {
    const inst = ttq._i[id] || [];
    for (let j = 0; j < ttq.methods.length; j++) {
      ttq.setAndDefer(inst, ttq.methods[j]);
    }
    return inst;
  };
  ttq.load = function (e: string, n?: any) {
    const r = 'https://analytics.tiktok.com/i18n/pixel/events.js';
    ttq._i = ttq._i || {};
    ttq._i[e] = [];
    ttq._i[e]._u = r;
    ttq._t = ttq._t || {};
    ttq._t[e] = +new Date();
    ttq._o = ttq._o || {};
    ttq._o[e] = n || {};
    const script = d.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = r + '?sdkid=' + e + '&lib=' + t;
    const firstScript = d.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    }
  };

  ttq.load(activePixelId);
  ttq.page();
}

/**
 * Initialize all analytics pixels
 */
export function initAllPixels(): void {
  initMetaPixel();
  initTikTokPixel();
}

/**
 * Send server-side event to /api/meta-conversions (Meta Conversions API)
 */
export async function sendCapiEvent(
  eventName: string,
  eventId: string,
  customData: Record<string, any> = {},
  userData: Record<string, any> = {}
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const testCode = getTestEventCode();
    const payload = {
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      pixelId: META_PIXEL_ID,
      userData: {
        fbp: getFbp(),
        fbc: getFbc(),
        clientUserAgent: navigator.userAgent,
        ...userData,
      },
      customData,
      ...(testCode ? { testEventCode: testCode } : {}),
    };

    fetch('/api/meta-conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((err) => {
      console.warn('[Meta CAPI Client] Event send deferred:', err);
    });
  } catch (error) {
    console.warn('[Meta CAPI Client] Error assembling event payload:', error);
  }
}

/**
 * Send server-side event to /api/tiktok-events (TikTok Events API)
 */
export async function sendTikTokEventsApi(
  eventName: string,
  eventId: string,
  customData: Record<string, any> = {},
  userData: Record<string, any> = {}
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const payload = {
      eventName,
      eventId,
      eventSourceUrl: window.location.href,
      pixelId: TIKTOK_PIXEL_ID,
      userData: {
        ttclid: getTtclid(),
        ttp: getCookie('_ttp'),
        clientUserAgent: navigator.userAgent,
        ...userData,
      },
      customData,
    };

    fetch('/api/tiktok-events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch((err) => {
      console.warn('[TikTok Events API Client] Event send deferred:', err);
    });
  } catch (error) {
    console.warn('[TikTok Events API Client] Error assembling payload:', error);
  }
}

/**
 * Track PageView across both Meta & TikTok Browser Pixels and Server Events APIs
 */
export function trackPageView(eventId?: string): string {
  const eid = eventId || generateEventId();

  // Meta Pixel
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView', {}, { eventID: eid });
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.page === 'function') {
    window.ttq.page();
  }

  // Server-Side APIs
  sendCapiEvent('PageView', eid, {}, {});
  sendTikTokEventsApi('PageView', eid, {}, {});

  return eid;
}

/**
 * Track ViewContent across Meta & TikTok Browser Pixels and Server Events APIs
 */
export function trackViewContent(
  contentName: string,
  price: number,
  currency: string = 'NGN',
  eventId?: string
): string {
  const eid = eventId || generateEventId();
  const metaCustomData = {
    content_name: contentName,
    content_category: 'Smart Home Security',
    content_type: 'product',
    content_ids: ['A-01-DEADBOLT-LOCK'],
    value: price,
    currency: currency,
  };

  const tikTokCustomData = {
    content_id: 'A-01-DEADBOLT-LOCK',
    content_type: 'product',
    content_name: contentName,
    content_category: 'Smart Home Security',
    quantity: 1,
    price: price,
    value: price,
    currency: currency,
    contents: [
      {
        content_id: 'A-01-DEADBOLT-LOCK',
        content_name: contentName,
        content_category: 'Smart Home Security',
        quantity: 1,
        price: price,
      },
    ],
  };

  // Meta Browser Pixel
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', metaCustomData, { eventID: eid });
  }

  // TikTok Browser Pixel
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('ViewContent', tikTokCustomData, { event_id: eid });
  }

  // Server-Side Conversions / Events APIs
  sendCapiEvent('ViewContent', eid, metaCustomData, {});
  sendTikTokEventsApi('ViewContent', eid, tikTokCustomData, {});

  return eid;
}

/**
 * Track InitiateCheckout across Meta & TikTok Browser Pixels and Server Events APIs
 */
export function trackInitiateCheckout(
  value: number,
  currency: string = 'NGN',
  quantity: number = 1,
  eventId?: string
): string {
  const eid = eventId || generateEventId();

  const metaCustomData = {
    value: value,
    currency: currency,
    num_items: quantity,
    content_name: 'A-01 Deadbolt Type Smart Lock',
    content_type: 'product',
    content_ids: ['A-01-DEADBOLT-LOCK'],
  };

  const tikTokCustomData = {
    content_id: 'A-01-DEADBOLT-LOCK',
    content_type: 'product',
    content_name: 'A-01 Deadbolt Type Smart Lock',
    quantity: quantity,
    price: 180000,
    value: value,
    currency: currency,
    contents: [
      {
        content_id: 'A-01-DEADBOLT-LOCK',
        content_name: 'A-01 Deadbolt Type Smart Lock',
        content_category: 'Smart Home Security',
        quantity: quantity,
        price: 180000,
      },
    ],
  };

  // Meta Browser Pixel
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', metaCustomData, { eventID: eid });
  }

  // TikTok Browser Pixel
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('InitiateCheckout', tikTokCustomData, { event_id: eid });
  }

  // Server-Side Conversions / Events APIs
  sendCapiEvent('InitiateCheckout', eid, metaCustomData, {});
  sendTikTokEventsApi('InitiateCheckout', eid, tikTokCustomData, {});

  return eid;
}

/**
 * Track Purchase / Order Placement across Meta Pixel & Conversions API (CAPI) and TikTok Pixel & Events API
 *
 * Fires official standard events:
 * - Meta Pixel & CAPI: 'Purchase' (Primary) and 'Lead' (Secondary)
 * - TikTok Pixel & Events API: 'CompletePayment' (Primary) and 'PlaceAnOrder' (Secondary)
 *
 * Implements high Event Match Quality (EMQ) with SHA-256 hashed customer identifiers
 * and identical deduplication keys across browser and server.
 */
export function trackPurchase(
  orderRef: string,
  value: number,
  currency: string = 'NGN',
  userData: {
    fullName?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    city?: string;
    state?: string;
    address?: string;
    quantity?: number;
  } = {},
  eventId?: string
): string {
  const purchaseEventId = eventId || orderRef || generateEventId();
  const secondaryEventId = `sec_${purchaseEventId}`;

  const metaPurchaseData = {
    content_name: 'A-01 Deadbolt Type Smart Lock',
    content_category: 'Smart Home Security',
    content_type: 'product',
    content_ids: ['A-01-DEADBOLT-LOCK'],
    value: value,
    currency: currency,
    order_id: orderRef,
    order_ref: orderRef,
    num_items: userData.quantity || 1,
    status: 'order_received_payment_on_delivery',
  };

  const cleanPhone = (userData.phoneNumber || userData.whatsappNumber || '').replace(/\D/g, '');
  let normalizedPhone = cleanPhone;
  if (cleanPhone.startsWith('2340') && cleanPhone.length === 14) {
    normalizedPhone = '234' + cleanPhone.substring(4);
  } else if (cleanPhone.startsWith('0') && cleanPhone.length === 11) {
    normalizedPhone = '234' + cleanPhone.substring(1);
  } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
    normalizedPhone = '234' + cleanPhone;
  }

  const tikTokPurchaseData = {
    content_id: 'A-01-DEADBOLT-LOCK',
    content_type: 'product',
    content_name: 'A-01 Deadbolt Type Smart Lock',
    content_category: 'Smart Home Security',
    order_id: orderRef,
    quantity: userData.quantity || 1,
    price: 180000,
    value: value,
    currency: currency,
    status: 'payment_on_delivery',
    contents: [
      {
        content_id: 'A-01-DEADBOLT-LOCK',
        content_type: 'product',
        content_name: 'A-01 Deadbolt Type Smart Lock',
        content_category: 'Smart Home Security',
        quantity: userData.quantity || 1,
        price: 180000,
      },
    ],
  };

  // 1. TikTok Identify for advanced matching
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.identify === 'function') {
    window.ttq.identify({
      phone_number: normalizedPhone || undefined,
      name: userData.fullName || undefined,
    });
  }

  // 2. Meta Browser Pixel: Fire Purchase (Primary) and Lead (Secondary)
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    // Primary Meta Purchase Event
    window.fbq(
      'track',
      'Purchase',
      {
        ...metaPurchaseData,
        state: userData.state,
      },
      { eventID: purchaseEventId }
    );

    // Secondary Meta Lead Event
    window.fbq(
      'track',
      'Lead',
      {
        ...metaPurchaseData,
        state: userData.state,
      },
      { eventID: secondaryEventId }
    );
  }

  // 3. TikTok Browser Pixel: Fire CompletePayment (Primary) and PlaceAnOrder (Secondary)
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('CompletePayment', tikTokPurchaseData, { event_id: purchaseEventId });
    window.ttq.track('PlaceAnOrder', tikTokPurchaseData, { event_id: secondaryEventId });
  }

  const userPayload = {
    fullName: userData.fullName,
    phone: userData.phoneNumber,
    whatsapp: userData.whatsappNumber,
    city: userData.city,
    state: userData.state,
    address: userData.address,
  };

  // 4. Server-Side Meta Conversions API (CAPI) for Purchase (Primary) and Lead (Secondary)
  sendCapiEvent('Purchase', purchaseEventId, metaPurchaseData, userPayload);
  sendCapiEvent('Lead', secondaryEventId, metaPurchaseData, userPayload);

  // 5. Server-Side TikTok Events API for CompletePayment (Primary) and PlaceAnOrder (Secondary)
  sendTikTokEventsApi('CompletePayment', purchaseEventId, tikTokPurchaseData, userPayload);
  sendTikTokEventsApi('PlaceAnOrder', secondaryEventId, tikTokPurchaseData, userPayload);

  console.log(`[Purchase Event Tracked] OrderRef: ${orderRef} | Value: ₦${value.toLocaleString()} | EventID: ${purchaseEventId}`);

  return purchaseEventId;
}

/**
 * Backward compatibility alias for trackLeadOrderSubmitted
 */
export function trackLeadOrderSubmitted(
  orderRef: string,
  value: number,
  currency: string = 'NGN',
  userData: {
    fullName?: string;
    phoneNumber?: string;
    whatsappNumber?: string;
    city?: string;
    state?: string;
    address?: string;
    quantity?: number;
  } = {},
  eventId?: string
): string {
  return trackPurchase(orderRef, value, currency, userData, eventId);
}

/**
 * Track Contact (e.g., when customer chats on WhatsApp to track order after placement)
 */
export function trackContact(orderRef?: string, eventId?: string): string {
  const eid = eventId || (orderRef ? `contact_${orderRef}` : generateEventId());
  const customData = {
    content_name: 'WhatsApp Dispatch Confirmation',
    order_ref: orderRef,
  };

  // Meta Pixel
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', customData, { eventID: eid });
  }

  // TikTok Pixel
  if (typeof window !== 'undefined' && window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('Contact', customData, { event_id: eid });
  }

  // Server-Side APIs
  sendCapiEvent('Contact', eid, customData, {});
  sendTikTokEventsApi('Contact', eid, customData, {});

  return eid;
}

// Global browser test helpers for Meta Pixel Helper and TikTok Pixel testing
if (typeof window !== 'undefined') {
  (window as any).trackPurchase = trackPurchase;
  (window as any).testPurchaseEvent = (amount: number = 180000) => {
    const testRef = 'ML-TEST-' + Math.floor(100000 + Math.random() * 900000);
    console.log('[Test Helper] Triggering Purchase Event with Ref:', testRef);
    return trackPurchase(testRef, amount, 'NGN', {
      fullName: 'Test Customer',
      phoneNumber: '08147778029',
      whatsappNumber: '08147778029',
      city: 'Lagos',
      state: 'Lagos',
      address: '12 Test Street, Victoria Island',
      quantity: 1,
    });
  };
}
