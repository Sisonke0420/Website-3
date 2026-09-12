# Peak Performance Backend Requirements

This project is currently a front-end demo. The cart is stored in `localStorage`, the contact form only shows a demo success state, and checkout never sends or stores payment details.

## Commerce

- Product catalog API with product IDs, names, descriptions, prices, images, categories, variants, sizes, colors, stock, and active status.
- Product detail API that supports the six current products and future additions.
- Cart API or server-side checkout session so carts can be restored across devices.
- Server-side price and inventory validation before an order is created.
- Tax and shipping calculation by destination, service level, and order value.
- Promotions, discount codes, free-shipping thresholds, and gift cards if needed.
- Order creation with immutable line items, totals, currency, customer, shipping address, and status history.
- Order confirmation email and shipment/tracking updates.

## Payments

- Use a PCI-compliant provider such as Stripe Checkout or Payment Intents.
- Never send raw card numbers, CVCs, or payment credentials to this application server.
- Verify payment webhooks server-side before marking an order paid.
- Handle failed, canceled, refunded, partially refunded, and disputed payments.
- Store provider payment IDs and safe metadata, never sensitive card data.

## Customer and Support

- Contact form endpoint with server-side validation, spam protection, rate limiting, and notification delivery.
- Optional customer accounts with email verification, password reset, order history, and account deletion.
- Order lookup using a secure order token or authenticated account.
- Support/FAQ content management or a stable content source.
- Newsletter consent capture with unsubscribe support and consent timestamps.

## Admin and Operations

- Protected admin interface or operations API for products, inventory, orders, returns, refunds, and customer messages.
- Role-based access control and audit logging.
- Inventory reservation and low-stock handling to prevent overselling.
- Return merchandise authorization flow and refund status tracking.
- Shipping label and carrier integration if fulfillment is automated.

## Security and Compliance

- HTTPS everywhere, secure cookies, CSRF protection where applicable, input validation, output encoding, and security headers.
- Secrets stored in environment variables or a managed secret store.
- Request logging with sensitive data redaction, monitoring, alerting, backups, and recovery procedures.
- Privacy, terms, shipping, returns, warranty, cookie, and marketing-consent policies reviewed for the operating region.
- Data retention, export, correction, and deletion workflows.
- Accessibility and consent requirements tested in the final checkout and account flows.

## Suggested API Surface

- `GET /api/products`
- `GET /api/products/:productId`
- `POST /api/checkout/session`
- `POST /api/payments/webhook`
- `GET /api/orders/:orderToken`
- `POST /api/contact`
- `POST /api/newsletter/subscribe`
- `POST /api/returns`

## Production Readiness Checklist

- Choose hosting, database, payment provider, email provider, analytics, and error monitoring.
- Define product, cart, order, payment, customer, return, and support-message schemas.
- Add automated tests for pricing, inventory, checkout, webhook idempotency, contact submission, and authorization.
- Add end-to-end tests for product selection through order confirmation.
- Configure staging and production environments with separate keys and data.
- Replace the demo copy and placeholder contact details with approved business information.
