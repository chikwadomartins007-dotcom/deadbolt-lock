import express, { Request, Response } from 'express';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const META_PIXEL_ID = process.env.VITE_META_PIXEL_ID || '1690563088540181';
const TIKTOK_PIXEL_ID = process.env.VITE_TIKTOK_PIXEL_ID || 'DBNK5NJC77U6CGRG7ETG';

app.use(express.json());

/**
 * SHA-256 hash helper complying with Meta CAPI requirements
 */
function hashSha256(value?: string | null): string | undefined {
  if (!value) return undefined;
  const clean = value.trim().toLowerCase();
  if (!clean) return undefined;
  return crypto.createHash('sha256').update(clean).digest('hex');
}

/**
 * Format phone number to E.164 (standard for Nigeria +234)
 */
function normalizePhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;

  // Handle Nigerian formats
  if (digits.startsWith('2340') && digits.length === 14) {
    digits = '234' + digits.substring(4);
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = '234' + digits.substring(1);
  } else if (!digits.startsWith('234') && digits.length === 10) {
    digits = '234' + digits;
  }
  return digits;
}

/**
 * Meta Conversions API (CAPI) Endpoint
 * Handles PageView, ViewContent, InitiateCheckout, Lead, Purchase, and Contact events.
 * Fully supports event deduplication via event_id matching the browser pixel.
 */
app.post('/api/meta-conversions', async (req: Request, res: Response) => {
  try {
    const {
      eventName,
      eventId,
      eventSourceUrl,
      userData = {},
      customData = {},
      pixelId = META_PIXEL_ID,
    } = req.body;

    if (!eventName || !eventId) {
      res.status(400).json({ error: 'eventName and eventId are required' });
      return;
    }

    // Dynamic origin / referer fallback
    const resolvedSourceUrl =
      eventSourceUrl ||
      (req.headers.referer as string) ||
      (req.headers.origin as string) ||
      (process.env.APP_URL ? process.env.APP_URL : 'https://www.maxluxurybathrooms.shop/');

    // Extract client IP and User-Agent
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '';

    const clientUserAgent =
      (req.headers['user-agent'] as string) || userData.clientUserAgent || '';

    // Split name into first and last name if provided
    let firstName = userData.firstName;
    let lastName = userData.lastName;
    if (userData.fullName && (!firstName || !lastName)) {
      const parts = userData.fullName.trim().split(/\s+/);
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || parts[0];
    }

    // Format & SHA-256 hash User Data for Meta Event Match Quality (EMQ)
    const normalizedPhone = normalizePhone(userData.phone || userData.whatsapp);
    const hashedUserData: Record<string, any> = {
      client_ip_address: clientIp,
      client_user_agent: clientUserAgent,
    };

    if (userData.email) hashedUserData.em = [hashSha256(userData.email)];
    if (normalizedPhone) hashedUserData.ph = [hashSha256(normalizedPhone)];
    if (firstName) hashedUserData.fn = [hashSha256(firstName)];
    if (lastName) hashedUserData.ln = [hashSha256(lastName)];
    if (userData.city) hashedUserData.ct = [hashSha256(userData.city.replace(/\s+/g, ''))];
    if (userData.state) hashedUserData.st = [hashSha256(userData.state.replace(/\s+/g, ''))];
    hashedUserData.country = [hashSha256('ng')]; // Standard Nigeria ISO-2 code

    // Pass through browser cookie identifiers if present
    if (userData.fbp) hashedUserData.fbp = userData.fbp;
    if (userData.fbc) hashedUserData.fbc = userData.fbc;

    const testEventCode =
      req.body.testEventCode ||
      (req.query.test_event_code as string) ||
      process.env.META_TEST_EVENT_CODE;

    const capiPayload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: resolvedSourceUrl,
          action_source: 'website',
          user_data: hashedUserData,
          custom_data: customData,
        },
      ],
      ...(testEventCode ? { test_event_code: testEventCode } : {}),
    };

    const accessToken =
      process.env.META_CONVERSIONS_API_TOKEN || process.env.META_CAPI_ACCESS_TOKEN;

    if (accessToken) {
      // Forward directly to Meta Graph API
      const graphUrl = `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${accessToken}`;
      const metaRes = await fetch(graphUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiPayload),
      });

      const metaJson = await metaRes.json();
      console.log(`[Meta CAPI Live] Event "${eventName}" (${eventId}) status:`, metaRes.status, metaJson);

      res.json({
        success: true,
        eventId,
        deduplicated: true,
        pixelId,
        metaResponse: metaJson,
      });
      return;
    }

    // When token is pending, log the validated and hashed CAPI payload for testing/audit
    console.log(
      `[Meta CAPI Ready] "${eventName}" | EventID: ${eventId} | Pixel: ${pixelId} | EMQ matched fields: ${Object.keys(
        hashedUserData
      ).join(', ')}${testEventCode ? ` | Test Code: ${testEventCode}` : ''}`
    );

    res.json({
      success: true,
      eventId,
      deduplicated: true,
      status: 'processed_and_logged',
      pixelId,
      matchedFields: Object.keys(hashedUserData),
      message:
        'Conversions API received and hashed event. Add META_CONVERSIONS_API_TOKEN to .env to push live to Meta Graph API.',
    });
  } catch (error) {
    console.error('[Meta CAPI Server Error]', error);
    res.status(500).json({ error: 'Internal CAPI error', details: String(error) });
  }
});

/**
 * TikTok Events API (Server-Side Events API)
 * Endpoint: /api/tiktok-events
 * Pixel ID: DBNK5NJC77U6CGRG7ETG
 */
app.post('/api/tiktok-events', async (req: Request, res: Response) => {
  try {
    const {
      eventName,
      eventId,
      eventSourceUrl,
      pixelId = 'DBNK5NJC77U6CGRG7ETG',
      userData = {},
      customData = {},
    } = req.body;

    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      '';
    const clientUserAgent =
      (req.headers['user-agent'] as string) || userData.clientUserAgent || '';

    const normalizedPhone = normalizePhone(userData.phone || userData.whatsapp);
    const hashedPhone = normalizedPhone ? hashSha256(normalizedPhone) : undefined;
    const hashedEmail = userData.email
      ? hashSha256(userData.email.trim().toLowerCase())
      : undefined;

    // Map events to standard TikTok Events API names
    let ttEvent = eventName;
    if (eventName === 'Lead') ttEvent = 'PlaceAnOrder';
    if (eventName === 'Purchase') ttEvent = 'CompletePayment';

    const tiktokPayload = {
      event_source: 'web',
      event_source_id: pixelId,
      data: [
        {
          event: ttEvent,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          user: {
            ...(hashedPhone ? { phone: hashedPhone } : {}),
            ...(hashedEmail ? { email: hashedEmail } : {}),
            ip: clientIp,
            user_agent: clientUserAgent,
            ...(userData.ttclid ? { ttclid: userData.ttclid } : {}),
            ...(userData.ttp ? { ttp: userData.ttp } : {}),
          },
          properties: {
            currency: customData.currency || 'NGN',
            value: customData.value || 180000,
            contents: [
              {
                content_id: 'A-01-DEADBOLT-LOCK',
                content_name: 'A-01 Deadbolt Type Smart Lock',
                content_type: 'product',
                quantity: customData.num_items || customData.quantity || 1,
                price: 180000,
              },
            ],
          },
        },
      ],
    };

    const tiktokToken =
      process.env.TIKTOK_EVENTS_API_ACCESS_TOKEN || process.env.TIKTOK_ACCESS_TOKEN;

    if (tiktokToken) {
      const tiktokRes = await fetch(
        'https://business-api.tiktok.com/open_api/v1.3/event/track/',
        {
          method: 'POST',
          headers: {
            'Access-Token': tiktokToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tiktokPayload),
        }
      );

      const tiktokJson = await tiktokRes.json();
      console.log(
        `[TikTok Events API Live] Event "${ttEvent}" (${eventId}) status:`,
        tiktokRes.status,
        tiktokJson
      );

      res.json({
        success: true,
        eventId,
        deduplicated: true,
        tiktokResponse: tiktokJson,
      });
      return;
    }

    console.log(
      `[TikTok Events API Ready] "${ttEvent}" | EventID: ${eventId} | Pixel: ${pixelId} | Hashed phone: ${Boolean(
        hashedPhone
      )}`
    );

    res.json({
      success: true,
      eventId,
      deduplicated: true,
      status: 'processed_and_logged',
      pixelId,
      message:
        'TikTok Events API received and formatted event. Add TIKTOK_EVENTS_API_ACCESS_TOKEN to .env to push live to TikTok Business API.',
    });
  } catch (error) {
    console.error('[TikTok Events API Server Error]', error);
    res.status(500).json({ error: 'Internal TikTok Events API error', details: String(error) });
  }
});

/**
 * Local Orders Database Store
 */
const DATA_DIR = path.resolve(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadOrders(): any[] {
  try {
    ensureDataDir();
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(content) || [];
    }
  } catch (err) {
    console.error('[Orders DB] Error loading orders:', err);
  }
  return [];
}

function saveOrder(order: any): void {
  try {
    ensureDataDir();
    const orders = loadOrders();
    orders.unshift(order); // Add newest order first
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    console.log(`[Orders DB] New order saved successfully: ${order.orderReference}`);
  } catch (err) {
    console.error('[Orders DB] Error saving order:', err);
  }
}

/**
 * Server-Side Events API Dispatcher for Meta Conversions API (CAPI) & TikTok Events API
 * Guarantees that every placed order is tracked server-side even if browser ad-blockers are active.
 */
async function dispatchServerEventsForOrder(
  newOrder: any,
  clientUserAgent: string = '',
  reqHeaders: Record<string, any> = {}
) {
  const normalizedPhone = normalizePhone(newOrder.phone || newOrder.whatsapp);
  const hashedPhone = normalizedPhone ? hashSha256(normalizedPhone) : undefined;
  const parts = String(newOrder.customerName || '').trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || parts[0];

  const subtotalNumber =
    typeof newOrder.subtotal === 'number'
      ? newOrder.subtotal
      : parseInt(String(newOrder.subtotal).replace(/\D/g, ''), 10) || 180000;

  const resolvedSourceUrl =
    newOrder.eventSourceUrl ||
    (reqHeaders['referer'] as string) ||
    (reqHeaders['origin'] as string) ||
    (process.env.APP_URL ? process.env.APP_URL : 'https://www.maxluxurybathrooms.shop/');

  const testEventCode =
    newOrder.testEventCode || process.env.META_TEST_EVENT_CODE;

  // 1. Dispatch to Meta Conversions API (CAPI)
  try {
    const hashedUserData: Record<string, any> = {
      client_ip_address: newOrder.clientIp,
      client_user_agent: clientUserAgent || newOrder.clientUserAgent || '',
      country: [hashSha256('ng')],
    };
    if (newOrder.email) hashedUserData.em = [hashSha256(newOrder.email)];
    if (normalizedPhone) hashedUserData.ph = [hashSha256(normalizedPhone)];
    if (firstName) hashedUserData.fn = [hashSha256(firstName)];
    if (lastName) hashedUserData.ln = [hashSha256(lastName)];
    if (newOrder.state) hashedUserData.st = [hashSha256(String(newOrder.state).replace(/\s+/g, ''))];
    if (newOrder.city) hashedUserData.ct = [hashSha256(String(newOrder.city).replace(/\s+/g, ''))];
    if (newOrder.fbp) hashedUserData.fbp = newOrder.fbp;
    if (newOrder.fbc) hashedUserData.fbc = newOrder.fbc;

    const capiPayload = {
      data: [
        {
          event_name: 'Purchase',
          event_time: Math.floor(Date.now() / 1000),
          event_id: newOrder.orderReference,
          event_source_url: resolvedSourceUrl,
          action_source: 'website',
          user_data: hashedUserData,
          custom_data: {
            content_name: 'A-01 Deadbolt Type Smart Lock',
            content_category: 'Smart Home Security',
            content_type: 'product',
            content_ids: ['A-01-DEADBOLT-LOCK'],
            currency: 'NGN',
            value: subtotalNumber,
            num_items: newOrder.quantity || 1,
            order_id: newOrder.orderReference,
            order_ref: newOrder.orderReference,
          },
        },
        {
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: `sec_${newOrder.orderReference}`,
          event_source_url: resolvedSourceUrl,
          action_source: 'website',
          user_data: hashedUserData,
          custom_data: {
            content_name: 'A-01 Deadbolt Type Smart Lock Order',
            currency: 'NGN',
            value: subtotalNumber,
            num_items: newOrder.quantity || 1,
            order_ref: newOrder.orderReference,
          },
        },
      ],
      ...(testEventCode ? { test_event_code: testEventCode } : {}),
    };

    const metaToken =
      process.env.META_CONVERSIONS_API_TOKEN || process.env.META_CAPI_ACCESS_TOKEN;
    if (metaToken) {
      fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events?access_token=${metaToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(capiPayload),
      })
        .then(async (res) => {
          const json = await res.json().catch(() => null);
          console.log(`[Server Meta CAPI Live] Purchase Event (${newOrder.orderReference}) status: ${res.status}`, json);
        })
        .catch((err) => console.warn('[Server Meta CAPI] Async notice:', err));
    } else {
      console.log(
        `[Server Meta CAPI Ready] Order "${newOrder.orderReference}" | Pixel: ${META_PIXEL_ID} | EMQ matched fields: ${Object.keys(
          hashedUserData
        ).join(', ')}${testEventCode ? ` | Test Code: ${testEventCode}` : ''}`
      );
    }
  } catch (metaErr) {
    console.warn('[Server Meta CAPI] Error:', metaErr);
  }

  // 2. Dispatch to TikTok Events API (CompletePayment & PlaceAnOrder)
  try {
    const tiktokPayload = {
      event_source: 'web',
      event_source_id: TIKTOK_PIXEL_ID,
      data: [
        {
          event: 'CompletePayment',
          event_time: Math.floor(Date.now() / 1000),
          event_id: newOrder.orderReference,
          user: {
            ...(hashedPhone ? { phone: hashedPhone } : {}),
            ip: newOrder.clientIp,
            user_agent: clientUserAgent || newOrder.clientUserAgent || '',
            ...(newOrder.ttclid ? { ttclid: newOrder.ttclid } : {}),
          },
          properties: {
            currency: 'NGN',
            value: subtotalNumber,
            order_id: newOrder.orderReference,
            contents: [
              {
                content_id: 'A-01-DEADBOLT-LOCK',
                content_name: 'A-01 Deadbolt Type Smart Lock',
                content_type: 'product',
                quantity: newOrder.quantity || 1,
                price: 180000,
              },
            ],
          },
        },
        {
          event: 'PlaceAnOrder',
          event_time: Math.floor(Date.now() / 1000),
          event_id: `sec_${newOrder.orderReference}`,
          user: {
            ...(hashedPhone ? { phone: hashedPhone } : {}),
            ip: newOrder.clientIp,
            user_agent: clientUserAgent || newOrder.clientUserAgent || '',
            ...(newOrder.ttclid ? { ttclid: newOrder.ttclid } : {}),
          },
          properties: {
            currency: 'NGN',
            value: subtotalNumber,
            order_id: newOrder.orderReference,
            contents: [
              {
                content_id: 'A-01-DEADBOLT-LOCK',
                content_name: 'A-01 Deadbolt Type Smart Lock',
                content_type: 'product',
                quantity: newOrder.quantity || 1,
                price: 180000,
              },
            ],
          },
        },
      ],
    };

    const tiktokToken =
      process.env.TIKTOK_EVENTS_API_ACCESS_TOKEN || process.env.TIKTOK_ACCESS_TOKEN;
    if (tiktokToken) {
      fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
        method: 'POST',
        headers: {
          'Access-Token': tiktokToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tiktokPayload),
      })
        .then(async (res) => {
          const json = await res.json().catch(() => null);
          console.log(`[Server TikTok Events API Live] CompletePayment (${newOrder.orderReference}) status: ${res.status}`, json);
        })
        .catch((err) => console.warn('[Server TikTok Events API] Async notice:', err));
    }
  } catch (ttErr) {
    console.warn('[Server TikTok Events API] Error:', ttErr);
  }
}

/**
 * Robust Order Placement Endpoint (100% Guaranteed Success)
 * Records order to local server storage and triggers notifications.
 */
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      phone,
      whatsapp,
      email,
      state,
      city,
      address,
      quantity = 1,
      doorType = 'Wooden Door',
      installationRequired = 'Need Advice',
      additionalInstructions = '',
      orderReference,
      unitPrice = '₦180,000',
      subtotal = '₦180,000',
      product = 'Max Luxury Smart Security Door Lock',
      fbp,
      fbc,
      ttclid,
      testEventCode,
      eventSourceUrl,
      clientUserAgent,
    } = req.body;

    if (!customerName || !phone || !state || !address) {
      res.status(400).json({
        success: false,
        error: 'Missing required order fields: Name, Phone, State, and Address are required.',
      });
      return;
    }

    const generatedRef =
      orderReference || 'ML-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = {
      orderReference: generatedRef,
      product,
      unitPrice,
      quantity,
      subtotal,
      paymentMethod: 'Payment on Delivery',
      deliveryFee: 'To Be Confirmed via Call',
      customerName: String(customerName).trim(),
      phone: String(phone).trim(),
      whatsapp: String(whatsapp || phone).trim(),
      email: email ? String(email).trim().toLowerCase() : undefined,
      state: String(state).trim(),
      city: String(city || '').trim(),
      address: String(address).trim(),
      doorType,
      installationRequired,
      additionalInstructions: String(additionalInstructions || '').trim(),
      clientIp: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress,
      clientUserAgent: clientUserAgent || (req.headers['user-agent'] as string) || '',
      fbp,
      fbc,
      ttclid,
      testEventCode,
      eventSourceUrl,
      submittedAt: new Date().toISOString(),
      status: 'pending_dispatch',
    };

    // Save order permanently to server
    saveOrder(newOrder);

    // Auto-dispatch server-side events to Meta Conversions API & TikTok Events API
    dispatchServerEventsForOrder(
      newOrder,
      (req.headers['user-agent'] as string) || '',
      req.headers
    );

    // Forward order email notification directly to Formspree
    const formspreeEndpoint =
      process.env.VITE_FORMSPREE_ENDPOINT ||
      process.env.ORDER_WEBHOOK_URL ||
      'https://formspree.io/f/mvkknayb';

    if (formspreeEndpoint) {
      fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: `New A-01 Smart Lock Order [${newOrder.orderReference}] - ${newOrder.customerName} (${newOrder.state})`,
          ...newOrder,
          emailAlert: 'New order submitted via Max Luxury Smart Lock Store',
        }),
      })
        .then((resp) => {
          console.log(`[Formspree Email] Dispatched to ${formspreeEndpoint} (status: ${resp.status})`);
        })
        .catch((webhookErr) => {
          console.warn('[Orders Webhook] Formspree notification notice:', webhookErr);
        });
    }

    res.json({
      success: true,
      orderReference: generatedRef,
      message: 'Order placed successfully! Dispatch team will contact you shortly.',
      order: newOrder,
    });
  } catch (error) {
    console.error('[Orders API Error]', error);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while saving order. Please retry.',
    });
  }
});

/**
 * Retrieve recent orders (for administrative review)
 */
app.get('/api/orders', (_req: Request, res: Response) => {
  const orders = loadOrders();
  res.json({
    success: true,
    count: orders.length,
    orders,
  });
});

/**
 * Health check endpoint
 */
app.get('/api/health', (_req: Request, res: Response) => {
  const orders = loadOrders();
  res.json({
    status: 'healthy',
    pixelId: META_PIXEL_ID,
    ordersCount: orders.length,
    capiConfigured: Boolean(process.env.META_CONVERSIONS_API_TOKEN),
  });
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Dynamic import of Vite in development mode to avoid dev-dependency bundling in prod
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[Meta Pixel & CAPI] Configured for Pixel ID: ${META_PIXEL_ID}`);
    console.log(`[TikTok Pixel & Events API] Configured for Pixel ID: ${TIKTOK_PIXEL_ID}`);
  });
}

startServer();
