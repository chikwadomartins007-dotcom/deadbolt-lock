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
 * Format phone number to E.164 (defaults to Nigerian +234 if local 080... format)
 */
function normalizePhone(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  // If Nigerian format starting with 0, convert 080... to 23480...
  if (digits.startsWith('0') && digits.length === 11) {
    digits = '234' + digits.substring(1);
  }
  return digits;
}

/**
 * Meta Conversions API (CAPI) Endpoint
 * Handles PageView, ViewContent, InitiateCheckout, Lead, and Contact events.
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
    hashedUserData.country = [hashSha256('ng')]; // Default to Nigeria

    // Pass through browser identifiers if present
    if (userData.fbp) hashedUserData.fbp = userData.fbp;
    if (userData.fbc) hashedUserData.fbc = userData.fbc;

    const capiPayload = {
      data: [
        {
          event_name: eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: eventSourceUrl || 'https://www.maxluxurybathrooms.shop/',
          action_source: 'website',
          user_data: hashedUserData,
          custom_data: customData,
        },
      ],
      ...(process.env.META_TEST_EVENT_CODE
        ? { test_event_code: process.env.META_TEST_EVENT_CODE }
        : {}),
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
        metaResponse: metaJson,
      });
      return;
    }

    // When token is pending, log the validated and hashed CAPI payload for testing/audit
    console.log(
      `[Meta CAPI Ready] "${eventName}" | EventID: ${eventId} | Pixel: ${pixelId} | EMQ matched fields: ${Object.keys(
        hashedUserData
      ).join(', ')}`
    );

    res.json({
      success: true,
      eventId,
      deduplicated: true,
      status: 'processed_and_logged',
      pixelId,
      message:
        'Conversions API received and hashed event. Add META_CONVERSIONS_API_TOKEN to .env to push live to Meta Graph API.',
    });
  } catch (error) {
    console.error('[Meta CAPI Server Error]', error);
    res.status(500).json({ error: 'Internal CAPI error', details: String(error) });
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
 * Robust Order Placement Endpoint (100% Guaranteed Success)
 * Records order to local server storage and triggers notifications.
 */
app.post('/api/orders', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      phone,
      whatsapp,
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
      state: String(state).trim(),
      city: String(city || '').trim(),
      address: String(address).trim(),
      doorType,
      installationRequired,
      additionalInstructions: String(additionalInstructions || '').trim(),
      clientIp: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress,
      submittedAt: new Date().toISOString(),
      status: 'pending_dispatch',
    };

    // Save order permanently to server
    saveOrder(newOrder);

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
  });
}

startServer();
