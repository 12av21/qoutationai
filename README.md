



QuotePilot AI
AI-powered B2B RFQ-to-Quotation Automation Platform

QuotePilot AI transforms complex, unstructured B2B Requests for Quotation (RFQs) into validated, commercially controlled quotations.

It combines AI-powered document understanding, product matching, deterministic pricing rules, margin controls, multi-currency support, approval workflows, human-in-the-loop governance, quotation generation, and a versioned audit trail.

Core Principle
AI prepares the quotation. Humans approve the commercial commitment.

🚀 Project Overview
B2B sales teams often receive RFQs through:

PDF documents

Excel spreadsheets

Emails

WhatsApp/messages

Word documents

Plain text

The sales team then has to manually:

Read and extract requirements.

Normalize technical specifications.

Identify missing information.

Search the product catalogue.

Check stock and lead time.

Calculate pricing and discounts.

Check margins.

Apply tax and commercial rules.

Obtain technical/commercial/finance approval.

Prepare and send the quotation.

Maintain records and audit history.

QuotePilot AI brings these steps into one governed workflow.

🎯 Problem
Traditional quotation workflows are often:

Manual

Slow

Spreadsheet-heavy

Dependent on individual sales knowledge

Vulnerable to data-entry mistakes

Difficult to audit

Difficult to scale

Prone to missing technical requirements

Risky when discounts or margins are applied incorrectly

QuotePilot AI addresses this by combining AI assistance + deterministic business rules + human approval.

💡 Solution
Customer RFQ
     │
     ▼
┌──────────────────────┐
│    RFQ Intake        │
│ PDF / Excel / Email  │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Requirement Analysis │
│ Extraction +         │
│ Normalization        │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Clarification Gate   │
│ Missing / Ambiguous  │
│ Specifications       │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Product Matching     │
│ Catalogue + Evidence │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Commercial Engine    │
│ Price + Discount +   │
│ Margin + FX + Tax    │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Validation & Risk    │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Approval Workflow    │
│ Technical →          │
│ Commercial → Finance │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Quote Generation     │
│ PDF + Versioning     │
└──────────┬───────────┘
           ▼
┌──────────────────────┐
│ Versioned Audit Trail│
└──────────────────────┘
✨ Key Features
1. AI-Powered RFQ Intake
Accept RFQs from:

PDF

DOCX

XLSX

CSV

Email content

Manual text

Copy/paste

Extract:

Customer

RFQ number

RFQ date

Products

Quantities

Technical specifications

Delivery requirements

Destination

Payment terms

Incoterms

Special conditions

Attachments

Each extracted field can retain:

Value

Source

Confidence

Source location

Extraction status

2. Specification Verification & Normalization
QuotePilot compares the customer's original requirements with normalized values.

Example:

Field	Customer Value	Normalized Value	Status
Range	0–16 bar	0–16 bar	Verified
Signal	4–20mA HART	4–20mA + HART	Normalized
Process Connection	Not provided	Unresolved	Missing
Wetted Material	Not provided	Unresolved	Missing
Supported statuses include:

Verified

Normalized

Assumed

Missing

Ambiguous

Conflicting

Invalid

Optional

Important Governance Rule
QuotePilot must never silently invent missing specifications.

Assumptions must be explicitly identified.

3. Clarification Gate
When mandatory specifications are missing or ambiguous, the quotation workflow can be blocked.

Example:

Missing:
- Process connection
- Wetted material

Status:
CLARIFICATION_REQUIRED
The system can generate a customer clarification request.

Example:

Please confirm the process connection standard and wetted-part material for the requested pressure transmitters.

Available actions:

Send Clarification

Edit Message

Technical Approver Override

An override requires:

Approver

Role

Justification

Timestamp

Applied assumption

Supporting reference

The override is recorded in the audit trail.

4. AI Product Matching
The catalogue agent searches and ranks suitable products.

Each candidate can display:

Product name

SKU

Technical fit

Matching attributes

Non-matching attributes

Stock

Lead time

Unit price

Cost

Evidence

Recommendation status

Example:

PTX-400 HART 316L

Technical Fit: 96%
Stock: 24
Lead Time: 14 days
Unit Price: ₹18,900
The system should explain why a product was selected instead of simply returning an unexplained recommendation.

5. Commercial Pricing Engine
The pricing engine handles:

List Price
    ↓
Agreement Discount
    ↓
Quantity Discount
    ↓
Additional Charges
    ↓
Currency Conversion
    ↓
Margin Validation
    ↓
Tax
    ↓
Final Quote
Example:

Quantity: 50
Unit Price: ₹2,000

Subtotal:
50 × ₹2,000 = ₹1,00,000

Discount:
10% = ₹10,000

Taxable Amount:
₹90,000

Tax:
Calculated from configured rules

Final Total:
Calculated dynamically
Financial calculations should be deterministic and server-side rather than relying on an LLM.

6. Margin & Profitability Controls
QuotePilot compares the proposed margin against a configured policy floor.

Example:

Selling Price: ₹20,000
COGS: ₹17,000

Gross Profit:
₹3,000

Margin:
15%

Policy Floor:
12%

Status:
Within Policy
If:

Offer Margin: 8.4%
Policy Floor: 12%
the system can create a:

Commercial Exception

The quote should require the appropriate approval before release.

7. Multi-Currency Support
QuotePilot supports a multi-currency quotation architecture.

Initial supported currencies:

INR — Indian Rupee

USD — US Dollar

EUR — Euro

GBP — British Pound

AED — UAE Dirham

SGD — Singapore Dollar

AUD — Australian Dollar

CAD — Canadian Dollar

JPY — Japanese Yen

CHF — Swiss Franc

The architecture can support additional currencies.

Example
Catalogue base price:

₹20,000 INR
Customer quotation currency:

USD
Configured FX rate:

1 USD = ₹83.25
Converted amount:

₹20,000 / 83.25 ≈ $240.24
FX Rate Locking
When a quotation is generated/approved, the FX rate used for that quotation version should be stored.

Historical approved quotations should not silently change because the current exchange rate changed.

8. Customer Currency Preferences
Customer records can contain:

Country

Billing currency

Shipping currency

Preferred quotation currency

Example:

Customer:
ABC Industrial Solutions

Country:
United States

Preferred Currency:
USD
The preferred currency can be used as the default when creating a quotation.

9. Tax & Trade Handling
Configurable commercial fields include:

Tax
GST

Intra-state

Inter-state

Export

SEZ

Payment Methods
UPI

NEFT

RTGS

Bank Transfer

Card

Letter of Credit

Incoterms
EXW

FCA

FOB

CIF

CPT

CIP

DAP

DDP

HS-code information can be stored as configurable/reference information.

The system should not automatically represent AI-generated customs classification as legally final.

10. Multi-User Authentication
QuotePilot is designed as a multi-user SaaS application.

Authentication features:

Registration

Login

Logout

Email verification

Password reset

Secure password hashing

Session management

Secure cookies

CSRF protection

Rate limiting

Login protection

Role-based authorization

Example routes:

/login
/register
/forgot-password
/reset-password
/verify-email
11. Role-Based Access Control
Supported roles:

SUPER_ADMIN
ORG_ADMIN
SALES_MANAGER
SALES_USER
TECHNICAL_APPROVER
COMMERCIAL_MANAGER
FINANCE_REVIEWER
VIEWER
Example responsibilities:

Sales User
Create RFQs

View assigned RFQs

Create quotations

Edit draft quotations

Request approval

Technical Approver
Review technical requirements

Resolve clarification gates

Approve technical fit

Authorize technical overrides

Commercial Manager
Review pricing

Review discounts

Review margins

Approve commercial exceptions

Finance Reviewer
Review tax

Review payment terms

Review financial calculations

Provide finance approval

Organization Admin
Manage users

Manage catalogue

Manage pricing rules

Configure organization settings

12. Organization / Multi-Tenant Architecture
QuotePilot is designed around organizations/tenants.

Platform
│
├── Organization A
│   ├── Users
│   ├── Customers
│   ├── Products
│   ├── RFQs
│   ├── Quotes
│   └── Audit Logs
│
├── Organization B
│   ├── Users
│   ├── Customers
│   ├── Products
│   ├── RFQs
│   └── Quotes
│
└── Organization C
Business records should be associated with an:

organization_id
The backend must enforce tenant isolation so one organization cannot access another organization's data.

13. Role-Aware User Dashboard
After login, users are directed to their dashboard.

Dashboard can display:

RFQs received

RFQs processing

Clarifications pending

Quotes awaiting approval

Approved quotes

Released quotes

Margin exceptions

Total quote value

Recent activity

Sales users can see:

My RFQs
My Quotations
Draft Quotes
Approval Requests
Clarifications
Customers
Follow-ups
Managers can see team-level metrics.

Approvers can see their approval queues.

14. Approval Workflow
QuotePilot supports:

Technical Approval
        ↓
Commercial Approval
        ↓
Finance Review
        ↓
Quote Release
Approval statuses:

Pending

Approved

Rejected

Needs Revision

Not Required

A quote cannot be released until required approvals are completed.

15. Quote Versioning
Every revision creates a new version.

Example:

QP-2026-0018 v1
QP-2026-0018 v2
QP-2026-0018 v3
Store:

Previous value

New value

Changed field

Changed by

Timestamp

Reason

Historical commercial decisions should remain traceable.

16. Professional Quotation Generation
Generated quotations can include:

Quote number

Version

Customer

Address

Destination

Quote date

Validity

Products

SKU

Quantity

Unit price

Amount

Discount

Tax

Grand total

Currency

Payment terms

Delivery terms

Incoterms

Notes

Assumptions

Exceptions

A PDF should only be released after the required approval workflow is completed.

17. Versioned Audit Trail
QuotePilot records important actions.

Example:

22:03:02
RFQ uploaded

22:03:33
Specifications normalized

22:03:43
Technical override authorized

22:03:59
Commercial review completed

22:04:05
Commercial exception approved

22:04:05
Finance pre-clearance

22:04:05
Quote generated
Each audit event can contain:

Event

Timestamp

Actor

Role

Action

Reason

Evidence

Quote version

The system can provide:

Download Audit JSON
18. Ask QuotePilot AI
A contextual AI assistant can answer questions about the current workflow.

Examples:

Why was this product selected?

Why is this quote blocked?

What specifications are missing?

Why is the margin below the floor?

Who approved this exception?

What changed between version 1 and version 2?

Which products have sufficient stock?

Explain the final quotation.
The assistant should use application data/evidence and should not invent facts.

19. AI Agent Architecture
QuotePilot can be organized around specialized agents:

┌───────────────────┐
│   Intake Agent    │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Requirement Agent │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Catalogue Agent   │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Commercial Agent  │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│ Validation Agent  │
└─────────┬─────────┘
          ▼
┌───────────────────┐
│   Quote Agent     │
└───────────────────┘
Intake Agent
Extracts RFQ information.

Requirement Agent
Normalizes specifications and detects missing information.

Catalogue Agent
Retrieves and ranks suitable products.

Commercial Agent
Assists with commercial analysis.

Validation Agent
Checks compatibility, confidence, policy violations and exceptions.

Quote Agent
Produces the final quotation from validated information.

🏗️ System Architecture
A proposed high-level architecture:

                  ┌─────────────────┐
                  │     User        │
                  │ Web Application │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ React + TS      │
                  │ Frontend        │
                  └────────┬────────┘
                           │ HTTPS
                           ▼
                  ┌─────────────────┐
                  │ API / Backend   │
                  │ FastAPI         │
                  └───────┬─────────┘
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
   ┌────────────┐  ┌─────────────┐  ┌──────────────┐
   │ AI Agent   │  │ Rules Engine │  │ Auth / RBAC  │
   │ Orchestrator│  │             │  │              │
   └─────┬──────┘  └──────┬──────┘  └──────────────┘
         │                │
         ▼                ▼
   ┌────────────┐  ┌─────────────┐
   │ LLM / RAG  │  │ PostgreSQL  │
   │ Catalogue  │  │ Database    │
   └────────────┘  └─────────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ Audit / Logs  │
                  └──────────────┘
🛠️ Suggested Technology Stack
The exact implementation stack can evolve with the prototype. The following represents the intended architecture.

Frontend
React

TypeScript

Tailwind CSS

Vite

Backend
Python

FastAPI

AI
Gemini / compatible LLM

Structured outputs

Agent orchestration

RAG / hybrid retrieval

Embeddings / vector search

Database
PostgreSQL

pgvector where required

Authentication
Secure session or JWT-based architecture

RBAC

Organization/tenant isolation

Infrastructure
Docker

Cloud Run or comparable cloud deployment

Object storage for documents

Logging and monitoring

🗄️ Core Data Model
Important entities include:

users
organizations
organization_members
roles
permissions
sessions
customers
customer_contacts
products
inventory
rfqs
rfq_documents
rfq_requirements
normalized_requirements
clarifications
product_matches
pricing_rules
pricing_calculations
commercial_exceptions
approvals
quotes
quote_items
quote_versions
currencies
exchange_rates
tax_rules
audit_events
audit_evidence
ai_agent_runs
ai_assumptions
notifications
🔐 Security
Security requirements include:

Secure password hashing

Authentication

Authorization

RBAC

Tenant isolation

CSRF protection

Input validation

SQL injection protection

XSS protection

File upload validation

Secure session management

Rate limiting

Brute-force protection

Secure password reset

Email verification

Audit logging

Server-side financial validation

Protected API endpoints

Critical authorization must always be enforced on the backend.

🧪 Example Demo Scenario
Customer RFQ
Customer:
ABC Industrial Solutions

Product:
Pressure Transmitter

Quantity:
18

Range:
0–16 bar

Signal:
4–20 mA + HART

IP Rating:
IP67

Process Connection:
Missing

Wetted Material:
Missing

Delivery:
Within 3 weeks

Currency:
USD
QuotePilot Workflow
RFQ Upload
     ↓
AI Extraction
     ↓
Specification Normalization
     ↓
Missing Specifications
     ↓
Clarification Gate
     ↓
Technical Review / Override
     ↓
Product Matching
     ↓
Stock + Lead Time
     ↓
Pricing
     ↓
FX Conversion
     ↓
Margin Validation
     ↓
Commercial Exception (if required)
     ↓
Technical Approval
     ↓
Commercial Approval
     ↓
Finance Review
     ↓
Quotation Generation
     ↓
PDF
     ↓
Audit Trail
📊 Evaluation Metrics
Potential evaluation metrics include:

Requirement Extraction
Exact Match

Precision

Recall

F1

Product Retrieval
Recall@K

MRR

Technical fit accuracy

Quotation Quality
Arithmetic correctness

Requirement coverage

Policy compliance

Exception detection

AI Quality
Hallucination/error rate

Evidence coverage

Human override rate

System
Latency

Cost per RFQ

Reliability

Approval turnaround time

🎯 MVP Scope
The MVP should focus on a complete end-to-end workflow rather than attempting to integrate every enterprise system.

MVP
User authentication

Organization/workspace

Role-based access

RFQ upload

Requirement extraction

Specification normalization

Clarification gate

Product catalogue

Product matching

Pricing rules

Margin validation

INR/USD/EUR/GBP/AED currency support

Approval workflow

Quote generation

PDF

Quote versioning

Audit trail

Demo data

Out of Scope for Initial MVP
Autonomous price negotiation

Automatic order commitment

Production ERP write-back

Fully autonomous customer communication

Unvalidated customs classification

Large-scale production integrations

🧭 Roadmap
Phase 1 — Prototype
End-to-end RFQ workflow

AI extraction

Product matching

Pricing

Approval

Quote generation

Audit trail

Phase 2 — Pilot
Real customer RFQs

Better catalogue retrieval

Email integration

Improved evaluation

Production authentication

Real FX provider

Better monitoring

Phase 3 — Enterprise
ERP integrations

CRM integrations

Advanced analytics

Enterprise SSO

Private deployment

Advanced tenant controls

Large catalogue support

🏆 Hackathon Demo Focus
The strongest demonstration is a single complete RFQ journey.

Recommended flow
0:00 – Problem
0:20 – QuotePilot overview
0:40 – Upload RFQ
1:00 – AI extracts requirements
1:20 – Missing specification detected
1:40 – Clarification Gate
2:00 – Product matching
2:20 – Pricing + margin
2:40 – Currency conversion
3:00 – Approval
3:20 – Final quotation
3:40 – Audit trail
4:00 – Closing
Closing Message
QuotePilot AI doesn't replace the sales engineer. It removes the repetitive work between customer requirement and quotation while keeping critical commercial decisions under human control.

⚠️ Demo Data
The prototype/demo environment should clearly identify fictional or simulated:

Customers

Products

Prices

Inventory

Exchange rates

ERP data

Approval users

Integrations

Production deployment requires appropriate real-world validation, security controls, data governance, and integration testing.

📁 Suggested Repository Structure
QuotePilot-AI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── store/
│   │   └── types/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── agents/
│   │   ├── auth/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── rules/
│   │   ├── pricing/
│   │   ├── currency/
│   │   ├── approvals/
│   │   └── audit/
│   └── requirements.txt
│
├── database/
│   ├── migrations/
│   └── seed/
│
├── docs/
│   ├── architecture/
│   ├── diagrams/
│   ├── api/
│   └── project-report/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── docker/
│
├── .env.example
├── docker-compose.yml
└── README.md
🚀 Getting Started
Update these commands to match the final implementation.

1. Clone Repository
git clone <YOUR_REPOSITORY_URL>
cd QuotePilot-AI
2. Configure Environment
cp .env.example .env
Configure values such as:

DATABASE_URL=
AI_API_KEY=
JWT_SECRET=
FX_API_KEY=
STORAGE_BUCKET=
Never commit real secrets.

3. Start Backend
cd backend

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
4. Start Frontend
cd frontend

npm install
npm run dev
🔑 Environment Variables
Example:

DATABASE_URL=postgresql://...
AI_API_KEY=your_api_key
JWT_SECRET=change_me
FX_API_KEY=your_fx_provider_key
STORAGE_BUCKET=...
Do not commit:

.env
API keys
database passwords
JWT secrets
private credentials
production certificates
Use .env.example for documentation.

🤝 Team
Adarsh Verma
Co-Founder & Product / Technology Lead

MCA student at University of Allahabad

Full-stack development

AI/ML and AI-agent workflows

Backend APIs and databases

System architecture

Product development

Technical execution

Additional team members should be added here.

📜 Project Status
Status: Prototype / Hackathon MVP

QuotePilot AI is being developed as an AI-powered B2B quotation automation platform for demonstrating an end-to-end governed RFQ-to-quotation workflow.

The prototype may use simulated catalogue, inventory, pricing, exchange-rate and integration data for demonstration purposes.

🧠 Design Philosophy
QuotePilot AI follows five principles:

1. AI-Assisted
AI handles unstructured information and repetitive reasoning tasks.

2. Evidence-Based
Important recommendations should be traceable to source data.

3. Deterministic
Financial calculations and policy rules should be implemented using deterministic business logic.

4. Human-Controlled
Critical commercial decisions require appropriate human approval.

5. Auditable
Important decisions, overrides, revisions and approvals should remain traceable.

📄 Documentation
Recommended project documentation:

Software Requirements Specification

Complete Project Report

System Architecture

DFD Level 0

DFD Level 1

DFD Level 2

ER Diagram

UML Class Diagram

Use Case Diagram

Sequence Diagram

Activity Diagram

API Documentation

Security Documentation

Testing Documentation

Deployment Documentation

📌 Important Disclaimer
QuotePilot AI is a prototype/hackathon project.

AI-generated recommendations should be validated before being used for real commercial commitments.

Financial calculations, tax treatment, customs information, product compatibility, pricing policies and contractual terms should be validated against the organization's authoritative systems and applicable regulations before production use.

⭐ QuotePilot AI
From messy RFQ to governed quotation — faster, safer, and auditable.

AI prepares. Rules validate. Humans approve.
