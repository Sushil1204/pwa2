# Fixora — Product Requirements & MVP Specification

<!-- impeccable:product-schema 1 -->

**Product:** Fixora  
**Product type:** Repair-services marketplace and installable Progressive Web App (PWA)  
**Initial market:** India  
**Frontend:** Next.js, React, TypeScript  
**Backend:** Node.js, NestJS, TypeScript  
**Database:** PostgreSQL  
**ORM:** Prisma  
**API style:** Versioned REST API  
**Document status:** MVP product specification

---

## Platform

web

## Positioning

Fixora combines three claims a neighboring marketplace (Urban Company, Sulekha, JustDial) cannot truthfully copy at once:

1. **Verified trust.** Every technician is verified and admin-approved before receiving jobs; job evidence photos, warranty terms, and one-review-per-completed-booking make trust demonstrable rather than claimed.
2. **Transparent pricing.** The full breakdown — service price, inspection fee, taxes, fees, discounts, totals — is shown before payment, and no chargeable additional work may proceed until the customer explicitly approves an itemized quotation.
3. **Speed to fix.** Time-to-assign and slot availability are first-class product metrics; the booking pipeline, availability validation, and assignment flow are engineered for fast technician assignment and same-day slots.

## Operating Context

- **Market:** India; currency INR stored in integer paise; Razorpay gateway; serviceability by PIN code / service zones.
- **Customers:** on mobile phones, often in a hurry, on variable networks — mobile-first PWA with an installable app shell and safe offline caching.
- **Technicians:** in the field between visits, on low-end devices — short accept/reject windows, map links, status transitions, and evidence upload from the job site.
- **Admin & support:** at desktops — dense tables, filters, approval queues, audit logging.
- **Channels:** OTP over SMS; in-app, web push, SMS, and email notifications via BullMQ workers; UTC timestamps server-side.
- **Delivery:** Docker; Next.js frontend and NestJS backend independently deployable behind a versioned REST API (`/api/v1`) reusable by future native apps.

## Evidence on Hand

Greenfield. The only artifacts that exist today are this specification and `DESIGN.md` (the token/component system).

- No logo, brand photography, service imagery, or illustrations exist yet.
- No testimonials, case studies, press, or customer references exist.
- No real usage, traction, or benchmark numbers exist.

Future work must not fabricate any of the above; illustrative content authored for demos must be labeled synthetic and handed to the user as a replacement list.

## Product Principles

1. **Protect the customer first.** Show the full price and terms before payment; never allow chargeable extra work without recorded customer approval.
2. **The backend owns money and state transitions.** Every rupee and every booking status change is validated server-side, authorized, and auditable — the frontend never computes truth.
3. **Trust is verified, never claimed.** Verification, completion evidence, and honest reviews earn it; nothing on the surface asserts trust it cannot show.
4. **Mobile-first, weak-network ready.** The shell and public content work on cheap phones and flaky connections; transactions require the network and fail loudly.

---

## 1. Product overview

Fixora is a mobile-first repair-services marketplace that connects customers who need home, appliance, electrical, plumbing, and device repairs with verified technicians.

The product consists of three primary portals:

1. **Customer marketplace:** Discover services, request repairs, book appointments, pay, track jobs, and review completed work.
2. **Technician portal:** Complete onboarding, manage availability, receive and manage jobs, submit quotations, update job progress, and view earnings.
3. **Admin portal:** Manage users, technicians, services, bookings, pricing, commissions, payments, disputes, and platform operations.

The web application must be responsive and installable as a PWA. Backend APIs must be reusable by future native mobile applications.

## 2. Product goals

- Make it easy for customers to find and book reliable repair services.
- Help technicians receive and manage jobs efficiently.
- Give customers transparent booking, pricing, and job-progress information.
- Give Fixora operational control over technician verification and service quality.
- Support secure payments, refunds, commissions, and technician settlements.
- Establish a reusable API platform for future Android and iOS apps.

### 2.1 MVP success measures

Track at minimum:

- Booking conversion rate.
- Technician acceptance rate.
- Job completion rate.
- Booking cancellation rate.
- Average booking value.
- Repeat customer rate.
- Average time to assign a technician.
- Average customer rating.
- Technician utilization.
- Platform commission revenue.

## 3. User roles and permissions

| Role | Responsibilities |
|---|---|
| Customer | Manage profile and addresses; discover services; create and manage own bookings; pay; review eligible completed jobs; raise support requests. |
| Technician | Manage own profile and availability; submit verification documents; view and manage assigned jobs; submit repair quotations; update job progress; view own earnings. |
| Support agent | Access assigned support cases and the minimum booking/customer information needed to resolve them. |
| Admin | Manage users, technicians, services, bookings, pricing, commissions, payments, refunds, and disputes according to permissions. |
| Super admin | Manage platform settings, administrator permissions, and sensitive operational controls. |

Use permission-based authorization in addition to role checks. Every API must enforce authorization and resource ownership on the backend.

## 4. Recommended technology architecture

### 4.1 Stack

| Layer | Technology |
|---|---|
| Web application and PWA | Next.js App Router, React, TypeScript |
| UI | Tailwind CSS, shadcn/ui |
| Backend | Node.js, NestJS, TypeScript |
| API | REST, OpenAPI/Swagger |
| Database | PostgreSQL |
| ORM and migrations | Prisma |
| Cache and queues | Redis, BullMQ |
| Authentication | Server-side sessions with secure cookies |
| File storage | Private AWS S3 or Cloudflare R2 buckets |
| Payments | Razorpay for India; provider abstraction where practical |
| Push notifications | Web Push / Firebase Cloud Messaging |
| Email | Resend or Amazon SES |
| Maps and geocoding | Google Maps Platform or equivalent |
| Testing | Jest, Supertest, Playwright, k6 |
| Deployment | Docker; AWS or equivalent cloud infrastructure |
| Monorepo | pnpm with Turborepo or Nx |

### 4.2 Architecture principles

- Keep the Next.js frontend and NestJS backend independently deployable.
- Make the backend the source of truth for business rules and permissions.
- Version APIs from the first release: `/api/v1`.
- Share TypeScript types and validation schemas where appropriate.
- Use asynchronous queues for notifications and other retryable work.
- Keep payment, booking, and financial records transaction-safe.
- Design APIs for use by both the PWA and future native mobile clients.

### 4.3 High-level architecture

```text
Customer PWA       Technician PWA       Admin Web
      \                  |                  /
       \                 |                 /
             Next.js frontend
                    |
             HTTPS REST API
                    |
             NestJS backend
                    |
       --------------------------------
       |              |               |
   PostgreSQL       Redis        Object storage
                    |
              BullMQ workers
                    |
       Payments / SMS / Email / Push
```

## 5. Customer marketplace requirements

### 5.1 Registration and authentication

**MVP requirements:**

- Mobile number registration and OTP verification.
- Login using verified mobile number and the selected authentication method.
- Optional email address and email verification.
- Customer profile: name, phone, email.
- Secure logout.
- View and revoke active sessions.
- Password recovery if password login is enabled.
- Account deletion request and associated data-rights workflow.

**Security requirements:**

- OTP generated using a cryptographically secure random generator.
- OTP expires after approximately five minutes; make the value configurable.
- Limit OTP attempts, resend frequency, and requests by account, phone number, device, and IP.
- Do not reveal whether an account exists in authentication error messages.
- Store only a protected representation of OTP/session secrets.
- Use `HttpOnly`, `Secure`, and appropriate `SameSite` cookie settings.
- Rotate session identifiers after authentication and privilege changes.

### 5.2 Service discovery

Initial categories may include:

- AC repair and servicing.
- Electrical repairs.
- Plumbing.
- Appliance repair.
- Mobile and device repair.
- Other household and device repairs.

Customers must be able to:

- Browse categories and subcategories.
- Search by service name and keywords.
- View service descriptions and images.
- Check whether a service is available in their PIN code or service area.
- Filter by price, rating, and availability where data exists.
- View popular or featured services.

Admin users must be able to manage categories, services, descriptions, images, availability, and pricing.

### 5.3 Service details and pricing

A service detail page should display:

- Service name, category, and description.
- What is included and excluded.
- Fixed price, starting price, or inspection fee as applicable.
- Estimated duration.
- Additional charge policy.
- Cancellation policy.
- Warranty terms, if offered.
- Customer ratings and reviews.

Support a hybrid pricing model:

| Pricing model | Example |
|---|---|
| Fixed | Fan installation — fixed service price |
| Starting from | AC repair — price from a stated amount |
| Inspection fee | Technician visit or diagnosis fee |
| Custom quotation | Major repair requiring inspection |

All prices must be stored in integer minor currency units (paise for INR), not floating-point values. Show taxes, fees, discounts, and totals clearly before the customer confirms payment.

### 5.4 Address management

Customers can:

- Add, edit, select, and delete saved addresses, subject to retention rules.
- Set a default address.
- Enter address line, locality, city, state, PIN code, and optional location coordinates.
- Add access instructions where needed.

Validate serviceability using configured PIN codes, service zones, or geographical coverage. Do not expose a customer's full address to technicians who are not assigned to the relevant booking.

### 5.5 Booking flow

Recommended flow:

1. Customer selects a service.
2. Customer selects or adds a service address.
3. Customer selects a preferred date and available time slot.
4. Customer describes the issue and can attach photos.
5. System displays the estimated price and applicable fees.
6. Customer reviews cancellation and service terms.
7. Customer selects an available payment method.
8. Backend creates the booking and payment attempt as appropriate.
9. Customer receives confirmation and booking reference.
10. Fixora assigns a suitable technician.
11. Customer receives assignment and job-progress updates.

A booking record should include:

- Unique booking reference.
- Customer and service references.
- Service address snapshot.
- Scheduled date and time window.
- Issue description and attachments.
- Assigned technician, if allocated.
- Price breakdown and currency.
- Booking status and payment status.
- Cancellation details.
- Creation and update timestamps.

Use a snapshot of relevant service and address details so later edits do not silently rewrite historical booking information.

### 5.6 Customer dashboard

Screens and features:

- Overview of upcoming and recent bookings.
- Booking list with status and date filters.
- Booking detail and status history.
- Assigned technician information, subject to access rules.
- Payment history and receipts.
- Saved addresses.
- Reviews for eligible completed bookings.
- Support requests and disputes.
- Profile and session management.

### 5.7 Reviews

- Only customers associated with eligible completed bookings can submit a review.
- Enforce one review per eligible booking unless an explicit edit policy is adopted.
- Support rating and written feedback.
- Provide moderation and reporting tools.
- Do not allow technicians or administrators to impersonate customers when submitting reviews.

## 6. Technician portal requirements

### 6.1 Technician onboarding and verification

Collect only information necessary for the service and legal requirements:

- Name and contact details.
- Profile photograph.
- Skills and service categories.
- Experience.
- Service PIN codes or coverage areas.
- Working hours and availability.
- Required identity or qualification documents.
- Bank/payout details when settlements are enabled.

Technician accounts must remain unable to receive customer jobs until required verification and admin approval are complete.

Store identity documents in private object storage. Restrict access to authorized verification staff and use short-lived signed download links.

### 6.2 Job management

Technicians must be able to:

- View incoming or assigned jobs.
- Accept or reject a job within the configured response window.
- View the service description and relevant customer information.
- View the service address only when authorized.
- Open navigation using a maps link.
- Update job progress through permitted status transitions.
- Add job notes.
- Upload before-and-after photos or other job evidence.
- Submit inspection findings.
- Submit an additional-work quotation.
- Mark work complete with required completion evidence.

### 6.3 Additional quotations

If the initial service price does not cover the required repair:

1. Technician submits itemized work, parts, labour, and applicable charges.
2. Backend records the quotation and its expiry.
3. Customer is notified.
4. Customer explicitly approves or rejects the quotation.
5. Technician cannot perform chargeable additional work under the quotation until approval is recorded, except where a separately documented emergency policy applies.
6. All quote revisions and decisions are retained.

### 6.4 Availability

- Online/offline availability toggle.
- Weekly working hours.
- Service coverage areas.
- Leave and holiday settings.
- Configurable maximum active jobs.
- Availability validation during assignment.

### 6.5 Earnings

Technician dashboard should show:

- Completed jobs.
- Gross job value.
- Platform commission and other deductions.
- Net payable amount.
- Pending settlement.
- Paid settlements.
- Payout history and status.

Do not calculate technician earnings only in the frontend. Use server-side financial records and a ledger or equivalent auditable accounting model.

## 7. Admin portal requirements

### 7.1 Dashboard

Display:

- Total customers.
- Total technicians and pending approvals.
- Total, pending, confirmed, completed, and cancelled bookings.
- Gross booking value.
- Platform commission.
- Payment failures and pending refunds.
- Pending technician payouts.
- Open support tickets and disputes.

Metrics must have date filters and clearly defined calculation rules.

### 7.2 User management

- Search and filter customers and technicians.
- View profiles and relevant activity.
- Approve or reject technician onboarding.
- Suspend or reactivate accounts with a recorded reason.
- Review verification documents with restricted access.
- Handle account complaints and deletion requests.
- View security-relevant audit history where authorized.

### 7.3 Service management

- Create, edit, publish, unpublish, and archive categories.
- Create and edit services and subcategories.
- Upload service images.
- Configure pricing model, price, inspection fee, and duration.
- Configure service areas and availability.
- Configure cancellation and warranty terms.
- Configure taxes and fees in accordance with reviewed business rules.

### 7.4 Booking management

- Search by booking reference, customer, technician, date, and status.
- View booking details and status history.
- Assign or reassign technicians.
- Cancel bookings with reason.
- Review job evidence and quotations.
- Review payment and refund status.
- Handle disputes and exceptional cases.

### 7.5 Commission and payouts

- Configure commission by service category or technician agreement.
- Maintain effective dates for commission changes.
- Show the customer charge, taxes/fees, platform commission, and technician payable amount separately.
- Track payout batches, payout references, failures, and reconciliation.
- Require elevated permission and audit logging for sensitive financial actions.

### 7.6 Support and disputes

- Create and assign support tickets.
- Link tickets to bookings and users.
- Record customer and technician messages.
- Add internal notes not visible to customers.
- Track status, priority, owner, and resolution.
- Review evidence and record dispute outcomes.
- Record refund or adjustment decisions with the responsible administrator.

## 8. Booking lifecycle and state machine

Use explicit backend-enforced transitions. Suggested states:

```text
PENDING
  -> CONFIRMED
  -> TECHNICIAN_ASSIGNED
  -> ON_THE_WAY
  -> ARRIVED
  -> IN_PROGRESS
  -> AWAITING_CUSTOMER_APPROVAL (optional)
  -> IN_PROGRESS
  -> COMPLETED

Alternative terminal or exception states:
CANCELLED
REJECTED
EXPIRED
DISPUTED
```

The exact transition graph must be defined before implementation. For example, a booking cannot move from `PENDING` directly to `COMPLETED`.

For every transition, store:

- Booking ID.
- Previous and new status.
- Actor ID and actor role.
- Timestamp.
- Reason or note where relevant.
- Request or correlation ID.

Do not let the client submit arbitrary status strings. Validate transitions and actor permissions in a domain service.

## 9. Payments and financial workflows

### 9.1 Payment provider

Use Razorpay as the initial India-focused gateway, subject to merchant onboarding and provider terms. Keep a payment-provider abstraction so another provider can be added later.

### 9.2 Payment flow

1. Frontend requests a payment order from Fixora's backend.
2. Backend validates booking, amount, currency, and payment eligibility.
3. Backend creates an order with the gateway and stores the order reference.
4. Customer completes checkout using the gateway.
5. Frontend sends the returned payment details to the backend.
6. Backend verifies the gateway signature.
7. Gateway webhook is independently verified and processed.
8. Payment state is updated idempotently.
9. Booking payment state is updated according to the defined business rules.
10. Customer receives a receipt or payment confirmation.

A frontend success callback is not proof of payment. The backend must verify signatures and reconcile webhook events.

### 9.3 Payment requirements

- Never store card numbers, CVV, or raw payment credentials.
- Verify webhook signatures using the raw request body as required by the gateway.
- Make webhook processing idempotent.
- Persist gateway event identifiers and processing results.
- Handle duplicate, delayed, and out-of-order events.
- Use idempotency keys for payment-order creation where supported.
- Maintain payment attempts and immutable payment event history.
- Implement refund initiation, status tracking, and reconciliation.
- Reconcile internal transactions with gateway reports.

### 9.4 Financial separation

Keep these concepts separate:

- Customer payment.
- Taxes and other applicable charges.
- Platform commission.
- Technician payable amount.
- Refunds and adjustments.
- Technician payout/settlement.

A successful customer payment does not automatically mean that a technician has been paid. Payouts should be a separate, auditable workflow.

## 10. Notifications

### 10.1 Events

Notify relevant parties for:

- Booking created.
- Technician assigned.
- Job accepted or rejected.
- Technician on the way.
- Technician arrived.
- Job started.
- Additional quotation submitted.
- Quotation approved or rejected.
- Job completed.
- Booking cancelled.
- Payment succeeded or failed.
- Refund initiated or completed.
- Support ticket or dispute updates.

### 10.2 Channels

- In-app notifications.
- Web push notifications.
- SMS.
- Email.
- WhatsApp only if enabled through an approved provider and applicable consent/compliance requirements.

Use BullMQ workers for asynchronous delivery, retries, backoff, and dead-letter handling. Avoid including sensitive personal or payment information in notification previews.

## 11. PWA requirements

### 11.1 Installability

- Valid web app manifest.
- App name, short name, theme color, background color, and display mode.
- 192×192 and 512×512 icons, including maskable icon where appropriate.
- HTTPS in production.
- Service worker registered and maintained.
- Install experience tested on supported browsers and devices.

### 11.2 Offline behaviour

Available offline, where safely cached:

- Application shell and static assets.
- Public service/category content.
- A custom offline fallback page.
- Non-sensitive drafts such as an unsubmitted repair description.

Online connection required for:

- Booking creation and confirmation.
- Payment processing.
- Technician acceptance.
- Job status changes.
- Live availability and tracking.
- Fetching current account and booking data.

Do not cache authentication responses, payment details, identity documents, or private customer data in a general service-worker cache. Any offline storage of private data must have a documented threat model, explicit scope, and safe invalidation strategy.

### 11.3 PWA update strategy

- Version cached assets.
- Remove obsolete caches on activation.
- Avoid serving stale API data for sensitive or transactional operations.
- Notify users when an application update is available.
- Test update and rollback behaviour.

## 12. API specification

Base URL:

```text
https://api.fixora.com/api/v1
```

### 12.1 Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register account |
| POST | `/auth/send-otp` | Request OTP |
| POST | `/auth/verify-otp` | Verify OTP |
| POST | `/auth/login` | Authenticate |
| POST | `/auth/logout` | End session |
| GET | `/auth/me` | Current user |
| GET | `/auth/sessions` | List own sessions |
| DELETE | `/auth/sessions/:id` | Revoke own session |

### 12.2 Customer

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/categories` | List categories |
| GET | `/services` | Search/list services |
| GET | `/services/:id` | Service detail |
| GET | `/technicians` | Discover eligible technicians, if exposed |
| GET/POST | `/addresses` | List/create addresses |
| PATCH/DELETE | `/addresses/:id` | Update/delete address |
| POST | `/bookings` | Create booking |
| GET | `/bookings` | List own bookings |
| GET | `/bookings/:id` | Get own booking |
| POST | `/bookings/:id/cancel` | Request cancellation |
| POST | `/bookings/:id/reviews` | Submit eligible review |

### 12.3 Technician

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/technician/profile` | Own technician profile |
| PATCH | `/technician/profile` | Update allowed profile fields |
| GET | `/technician/jobs` | List own assigned jobs |
| POST | `/technician/jobs/:id/accept` | Accept eligible job |
| POST | `/technician/jobs/:id/reject` | Reject eligible job |
| POST | `/technician/jobs/:id/status` | Update permitted status |
| POST | `/technician/jobs/:id/quotes` | Submit additional quote |
| GET | `/technician/availability` | View availability |
| PUT | `/technician/availability` | Update availability |
| GET | `/technician/earnings` | View own earnings |

### 12.4 Admin

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/admin/dashboard` | Platform metrics |
| GET | `/admin/users` | Search users |
| PATCH | `/admin/users/:id/status` | Suspend/reactivate |
| GET | `/admin/technicians/pending` | Pending approvals |
| POST | `/admin/technicians/:id/approve` | Approve technician |
| POST | `/admin/technicians/:id/reject` | Reject technician |
| POST | `/admin/bookings/:id/assign` | Assign technician |
| GET/POST | `/admin/services` | List/create services |
| PATCH/DELETE | `/admin/services/:id` | Update/archive service |
| GET | `/admin/payments` | Payment records |
| GET | `/admin/disputes` | Dispute queue |

### 12.5 Payments and webhooks

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/payments/create-order` | Create gateway order |
| POST | `/payments/verify` | Verify checkout result |
| GET | `/payments/:id` | View authorized payment |
| POST | `/payments/:id/refund` | Initiate authorized refund |
| POST | `/webhooks/razorpay` | Receive gateway events |

### 12.6 API conventions

- Use DTO validation and strict schema validation.
- Use consistent error response formats.
- Use cursor or page-based pagination with documented limits.
- Add filtering and sorting allowlists.
- Add request IDs and structured logs.
- Use idempotency keys for critical create operations.
- Document APIs with OpenAPI.
- Never expose internal database entities without an explicit response DTO.
- Apply rate limits by route sensitivity and actor.
- Enforce authorization and object ownership on every protected resource.

## 13. PostgreSQL data model

The following is the proposed logical table set. Final columns, constraints, and indexes should be captured in Prisma schema and reviewed before migrations.

| Table | Purpose |
|---|---|
| `users` | Shared user identity and account status |
| `roles` | Role definitions |
| `user_roles` | User-role assignments |
| `customer_profiles` | Customer-specific profile data |
| `technician_profiles` | Technician-specific profile and approval status |
| `technician_documents` | Private verification document metadata |
| `technician_services` | Technician skill/service mapping |
| `technician_areas` | Technician service coverage |
| `addresses` | Customer service addresses |
| `categories` | Service categories |
| `services` | Service catalogue |
| `service_prices` | Effective-dated service pricing |
| `bookings` | Booking aggregate |
| `booking_items` | Price and work line items |
| `booking_assignments` | Technician assignment history |
| `booking_status_history` | Auditable status transitions |
| `job_quotes` | Additional repair quotations |
| `job_attachments` | Job evidence and file metadata |
| `payments` | Payment attempts and status |
| `payment_events` | Gateway event history |
| `refunds` | Refund records |
| `financial_ledger_entries` | Auditable financial movements |
| `technician_payouts` | Technician settlement records |
| `reviews` | Customer reviews |
| `notifications` | Notification records |
| `support_tickets` | Customer/technician support |
| `disputes` | Booking disputes |
| `user_sessions` | Server-side sessions |
| `audit_logs` | Security and administrative audit trail |

### 13.1 Database rules

- Use UUID primary keys.
- Store timestamps in UTC.
- Store money as integer minor units (INR paise).
- Use foreign keys and appropriate unique constraints.
- Use database transactions for booking assignment and payment state changes.
- Add indexes based on measured query patterns.
- Retain financial and audit records according to the approved retention schedule.
- Use soft deletion only where it fits the record's lifecycle; do not use it as a substitute for a retention policy.
- Keep historical price, address, and service snapshots on bookings.

Suggested indexes:

```sql
CREATE INDEX idx_bookings_customer_created
ON bookings(customer_id, created_at DESC);

CREATE INDEX idx_bookings_status_schedule
ON bookings(status, scheduled_at);

CREATE INDEX idx_assignments_technician_status
ON booking_assignments(technician_id, status);

CREATE INDEX idx_payments_booking
ON payments(booking_id);

CREATE INDEX idx_services_category_active
ON services(category_id, is_active);
```

For radius-based technician discovery, evaluate PostGIS and appropriate spatial indexes.

### 13.2 Concurrency and consistency

- Use transactions and row-level locking where concurrent assignment could conflict.
- Enforce one active assignment where required using database constraints or a transaction-safe domain rule.
- Use idempotency keys for booking and payment creation.
- Prevent duplicate webhook effects with unique gateway event identifiers.
- Ensure booking, payment, and payout state changes are auditable.
- Use an outbox pattern or equivalent reliable event publication strategy when database changes must trigger background jobs.

## 14. Production security requirements

Security is a launch requirement, not a later enhancement.

### 14.1 Authentication and sessions

- Hash passwords with Argon2id if password authentication is enabled.
- Use cryptographically secure OTP generation.
- Expire OTPs and enforce attempt/resend limits.
- Use secure, HTTP-only cookies with appropriate SameSite settings.
- Rotate session identifiers after login and privilege changes.
- Support session revocation and logout.
- Require MFA for admin and privileged support accounts.
- Apply rate limits to login, OTP, password recovery, and sensitive actions.

### 14.2 Authorization and privacy

- Enforce RBAC and resource ownership on the backend.
- Prevent IDOR/BOLA by checking access to each requested object.
- Restrict technicians to assigned jobs and necessary customer information.
- Restrict support agents to assigned cases.
- Restrict identity documents to authorized verification staff.
- Mask bank and sensitive personal details in dashboards and logs.
- Avoid exposing secrets or personal data in URLs, analytics, and notification previews.
- Record sensitive document access and privileged administrative actions.

### 14.3 API and application security

- HTTPS only in production.
- Strict CORS allowlist.
- CSRF protection for cookie-authenticated state-changing requests.
- Validate and normalize all input.
- Use parameterized database queries through Prisma.
- Apply output encoding and safe rendering to prevent XSS.
- Set secure HTTP headers and a suitable Content Security Policy.
- Limit request body and upload sizes.
- Validate file type, content, and size; do not trust file extensions.
- Scan uploaded files where practical.
- Protect against SSRF in any feature that fetches remote URLs.
- Avoid detailed stack traces and internal error information in production responses.
- Keep dependencies patched and scan for known vulnerabilities.

### 14.4 Infrastructure and operations

- Keep PostgreSQL and Redis on private networks.
- Encrypt data in transit and at rest.
- Store secrets in a managed secret store.
- Use private object-storage buckets.
- Enable encrypted backups and test restoration.
- Separate development, staging, and production environments.
- Use least-privilege service accounts and database users.
- Centralize logs, metrics, and error monitoring.
- Configure alerts for payment failures, webhook errors, unusual authentication activity, and service outages.
- Maintain an incident response and credential rotation process.
- Use CI checks for tests, linting, dependency scanning, and secret detection.

### 14.5 Indian legal and compliance workstream

Before launch, obtain India-specific legal and tax advice covering:

- Digital Personal Data Protection Act, 2023 and applicable rules, including notices, consent where applicable, purpose limitation, data rights, retention, and security obligations.
- Consumer Protection (E-Commerce) Rules, 2020 and marketplace disclosures, grievance handling, cancellation/refund policies, and service-provider information.
- Payment provider requirements and applicable payment regulations.
- GST registration, invoicing, tax collection, and marketplace obligations.
- Privacy policy, terms of service, cancellation policy, refund policy, and technician terms.
- Grievance redressal process and responsible contact.

This checklist is not a legal compliance certification. Applicability and current requirements must be confirmed with qualified counsel and tax professionals.

## 15. Suggested monorepo structure

```text
fixora/
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── (customer)/
│   │   │   ├── (technician)/
│   │   │   ├── (admin)/
│   │   │   ├── auth/
│   │   │   └── offline/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── public/
│   └── api/
│       └── src/
│           ├── auth/
│           ├── users/
│           ├── customers/
│           ├── technicians/
│           ├── services/
│           ├── bookings/
│           ├── payments/
│           ├── notifications/
│           ├── reviews/
│           ├── support/
│           └── admin/
├── packages/
│   ├── database/
│   ├── shared-types/
│   ├── validation/
│   └── api-client/
├── infrastructure/
│   ├── docker/
│   ├── deployment/
│   └── monitoring/
├── docs/
│   ├── api/
│   ├── architecture/
│   └── security/
├── docker-compose.yml
├── package.json
└── pnpm-workspace.yaml
```

## 16. Delivery plan

Indicative target: **12–14 weeks** for a small, experienced team, assuming timely design decisions, provider onboarding, and feedback.

| Phase | Target | Deliverables |
|---|---|---|
| Foundation | Weeks 1–2 | Requirements, wireframes, architecture, database schema, CI/CD, auth foundation |
| Customer marketplace | Weeks 3–4 | Customer registration, catalogue, search, addresses, booking creation |
| Technician portal | Weeks 5–6 | Technician onboarding, verification, jobs, availability, status updates |
| Admin portal | Weeks 7–8 | User, technician, service, booking, and commission management |
| Payments and notifications | Weeks 9–10 | Gateway integration, webhook verification, refunds, email/SMS/push |
| PWA and security | Weeks 11–12 | Manifest, service worker, offline shell, security and performance testing |
| QA and launch | Weeks 13–14 | E2E tests, reconciliation tests, UAT, deployment, monitoring, launch |

### Suggested team

- 1 technical lead/full-stack developer.
- 1 frontend developer.
- 1 backend developer.
- 1 UI/UX designer.
- 1 QA engineer.
- Part-time DevOps support.

Team size and timeline should be adjusted based on scope, integration complexity, and delivery expectations.

## 17. Testing strategy

### Functional tests

- Customer registration and authentication.
- Technician registration and approval.
- Service search and serviceability.
- Booking creation and duplicate-request handling.
- Technician assignment under concurrent requests.
- Job acceptance, rejection, and status transitions.
- Additional quote approval/rejection.
- Payment success, failure, retry, and duplicate webhook handling.
- Cancellation and refund workflows.
- Completion evidence and review eligibility.
- Admin permissions and audit logs.

### Security tests

- Authentication bypass.
- Unauthorized resource access and IDOR/BOLA.
- Privilege escalation.
- SQL injection.
- XSS and CSRF.
- OTP brute force and enumeration.
- Session fixation and hijacking.
- Webhook signature failure and replay.
- Malicious file uploads.
- Rate-limit bypass.
- Sensitive data leakage in logs and responses.

### Recommended tools

| Purpose | Tool |
|---|---|
| Unit tests | Jest |
| API integration tests | Supertest |
| UI tests | React Testing Library |
| End-to-end tests | Playwright |
| Load tests | k6 |
| Dependency scanning | Dependabot or equivalent |
| Dynamic security testing | OWASP ZAP |
| Error monitoring | Sentry |

## 18. MVP prioritization

### P0 — Required for first release

- Customer registration and authentication.
- Service categories, catalogue, and service details.
- Address management and service-area validation.
- Booking creation and management.
- Technician onboarding and admin verification.
- Technician job dashboard and status updates.
- Admin user, service, and booking management.
- Technician assignment.
- Payment gateway integration and server-side verification.
- Critical notifications.
- Role-based access, ownership checks, and audit logging.
- Installable PWA and offline fallback.
- Privacy, terms, cancellation, and refund information.

### P1 — Next release

- Customer and technician ratings/reviews.
- Advanced technician filtering.
- Live technician location tracking.
- Automated technician payouts.
- Coupons and discounts.
- Referral system.
- WhatsApp notifications.
- Advanced analytics.
- Expanded support and dispute workflows.

### P2 — Future expansion

- AI-assisted repair recommendations.
- Automated technician matching.
- Route optimization.
- Maintenance subscriptions.
- Multi-city operations.
- Dynamic pricing.
- Predictive maintenance.
- Native Android and iOS applications.

## 19. Launch acceptance checklist

- [ ] Customers can register, authenticate, and manage profiles.
- [ ] Customers can browse services and create bookings.
- [ ] Serviceability is validated for the selected address.
- [ ] Technicians can register and submit verification details.
- [ ] Unapproved technicians cannot receive jobs.
- [ ] Technicians can manage only their assigned jobs.
- [ ] Customers can approve or reject additional quotations.
- [ ] Booking transitions are validated server-side.
- [ ] Payment success is verified by the backend.
- [ ] Webhooks are signature-verified and idempotent.
- [ ] Refunds and technician settlements are separately tracked.
- [ ] Admin actions are permission-checked and audited.
- [ ] Notifications are retried safely on transient failure.
- [ ] PWA installation works on supported devices.
- [ ] Offline mode provides a safe fallback.
- [ ] Sensitive documents are stored privately.
- [ ] Database backups and restoration are tested.
- [ ] Security and end-to-end tests pass.
- [ ] Monitoring and incident alerts are active.
- [ ] Legal, privacy, tax, and marketplace policies have been reviewed.

## 20. Recommended implementation order

Build in this order to reduce rework and establish the core business workflow early:

1. Finalize product rules, user journeys, pricing, cancellation, and assignment policies.
2. Create the monorepo, CI/CD, environments, and database migrations.
3. Implement authentication, sessions, RBAC, and audit logging.
4. Build service catalogue, serviceability, and address management.
5. Build booking creation, assignment, and state transitions.
6. Build technician onboarding, verification, and job management.
7. Build customer and admin interfaces around the stable API.
8. Integrate payments, webhooks, refunds, and financial records.
9. Add notifications, PWA installation, and safe offline behaviour.
10. Complete security testing, UAT, monitoring, backup recovery, and production launch.

**Core architectural decision:** Keep the NestJS API independent from the Next.js UI. This lets Fixora add React Native applications later without rebuilding authentication, booking, payments, or technician-management services.
