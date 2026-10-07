# På Jobb
## Product & Technical Specification
**Version:** 0.1  
**Status:** Draft for review  
**Date:** 7 October 2026

---

## 1. Product definition

**På Jobb** is a Norwegian-first, mobile-first and offline-first SaaS product for self-employed tradespeople and very small service businesses.

The product follows an assignment from first customer contact and inspection through planning, work, documentation and preparation for invoicing.

The primary user is a person doing practical work in the field who does not want to become a software administrator. På Jobb should reduce administrative work rather than create another administrative system to maintain.

Initial target users include painters, carpenters, handymen, installers and similar small businesses. The underlying model should remain broad enough for other field-service businesses.

### Core promise

> Capture what matters while working. Organize it when convenient.

På Jobb should answer three basic questions quickly:

1. What am I doing today?
2. What information do I need for this job?
3. What still needs to be dealt with?

---

## 2. Product principles

### 2.1 Mobile first

The phone is the primary design target.

Phone workflows include:
- viewing assigned jobs;
- creating local jobs;
- inspections;
- notes and measurements;
- taking and importing photos;
- recording labour;
- recording expenses;
- scheduling;
- completing work;
- working without network access.

Tablet and desktop interfaces progressively enhance the same product.

Desktop is particularly useful for:
- business administration;
- reviewing and organizing jobs;
- sorting photographs;
- preparing PDFs;
- reviewing expenses;
- managing users and workers;
- business settings.

A desktop interface must never be designed first and subsequently compressed into a phone-sized viewport.

### 2.2 Offline first

Loss of connectivity must not prevent field work.

New work begins locally by default. A user may create and work with a local job without contacting the server.

A local-only job:
- has a local identifier;
- is stored on the device;
- may contain a local customer;
- may contain notes, measurements and photos;
- is not uploaded automatically merely because connectivity exists;
- can be deleted without creating a server-side job or audit entry.

The user is prompted to save/promote the local job when appropriate.

Once promoted, a job becomes a business record and receives a permanent server identifier. A local cached copy remains available for offline work.

Server-backed jobs continue to work offline. Changes are queued and synchronized when connectivity returns.

The user-facing vocabulary should describe consequences, not implementation details. Prefer:
- **Lagret på telefonen**
- **Venter på nett**
- **Sikkerhetskopiert**

Avoid terms such as IndexedDB, synchronization queue or remote object.

### 2.3 Norwegian first

Norwegian Bokmål (`nb-NO`) is the default product language.

The application should be internationalizable from the beginning, but English support is not required for the first usable release.

Defaults:
- NOK;
- Norwegian date formatting;
- 24-hour clock;
- kilometres;
- Norwegian addresses;
- Norwegian VAT/accounting terminology where applicable.

### 2.4 Plain language

The product is intended to be usable by people with limited interest in software.

Prefer:
- Kunde
- Oppdrag
- Befaring
- Timer
- Utgift
- Kvittering
- Bilder og notater
- Lagre
- Slett
- Ferdig

Avoid unnecessary SaaS, CRM and technical terminology.

Buttons should describe the action precisely. Avoid unexplained icon-only controls and generic labels such as "Bekreft" where a more specific verb is possible.

Internal usability rule:

> If the intended user does not understand the button, the button is wrong.

### 2.5 Capture now, organize later

Field documentation must prioritize speed.

Photos, notes and labour information should be recordable with minimal interruption to practical work. Classification and cleanup may happen later.

Financial documentation is an exception: receipts and similar source documents should be captured carefully, verified and preserved.

### 2.6 Forgiving and reversible

Assume users will make ordinary mistakes:
- misspell names;
- enter the wrong business details;
- upload the wrong logo;
- attach the wrong photo;
- classify something incorrectly;
- delete something unintentionally.

Prevent mistakes where practical and make ordinary mistakes easy to correct.

---

## 3. SaaS and tenancy model

På Jobb is a multi-tenant SaaS.

### 3.1 Shared database

V1 should use shared infrastructure with logical tenant isolation rather than provisioning a separate database for every business.

Every business-owned record must carry or be unambiguously scoped to a `business_id`.

Examples:
- customers;
- workers;
- jobs;
- inspections;
- photos;
- labour entries;
- expenses;
- documents.

Tenant authorization is enforced server-side for every protected operation.

Client-side hiding is never considered an authorization mechanism.

The architecture should not unnecessarily prevent dedicated infrastructure for unusually large customers in the future, but dedicated databases are outside V1.

### 3.2 Business context

One user identity may belong to multiple businesses.

Permissions are evaluated in the context of the currently selected business.

Membership in Business A never grants access to Business B.

---

## 4. Identities, memberships and workers

### 4.1 User

A `user` is an authenticated På Jobb identity.

A user can have memberships in zero or more businesses.

### 4.2 Membership

A membership connects a user to a business and assigns a role.

Initial roles:

#### Eier
Can:
- access all business jobs and customers;
- manage business settings;
- manage users and workers;
- manage subscription/billing;
- restore deleted records;
- perform permitted destructive business operations;
- transfer ownership.

#### Administrator
Can:
- access all jobs and customers belonging to that business;
- manage ordinary operational data;
- manage workers/users as permitted by final authorization policy;
- manage ordinary business settings.

Cannot by default:
- transfer business ownership;
- perform account-level destructive operations;
- control subscription/billing unless later explicitly granted.

#### Arbeider
Can:
- access jobs assigned to their worker identity;
- access customer information necessary for those jobs;
- add permitted field information such as photos, notes, labour and expenses.

An ordinary worker must not see the company's complete job pipeline merely because they work for the company.

### 4.3 Worker

A `worker` represents a person performing work for a particular business.

A worker is not the same thing as a user.

Proposed model:

```text
worker
- id
- business_id
- display_name
- linked_user_id (nullable)
- status
```

Labour entries reference `worker_id`, never a free-text name alone.

A business can therefore record labour for someone without requiring that person to create a På Jobb account.

If that person later creates an account, the existing worker can be linked to the new `user_id`. Historical labour remains attached to the same permanent worker identity.

A single user may be linked to separate worker identities in multiple businesses.

Workers should normally be deactivated rather than deleted if historical business records reference them.

---

## 5. Business onboarding

Self-service onboarding is preferred over requiring På Jobb staff to manually create every business.

The onboarding flow must be guided, forgiving and easy to correct.

Initial information may include:
- business name;
- organization number;
- address;
- phone;
- email;
- logo.

Only information genuinely necessary to establish the workspace should be mandatory at the earliest step.

Where legally and technically practical, organization-number lookup should be investigated to populate official business information and reduce typing errors.

Before completing setup, present a human-readable preview and allow correction.

All ordinary business details and branding must remain editable later.

**TBD:** exact official data source/API for Norwegian business lookup.

---

## 6. Customers

Customers do not have På Jobb accounts in V1.

A customer belongs to a business.

Potential customer data includes:
- name;
- address;
- phone;
- email;
- notes;
- related jobs.

### 6.1 Privacy rights

The business is expected to be the data controller for ordinary customer/job data. På Jobb acts as processor where applicable.

På Jobb must provide tooling that allows the business to handle applicable requests for:
- access;
- correction;
- deletion;
- anonymization;
- export.

Requests must be appropriately validated. A person claiming to be Kari Nordmann must not be able to erase another customer's records without adequate verification.

Deletion is not absolute where another legal obligation requires retention.

Privacy tooling should distinguish information that may be deleted/anonymized from information that must remain for a defined legal retention period.

**TBD / legal review:** precise Norwegian retention categories and how they interact with customer privacy requests.

---

## 7. Customer duplicate handling

Offline-first operation creates a legitimate duplicate risk.

Example:
- one person creates a customer/job on the server;
- another worker independently creates a local customer while offline;
- both refer to the same real customer.

The system must not automatically merge uncertain records.

When a local job is promoted, duplicate detection should compare normalized data such as:
- phone number;
- email;
- address;
- name.

For a strong match, the UI may ask:

> **Kan dette være samme kunde?**

and allow:
- **Bruk eksisterende kunde**
- **Dette er en annen kunde**

Lower-confidence matches may be flagged for later review.

False merges are considered more harmful than temporary duplicates.

**TBD:** matching thresholds and exact duplicate-resolution workflow.

---

## 8. Job ownership and lifecycle

Jobs belong to the business, not to the individual user who created them.

Removing a user does not remove:
- jobs;
- notes;
- photos;
- labour;
- expenses;
- historical attribution.

Initial conceptual lifecycle:

```text
Forespørsel
→ Befaring
→ Pris / tilbud
→ Planlagt
→ Utføres
→ Ferdig
→ Fakturert
→ Betalt
```

The exact state machine may be simplified during implementation if the workflow proves too rigid.

### 8.1 Central job record

The job is the central operational object.

A job may contain:
- customer;
- assigned worker(s);
- inspection;
- notes;
- measurements;
- photos;
- estimated labour;
- quoted/fixed price;
- schedule;
- actual labour;
- expenses;
- receipts;
- completion information;
- generated documents;
- invoice metadata/status.

---

## 9. Inspections

Inspection (`Befaring`) is a first-class part of a job.

An inspection may include:
- notes;
- measurements;
- photos;
- access/obstacle information;
- customer requirements;
- proposed work;
- scheduling constraints;
- budget/deadline information.

The design should support creating this information quickly on a phone.

---

## 10. Pricing and labour

På Jobb must distinguish at least three concepts:

### Estimated hours
Used to plan and price work.

### Actual labour
Internal record of time actually spent.

### Quoted/fixed price
What the customer has agreed to pay, subject to separately agreed additional work.

Actual labour may be recorded for multiple workers.

Example:
- Worker A: 8 hours
- Worker B: 8 hours
- Total labour: 16 hours

Historical analytics may later compare estimated and actual labour, but sophisticated analytics are outside V1.

---

## 11. Photos

Ordinary job photos belong to the job first.

Classification must not be mandatory during capture.

Initial tags may include:
- `UNSORTED`
- `INSPECTION`
- `BEFORE`
- `DURING`
- `AFTER`
- `OTHER`

A user may:
- take a photo from På Jobb;
- select one or more existing photos from the phone;
- attach them immediately to the job;
- classify them later;
- change classification later.

The UI may pre-classify images when they are deliberately added from a specific context, but generic photo capture should permit unsorted images.

Bulk classification should be supported.

Example:

> 7 bilder er ikke sortert

Select several photos and mark them as:
- Befaring
- Før
- Underveis
- Etter
- Annet

### 11.1 Storage

Preserve the original image.

Optimized derivatives/thumbnails may be generated for normal viewing.

Originals should remain retrievable subject to permissions and retention rules.

Photo uploads must not block ordinary job synchronization. Metadata can synchronize before large image files.

The client should track upload state and resume interrupted uploads safely.

---

## 12. Expenses and receipts

Receipts are financial/source documents and should not be treated as ordinary job photos.

An expense may contain:
- job;
- worker/uploader;
- merchant;
- date;
- amount;
- VAT information where relevant;
- category;
- notes;
- receipt document/image;
- OCR/extraction status;
- verification status.

### 12.1 Receipt capture

Receipt capture should behave like document scanning rather than casual photography.

The UI should encourage:
- a flat document;
- adequate light;
- the entire receipt inside frame;
- minimal blur/glare;
- top-down capture where practical.

Potential processing:
1. capture original;
2. detect document edges;
3. crop/straighten;
4. perform quality checks;
5. create an enhanced viewing copy;
6. perform OCR;
7. present extracted values;
8. require human verification;
9. store confirmed structured expense data.

The untouched original must be retained alongside processed derivatives.

OCR output is a suggestion, not authoritative accounting data.

Existing digital receipts/PDFs should be importable without converting them into photographs.

**TBD:** OCR/document-processing provider and whether processing can be performed within the chosen Cloudflare architecture.

**TBD / legal review:** requirements for electronic reproduction and retention of Norwegian accounting source documents.

---

## 13. Local-first data model

### 13.1 Local-only

A new job begins as a local record by default.

Characteristics:
- no server job ID;
- stored locally;
- can be used without connectivity;
- can contain local customer data and ordinary job documentation;
- can be deleted locally without creating a server job/audit record.

### 13.2 Promoted/server-backed

When the user chooses to save the job to the business:
1. validate membership and permission;
2. check for potential customer duplicates;
3. create/attach customer;
4. create permanent job;
5. map local identity to server identity;
6. queue/synchronize associated data;
7. retain an offline-capable local cache.

### 13.3 Server-backed with pending local changes

Existing jobs remain editable offline.

Changes are queued locally and synchronized later.

User-facing states should remain simple:
- Lagret på telefonen
- Venter på nett
- Sikkerhetskopiert

### 13.4 Conflict handling

The system must anticipate multiple people modifying business records.

Silent data loss is unacceptable.

**TBD:** synchronization protocol, mutation/version identifiers and conflict-resolution rules.

Likely design should prefer field-level or operation-based reconciliation where practical rather than replacing whole records blindly.

---

## 14. Deletion and recovery

### Local-only records
May be permanently deleted after an appropriate confirmation.

No server audit entry exists because the record never existed on the server.

### Server-backed records
Deletion should normally move the record to a recycle bin (`Papirkurv`) rather than immediately erasing it.

Proposed default grace period: **30 days**.

Authorized users can restore eligible records during the grace period.

Legal retention requirements override ordinary deletion where necessary.

The interface must explain this plainly rather than merely failing a delete operation.

**TBD / legal review:** retention rules by data category.

---

## 15. Scheduling and notifications

Jobs may have agreed/scheduled dates and times.

V1 notifications should be deliberately restrained.

Potential useful notifications:
- upcoming assigned job;
- important schedule change;
- locally pending information that has failed to back up for an extended period.

Avoid engagement-oriented notifications and unnecessary reminders.

**TBD:** exact V1 notification set after pilot testing.

---

## 16. Documents and accounting boundary

På Jobb is not intended to become full accounting software in V1.

Potential generated documents:
- Tilbud / prisoverslag;
- Arbeidsrapport / jobbdokumentasjon;
- Timeoversikt;
- Utgiftsoversikt;
- Fakturagrunnlag.

The business may use generated PDFs/information with its existing invoicing/accounting workflow.

Initial job records may track:
- invoice number/reference;
- invoiced status/date;
- paid status/date.

Statutory invoice generation is outside the initial product boundary unless separately specified and legally reviewed.

Future integrations may include Norwegian accounting/invoicing products.

### 16.1 Bookkeeping export

The initial pilot user periodically provides records to an external bookkeeping company.

A future useful workflow may be an organized accounting export containing:
- expense overview;
- receipt source documents;
- invoice references;
- supporting job documents.

**TBD:** interview pilot user regarding exactly what is provided to the bookkeeper and in what format.

---

## 17. Document branding

Generated customer-facing documents should primarily represent the tradesman's business.

Potential content:
- business logo;
- official business name;
- organization number;
- contact details;
- customer details;
- job details;
- selected photos;
- completion information.

På Jobb branding should not steal attention from the business.

**TBD:** whether any subtle "Laget med På Jobb" attribution is used. No attribution should be assumed necessary.

---

## 18. Business ownership, departure and insolvency

Business records belong to the business workspace.

Normal ownership transfer should be explicit and audited.

Removing an owner/user does not transfer or destroy business data automatically.

Exceptional situations such as:
- death;
- incapacity;
- bankruptcy;
- legal succession;

require a documented support/legal process rather than informal reassignment.

**TBD / legal review:** handling of access requests from bankruptcy estates and other legal successors.

---

## 19. Platform administration and support access

Platform administration must be separated from ordinary tenant-data access.

A På Jobb system administrator may need capabilities such as:
- view business/account status;
- manage subscriptions;
- suspend/reactivate accounts;
- inspect service health;
- assist with account recovery.

This must not automatically imply unrestricted browsing of customer jobs or photos.

Where support access to tenant data is necessary, the preferred future model is:
- explicit support-access event;
- reason;
- target business;
- operator identity;
- limited duration where practical;
- audit log of access/actions.

Least privilege is the default.

---

## 20. Authentication and security

Exact authentication implementation remains to be selected.

Requirements:
- secure account authentication;
- secure session management;
- account recovery;
- rate limiting/brute-force protection;
- session revocation;
- server-side authorization;
- auditable privileged actions.

Potential future authentication options:
- email/password;
- passkeys;
- optional MFA;
- selected identity providers.

Discord OAuth is not appropriate for this product.

### 20.1 Tenant authorization

Every protected request must establish:
1. authenticated user;
2. selected/target business;
3. valid membership;
4. role/permission;
5. ownership/scope of requested resource.

Resource IDs alone never confer access.

### 20.2 Data minimization

Collect only information required for the business workflow.

Job photos should be private by default and treated as potentially containing personal information.

### 20.3 Audit logging

Important server-side actions should be auditable, particularly:
- membership/role changes;
- support access;
- deletion/restoration;
- ownership transfer;
- privacy-request actions;
- security-sensitive account changes.

---

## 21. Privacy and compliance

The product is designed primarily for Norwegian businesses and should follow GDPR and applicable Norwegian requirements.

Expected model for ordinary customer/job information:
- business customer: data controller;
- På Jobb: data processor.

Commercial launch is expected to require:
- data processing agreement;
- subprocessor list;
- privacy policy in plain Norwegian;
- documented retention rules;
- breach-response process;
- appropriate security measures;
- data export/correction/deletion support.

No advertising trackers or sale of customer data are part of the product concept.

Legal/compliance assumptions must be reviewed before commercial launch by appropriate Norwegian legal/accounting expertise.

---

## 22. Proposed technical architecture

This section describes the current preferred implementation, not immutable product requirements.

### 22.1 Frontend

**Progressive Web App (PWA)**

Primary targets:
- iPhone/mobile Safari;
- Android;
- modern desktop browsers;
- tablets.

Responsibilities:
- responsive/mobile-first UI;
- local/offline storage;
- local mutation queue;
- camera/photo picker integration;
- receipt capture UI;
- connectivity awareness;
- synchronization;
- PWA installation.

### 22.2 Local storage

Proposed: **IndexedDB**.

Used for:
- local-only jobs;
- cached server-backed jobs;
- queued mutations;
- pending photo/document uploads;
- synchronization metadata.

The implementation must be resilient to interrupted application sessions and unreliable connectivity.

### 22.3 Cloudflare

Current preferred infrastructure:

**Cloudflare Pages**
- PWA/frontend delivery.

**Cloudflare Workers**
- API;
- authentication/session boundary as appropriate;
- authorization;
- business logic;
- synchronization endpoints.

**Cloudflare D1**
- relational/structured application data.

Production database jurisdiction should be deliberately selected for EU requirements at creation time where supported.

**Cloudflare R2**
- original photos;
- optimized image derivatives;
- receipts/documents;
- generated PDFs.

**Cloudflare Queues**
- image processing;
- OCR/document processing;
- PDF generation;
- integrations;
- asynchronous notifications.

**Durable Objects**
- not required by default;
- introduce only if synchronization/coordination requirements justify them.

### 22.4 Architectural principle

The client records user intent and can continue working offline.

The server is authoritative for shared business state and performs consequential/shared processing.

---

## 23. Proposed high-level entities

This is an initial domain model, not a final migration schema.

```text
users
businesses
memberships
workers

customers
jobs
job_assignments
inspections
job_notes
job_photos

labour_entries
expenses
receipt_documents

documents
invoice_metadata

audit_events
deleted_items / soft-delete metadata
sync/version metadata
```

Most tenant-owned entities must include or inherit an unambiguous `business_id`.

### 23.1 IDs

Use opaque globally unique identifiers suitable for offline creation and distributed synchronization.

**TBD:** UUIDv7, ULID or equivalent.

IDs must never be treated as authorization secrets.

---

## 24. Initial API boundaries

Exact routes are TBD, but conceptual boundaries include:

```text
/auth/*
/businesses/*
/memberships/*
/workers/*
/customers/*
/jobs/*
/jobs/:id/inspections/*
/jobs/:id/photos/*
/jobs/:id/labour/*
/jobs/:id/expenses/*
/documents/*
/sync/*
```

All tenant routes must enforce membership and permissions server-side.

Large file transfer should use an appropriate upload design rather than unnecessarily proxying large image bodies through ordinary JSON API requests.

**TBD:** signed/direct R2 upload approach and resumability.

---

## 25. V1 scope

V1 should include:

- authentication;
- business/workspace model;
- multiple business memberships per user;
- owner/admin/worker roles;
- worker identities independent of user accounts;
- customer management;
- local-only job creation;
- promotion of local jobs to server-backed jobs;
- customer duplicate warning during promotion;
- offline access to existing jobs;
- resilient synchronization;
- job assignment;
- inspection notes and measurements;
- ordinary job photos;
- unsorted photos and later bulk classification;
- estimated and actual labour;
- simple pricing/quote information;
- scheduling;
- expenses;
- careful receipt capture/import;
- basic OCR-assisted extraction if provider/architecture is ready;
- completion information;
- PDF job documentation / invoice basis;
- recycle bin/grace period;
- Norwegian Bokmål UI;
- secure cloud storage;
- basic audit logging;
- privacy-support tooling sufficient for pilot/commercial preparation.

---

## 26. Explicitly outside initial V1

Unless pilot feedback changes priorities:

- full bookkeeping/accounting;
- payroll;
- statutory invoice engine;
- payment processing;
- inventory/warehouse management;
- route optimization;
- marketing CRM;
- customer accounts/portal;
- customer signatures;
- sophisticated analytics;
- AI analysis of ordinary job photos;
- native iOS application;
- native Android application;
- complex custom role/permission editor;
- extensive accounting integrations;
- engagement/gamification features.

---

## 27. Subscription model

The subscription belongs to the business, not an individual user.

Current conceptual model:
- base business subscription;
- includes one or more login seats;
- additional active login users may be paid seats;
- non-login workers do not consume paid seats.

Exact price is intentionally undecided.

### Trial

Current preference:
- one free trial per business;
- approximately one month;
- no repeated trial entitlement through additional user accounts.

**TBD:** price, included seats, payment provider, trial length and card requirement.

---

## 28. First vertical implementation slice

The first usable slice should prove the core field workflow rather than implementing every V1 feature independently.

Target:

```text
Logg inn
→ Velg bedrift
→ Oppdrag
→ Nytt lokalt oppdrag
→ Kunde
→ Befaring
→ Notater + bilder
→ Fortsett uten nett
→ Lagre oppdrag
→ Sikker synkronisering
→ Åpne samme oppdrag igjen
```

Success means the pilot user can perform this workflow on a phone without developer assistance.

This slice should be usable before estimates, OCR, sophisticated PDFs, subscriptions or advanced reporting are complete.

---

## 29. Implementation milestones

### Milestone 0 - Specification and validation
- review V0.1;
- resolve blocking TBDs;
- produce V0.2 implementation baseline.

### Milestone 1 - Repository and environments
- create `pa-jobb` repository;
- establish development/staging/production strategy;
- define branch/release conventions;
- establish secrets/configuration management;
- establish database migration process.

No routine direct-to-production development.

### Milestone 2 - Application foundation
- PWA shell;
- mobile-first navigation;
- `nb-NO` localization framework;
- authentication;
- businesses;
- memberships;
- workers;
- authorization middleware;
- D1 migrations;
- R2 storage foundation;
- IndexedDB/local data layer.

### Milestone 3 - First vertical slice
- local customer/job;
- inspection;
- notes;
- ordinary photos;
- promotion;
- duplicate check;
- synchronization;
- reopen offline.

### Milestone 4 - Operational job workflow
- assignments;
- schedule;
- pricing/estimate;
- labour;
- completion;
- photo organization.

### Milestone 5 - Financial documentation
- expenses;
- receipt capture/import;
- OCR experiment/integration;
- human verification;
- invoice-basis data.

### Milestone 6 - Documents
- job report;
- before/after photo selection;
- expense/time summaries;
- invoice basis;
- business branding.

### Milestone 7 - Recovery, privacy and hardening
- recycle bin;
- privacy request tooling;
- exports;
- audit logs;
- backup/restore;
- security review;
- retention implementation.

### Milestone 8 - Commercial foundation
- subscription;
- trial;
- onboarding refinement;
- terms/privacy/DPA;
- subprocessor documentation;
- production monitoring.

---

## 30. Pilot strategy

The first pilot user is a retired tradesman who still accepts practical jobs and currently uses a mixture of:
- phone notes;
- phone camera;
- PC photo folders;
- calendar;
- separate invoicing software;
- periodic external bookkeeping assistance.

Pilot testing should observe actual behavior rather than ask only whether the interface is liked.

Pay particular attention to:
- misunderstood labels;
- unnecessary taps;
- use of the default camera outside På Jobb;
- offline behavior;
- photo organization;
- forgotten synchronization;
- duplicate customers;
- how job information is prepared at home;
- what information is ultimately sent to the bookkeeper.

Failures during pilot use are product requirements, not user failures.

---

## 31. Open questions / TBD

### Product
- exact administrator user-management permissions;
- exact notification set;
- final document branding/attribution;
- final subscription price and seat count;
- exact trial rules;
- customer duplicate matching thresholds;
- exact job state machine after field testing.

### Engineering
- frontend framework;
- authentication implementation/provider;
- ID format;
- sync protocol and conflict resolution;
- direct/resumable R2 upload design;
- image derivative pipeline;
- OCR/document scanner implementation;
- PDF generation implementation;
- backup architecture independent enough for disaster recovery;
- monitoring/error reporting.

### Compliance/legal
- Norwegian accounting document retention categories;
- legal sufficiency of scanned receipts and required preservation properties;
- privacy deletion/anonymization boundaries;
- bankruptcy/legal succession procedure;
- DPA/subprocessor requirements;
- Cloudflare product-specific EU data-location configuration.

### External integrations
- official Norwegian business lookup;
- bookkeeping/accounting integrations after V1;
- email/SMS/push providers if required.

---

## 32. Acceptance principles

A feature is not complete merely because its happy path works.

For field-critical V1 functionality, acceptance should include:
- mobile usability;
- offline behavior where applicable;
- reconnect/retry behavior;
- tenant authorization;
- role authorization;
- error recovery;
- accidental duplicate handling where applicable;
- Norwegian/plain-language copy;
- accessibility basics;
- no silent data loss.

For destructive actions:
- clear consequence;
- appropriate confirmation;
- recovery where practical;
- audit trail where server-backed and relevant.

For background processing:
- idempotent/retry-safe where practical;
- visible status when the user needs to care;
- failure must not silently destroy or falsely confirm source data.

---

## 33. Working project identity

**Product:** På Jobb  
**Repository:** `pa-jobb`  
**Internal identifier/namespace:** `pajobb`

Current working tagline:

> **Fra befaring til ferdig jobb.**

The product name is suitable for development use. Commercial trademark/domain clearance remains a separate pre-launch task.

---

## 34. Definition of V0.1

This document records the current shared understanding of På Jobb.

It is intentionally not a frozen implementation contract.

The next step is to review this specification for:
- hidden assumptions;
- unnecessary V1 scope;
- missing field workflows;
- security/privacy weaknesses;
- offline/synchronization edge cases;
- confusing terminology.

Accepted changes should produce **V0.2**, which becomes the initial implementation baseline.
