/**
 * Meta Pixel & Conversions API (CAPI) Client Utility
 * Configured with Meta Pixel ID: 1690563088540181
 *
 * Implements dual-tracking with shared event_id for 100% Meta event deduplication.
 */

export const META_PIXEL_ID = '1690563088540181';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

/**
 * Generate a unique event ID shared between client-side pixel and server-side CAPI
 */
export function generateEventId(): string {
  return 'ml_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * Extract browser cookie helper
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

/**
 * Get Facebook click ID from URL (?fbclid=...) or _fbc cookie
 */
function getFbc(): string | null {
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
function getFbp(): string | null {
  return getCookie('_fbp');
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
    };

    fetch('/api/meta-conversions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      // keepalive allows sending even during page navigation/unloads
      keepalive: true,
    }).catch((err) => {
      // Non-blocking: fail quietly on network issues so user experience is not disrupted
      console.warn('[Meta CAPI Client] Event send deferred:', err);
    });
  } catch (error) {
    console.warn('[Meta CAPI Client] Error assembling event payload:', error);
  }
}

/**
 * Track PageView across both Browser Pixel and Server Conversions API
 */
export function trackPageView(eventId?: string): string {
  const eid = eventId || generateEventId();
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView', {}, { eventID: eid });
  }
  sendCapiEvent('PageView', eid, {}, {});
  return eid;
}

/**
 * Track ViewContent across both Browser Pixel and Server Conversions API
 */
export function trackViewContent(
  contentName: string,
  price: number,
  currency: string = 'NGN',
  eventId?: string
): string {
  const eid = eventId || generateEventId();
  const customData = {
    content_name: contentName,
    value: price,
    currency: currency,
    content_type: 'product',
  };

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'ViewContent', customData, { eventID: eid });
  }

  sendCapiEvent('ViewContent', eid, customData, {});
  return eid;
}

/**
 * Track InitiateCheckout across both Browser Pixel and Server Conversions API
 */
export function trackInitiateCheckout(
  value: number,
  currency: string = 'NGN',
  quantity: number = 1,
  eventId?: string
): string {
  const eid = eventId || generateEventId();
  const customData = {
    value: value,
    currency: currency,
    num_items: quantity,
    content_name: 'Max Luxury Smart Security Door Lock',
    content_type: 'product',
  };

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'InitiateCheckout', customData, { eventID: eid });
  }

  sendCapiEvent('InitiateCheckout', eid, customData, {});
  return eid;
}

/**
 * Track Lead / Order Submitted across both Browser Pixel and Server Conversions API
 * Transfers customer phone, full name, city, state for high Event Match Quality (EMQ)
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
  const eid = eventId || generateEventId();
  const customData = {
    content_name: 'Max Luxury Smart Security Door Lock Order',
    content_category: 'Smart Home Security',
    value: value,
    currency: currency,
    order_ref: orderRef,
    num_items: userData.quantity || 1,
    status: 'order_received_payment_on_delivery',
  };

  // Browser Pixel
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(
      'track',
      'Lead',
      {
        ...customData,
        state: userData.state,
      },
      { eventID: eid }
    );
  }

  // Server CAPI with full user data for Meta EMQ hashing
  sendCapiEvent('Lead', eid, customData, {
    fullName: userData.fullName,
    phone: userData.phoneNumber,
    whatsapp: userData.whatsappNumber,
    city: userData.city,
    state: userData.state,
    address: userData.address,
  });

  return eid;
}

/**
 * Track Contact (e.g., when customer chats on WhatsApp to track order after placement)
 */
export function trackContact(orderRef?: string, eventId?: string): string {
  const eid = eventId || generateEventId();
  const customData = {
    content_name: 'WhatsApp Dispatch Confirmation',
    order_ref: orderRef,
  };

  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', 'Contact', customData, { eventID: eid });
  }

  sendCapiEvent('Contact', eid, customData, {});
  return eid;
}
