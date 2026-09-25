<div align="center">

⚡ QuotePilot AI

From messy RFQ → validated quotation → human-approved release

<p>
  <strong>AI-powered B2B quotation automation for industrial sales teams</strong>
</p>

<p>
  <a href="#-live-demo-flow">Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-ai-agents">AI Agents</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-roadmap">Roadmap</a>
</p>

<p>
  <img src="https://img.shields.io/badge/AI-Agentic%20Workflow-111827?style=for-the-badge" alt="AI Agentic Workflow">
  <img src="https://img.shields.io/badge/Human-in-the-Loop-2563EB?style=for-the-badge" alt="Human in the loop">
  <img src="https://img.shields.io/badge/Multi--Tenant-SaaS-7C3AED?style=for-the-badge" alt="Multi tenant SaaS">
  <img src="https://img.shields.io/badge/Financial%20Rules-059669?style=for-the-badge" alt="Financial rules">
</p>

<p>
  <img src="https://img.shields.io/badge/React-TypeScript-61DAFB?style=flat-square&logo=react&logoColor=111827" alt="React">
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Docker-Container-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
</p>

</div>

🎯 The One-Liner

QuotePilot AI converts complex B2B RFQs into accurate, commercially controlled, human-approved quotations — in minutes instead of hours.

It is not just a chatbot that writes quotes.

QuotePilot is a governed RFQ-to-quotation workflow where AI handles repetitive reasoning and extraction, deterministic services handle financial rules, and humans remain responsible for critical commercial decisions.

✨ Why QuotePilot?

B2B quotation teams often receive requirements through:

📧 Email
📄 PDF
📊 Excel
💬 WhatsApp / Messages
📝 Free-form customer requests

The salesperson then has to:

Extract requirements
       ↓
Normalize specifications
       ↓
Find matching products
       ↓
Check availability
       ↓
Calculate price + discount
       ↓
Calculate margin
       ↓
Check tax / trade terms
       ↓
Get approvals
       ↓
Create quotation
       ↓
Send + follow up

QuotePilot turns that into one controlled workflow:

┌─────────────┐
│   RFQ       │
│ PDF / XLSX  │
│ Email / Text│
└──────┬──────┘
       ↓
┌───────────────────┐
│ 🤖 Intake Agent   │
└────────┬──────────┘
         ↓
┌───────────────────┐
│ 🔎 Requirement    │
│    Agent          │
└────────┬──────────┘
         ↓
    Missing specs?
      ↙       ↘
    YES        NO
     ↓          ↓
Clarification  Match
     ↓          ↓
     └─────┬────┘
           ↓
┌───────────────────┐
│ 📦 Catalogue Agent│
└────────┬──────────┘
         ↓
┌───────────────────┐
│ 💰 Commercial     │
│    Engine         │
└────────┬──────────┘
         ↓
┌───────────────────┐
│ 🛡️ Validation     │
└────────┬──────────┘
         ↓
┌───────────────────┐
│ 👥 Human Approval │
└────────┬──────────┘
         ↓
┌───────────────────┐
│ 📄 Final Quote    │
└───────────────────┘

🚀 Live Demo Flow

The strongest way to demonstrate QuotePilot is to show one RFQ travelling through the entire system.

01 — Upload RFQ

Customer RFQ
     ↓
📄 Upload PDF / Excel
     ↓
🤖 Intake Agent
     ↓
Structured requirements

02 — Verify Specifications

QuotePilot shows:

Customer Value

Normalized Value

Status

0–10 bar

Pressure range: 0–10 bar

✅ Verified

4–20 mA

Output: 4–20 mA

✅ Verified

IP67

Protection: IP67

✅ Verified

—

Process connection

⚠️ Missing

Important: QuotePilot does not silently invent missing specifications.

03 — Clarification Gate

If a mandatory field is missing:

⚠️ QUOTATION BLOCKED

Missing requirement:
Process connection size

Suggested action:
Ask customer for clarification

[ Generate Clarification Request ]

A technical approver can override the block only with a recorded justification.

04 — Product Matching

RFQ Requirement
      ↓
Hybrid Search
      ↓
Technical Filtering
      ↓
Reranking
      ↓
Evidence-backed candidates

Example:

Product

Technical Fit

Stock

Lead Time

Status

PT-100

96%

75

2 weeks

🟢 Candidate

PT-220

89%

20

4 weeks

🟡 Review

PT-310

62%

100

1 week

🔴 Mismatch

05 — Commercial Review

QuotePilot calculates:

List Price
    ↓
Agreement Discount
    ↓
Net Price
    ↓
FX Conversion
    ↓
Tax
    ↓
COGS
    ↓
Offer Margin
    ↓
Minimum Margin Check

If the margin falls below the configured floor:

🛑 COMMERCIAL EXCEPTION

Offer Margin:        7.8%
Required Floor:     12.0%

Action:
Commercial approval required

[ Revise Price ] [ Request Exception ]

06 — Approval Chain

Technical Approver
        ↓
Commercial Manager
        ↓
Finance Reviewer
        ↓
   ✅ RELEASE

No required approval → no customer release.

07 — Final Quotation

Generated quotation includes:

Quote number + version

Customer

Destination

Currency

Line items

Unit price

Quantity

Discount

Tax

Lead time

Validity

Payment terms

Incoterms

Assumptions

Exceptions

Approval status

                         ┌───────────────┐
                         │ FINAL QUOTE   │
                         │ QP-2026-0042  │
                         │ VERSION 03    │
                         └───────────────┘
                                  │
                    👤 Human Approved
                                  │
                                  ↓
                            📄 PDF Release

🧠 AI Agents

QuotePilot uses specialized agents instead of asking one general-purpose model to do everything.

Agent

Responsibility

🤖 Intake Agent

Reads RFQ files/text and extracts structured data

🔎 Requirement Agent

Normalizes specifications and detects missing/conflicting values

📦 Catalogue Agent

Finds technically relevant products

💰 Commercial Agent

Calculates price, discount, FX, margin and commercial rules

🛡️ Validation Agent

Checks confidence, compatibility, assumptions and policy

📄 Quote Agent

Generates quotation and customer-facing drafts

Agent orchestration

flowchart LR
    A[Customer RFQ] --> B[Intake Agent]
    B --> C[Requirement Agent]
    C --> D{Critical Data Missing?}
    D -->|Yes| E[Clarification Gate]
    E --> C
    D -->|No| F[Catalogue Agent]
    F --> G[Commercial Agent]
    G --> H[Validation Agent]
    H --> I{Approval Required?}
    I -->|Yes| J[Human Approval]
    J --> K[Quote Agent]
    I -->|No| K
    K --> L[Final Quotation]

🛡️ The Core Principle

<div align="center">

AI prepares the quotation.

Rules protect the commercial logic.

Humans approve the commitment.

</div>

This design reduces the risk of:

invented specifications

incorrect product selection

uncontrolled discounts

margin leakage

accidental quote release

untraceable AI decisions

💎 Features

📥 RFQ Intake

PDF upload

Excel upload

Structured text input

RFQ classification

Requirement extraction

Source evidence

Confidence tracking

🔍 Specification Intelligence

Every extracted field can carry a governed state:

✅ Verified
🔄 Normalized
🟡 Assumed
⚠️ Missing
❓ Ambiguous
🔴 Conflicting
⛔ Invalid
ℹ️ Optional

🧩 Product Matching

Catalogue search

Attribute filtering

Semantic retrieval

Hybrid retrieval

Candidate ranking

Technical-fit scoring

Evidence/source display

Stock visibility

Lead-time visibility

💰 Commercial Engine

Supports:

List price

Customer pricing

Agreement discount

COGS

Net price

Margin

Minimum margin floor

Discount limits

Commercial exceptions

Financial calculations stay deterministic.

AI can recommend.

The rules engine calculates.

💱 Multi-Currency

QuotePilot is designed for international B2B quotations.

Supported example currencies:

🇮🇳 INR   🇺🇸 USD   🇪🇺 EUR   🇬🇧 GBP
🇦🇪 AED   🇸🇬 SGD   🇦🇺 AUD   🇨🇦 CAD
🇯🇵 JPY   🇨🇭 CHF

Currency architecture

Organization Base Currency
          ↓
      FX Engine
          ↓
Customer Quote Currency
          ↓
Pricing + Discount
          ↓
Margin Calculation
          ↓
Tax / Trade Rules
          ↓
Approval
          ↓
       FX Lock

Important design rule

An approved historical quotation should not silently change when today's exchange rate changes.

Therefore each quotation version stores its applicable FX rate.

🌍 Tax & Trade Controls

Designed to support configurable commercial fields such as:

GST

Intra-state / inter-state

Export / SEZ

Payment methods

Incoterms

HS-code field

Customs confirmation/disclaimer

Destination country

Currency

Customs and tax classifications should remain configurable and reviewable rather than being treated as automatically legally final.

👥 Real User & Organization System

QuotePilot is designed as a real multi-user SaaS rather than a single demo login.

Roles

SUPER_ADMIN
    │
    ├── ORGANIZATION_ADMIN
    │       ├── SALES_MANAGER
    │       │      └── SALES_USER
    │       │
    │       ├── TECHNICAL_APPROVER
    │       ├── COMMERCIAL_MANAGER
    │       ├── FINANCE_REVIEWER
    │       └── VIEWER

Authentication

Registration

Login

Logout

Password reset

Email verification

Session management

Rate limiting

Secure cookies

CSRF protection

Server-side validation

Password hashing

🏢 Multi-Tenant SaaS

Each organization is isolated using tenant-aware data access.

                    QuotePilot
                        │
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
      Company A      Company B      Company C
          │             │             │
       Users         Users         Users
          │             │             │
       RFQs           RFQs          RFQs
       Quotes         Quotes        Quotes
       Catalog        Catalog       Catalog

Tenant isolation is enforced server-side.

Never rely only on frontend filtering.

📊 Dashboard Experience

A future-ready dashboard can surface:

┌──────────────────────────────────────────────────────┐
│ QuotePilot AI                         🔔  👤 Account │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│ 📊 Dashboard │  RFQs        Quotes       Pending    │
│ 📥 RFQs      │  128          86            12       │
│ 📄 Quotes    │                                       │
│ 📦 Catalogue │  ─────────────────────────────────   │
│ 👥 Customers │                                       │
│ ✅ Approvals │  Recent RFQs                         │
│ 💰 Pricing   │  • RFQ-1042  🟡 Review               │
│ 📋 Audit     │  • RFQ-1041  🟢 Approved             │
│ ⚙ Settings  │  • RFQ-1040  🔴 Clarification        │
│              │                                       │
└──────────────┴───────────────────────────────────────┘

Suggested dashboard sections:

RFQ pipeline

Quote pipeline

Pending approvals

Margin exceptions

Clarification requests

Recent activity

Revenue/quote analytics

Currency breakdown

AI processing status

🔐 Security by Design

Security is treated as part of the architecture.

Application security

Password hashing

Secure session handling

CSRF protection

Rate limiting

Input validation

SQL injection protection

XSS protection

Secure file upload validation

Safe filename generation

RBAC

Tenant isolation

AI security

Grounding against approved catalogue data

Source evidence

Confidence tracking

Explicit assumptions

Deterministic financial calculations

Human approval for critical actions

Audit trail

Operational security

Structured logs

Audit events

Session tracking

Version history

Approval history

Exception history

🧾 Versioned Audit Trail

Every important action can become an auditable event.

RFQ Uploaded
     ↓
Specifications Extracted
     ↓
Specifications Normalized
     ↓
Technical Override
     ↓
Product Selected
     ↓
Commercial Review
     ↓
Margin Exception
     ↓
Finance Approval
     ↓
Quote Generated
     ↓
Quote Version Updated
     ↓
Customer Release

Each event can store:

Actor
Role
Timestamp
Organization
Action
Previous Value
New Value
Reason
Evidence
Quote Version

🤖 Ask QuotePilot

A persistent assistant can operate with the current quote context.

Example questions:

"Why was this product selected?"

"What specification is missing?"

"Why is this quote blocked?"

"Show me the margin calculation."

"Which approval is pending?"

"What changed between v2 and v3?"

"Generate a clarification request."

The assistant should answer using the current governed context, not generic unsupported assumptions.

🏗️ Architecture

flowchart TB
    U[Sales User / Approver] --> UI[React + TypeScript Web App]

    UI --> API[FastAPI Backend]

    API --> AUTH[Authentication + RBAC]
    API --> RFQ[RFQ Service]
    API --> QUOTE[Quotation Service]
    API --> COMM[Commercial Rules Engine]
    API --> APPROVAL[Approval Service]
    API --> AUDIT[Audit Service]
    API --> FX[Currency / FX Service]

    RFQ --> AGENTS[AI Agent Orchestrator]

    AGENTS --> INTAKE[Intake Agent]
    AGENTS --> REQ[Requirement Agent]
    AGENTS --> CAT[Catalogue Agent]
    AGENTS --> VAL[Validation Agent]
    AGENTS --> QAGENT[Quote Agent]

    CAT --> DB[(PostgreSQL + pgvector)]
    COMM --> DB
    QUOTE --> DB
    AUDIT --> DB
    FX --> DB

    COMM --> RULES[Pricing / Margin / Tax Rules]

    QUOTE --> PDF[PDF Generator]
    APPROVAL --> NOTIFY[Notifications]

🗃️ Core Data Model

erDiagram
    ORGANIZATION ||--o{ ORGANIZATION_MEMBER : contains
    USER ||--o{ ORGANIZATION_MEMBER : joins
    ORGANIZATION ||--o{ CUSTOMER : owns
    ORGANIZATION ||--o{ RFQ : receives
    RFQ ||--o{ QUOTE : generates
    QUOTE ||--o{ QUOTE_VERSION : contains
    QUOTE_VERSION ||--o{ QUOTE_ITEM : contains
    QUOTE_VERSION ||--o{ APPROVAL : requires
    QUOTE_VERSION ||--o{ AUDIT_EVENT : records
    CUSTOMER ||--o{ QUOTE : receives
    PRODUCT ||--o{ QUOTE_ITEM : selected
    CURRENCY ||--o{ EXCHANGE_RATE : defines

Core entities:

Users
Organizations
Organization Members
Roles
Permissions
Sessions
Customers
Customer Contacts
Products
Catalogue Items
Currencies
Exchange Rates
RFQs
RFQ Requirements
Quotes
Quote Versions
Quote Items
Pricing Calculations
Approvals
Audit Events
Notifications

🔄 Quote Lifecycle

DRAFT
  ↓
RFQ_RECEIVED
  ↓
EXTRACTING
  ↓
SPEC_REVIEW
  ↓
CLARIFICATION_REQUIRED ───────┐
  ↓                           │
MATCHING                       │
  ↓                           │
COMMERCIAL_REVIEW              │
  ↓                           │
APPROVAL_REQUIRED              │
  ↓                           │
APPROVED                       │
  ↓                           │
GENERATED                      │
  ↓                           │
RELEASED                       │
                              │
REVISED ←─────────────────────┘

🧪 Example Demo RFQ

Use a simple but realistic RFQ during the hackathon:

ABC Industrial Solutions requires 50 pressure transmitters, range 0–10 bar, 4–20 mA output, IP67 protection and delivery within 3 weeks.

QuotePilot should:

Extract the requirements.

Normalize the specifications.

Identify that process connection size is missing.

Block the quote if the field is mandatory.

Generate a clarification request.

Continue after clarification/approved override.

Match catalogue products.

Check stock and lead time.

Calculate pricing and margin.

Run approvals.

Generate the final quotation.

Record the complete audit trail.

📈 Evaluation Metrics

QuotePilot should be evaluated using measurable metrics.

Area

Metric

Extraction

Exact Match / F1

Requirement Coverage

Required-field coverage

Retrieval

Recall@K / MRR

Validation

Unsupported assumption rate

Pricing

Arithmetic test accuracy

Safety

Blocked invalid quote rate

Workflow

Human override rate

Performance

Processing latency

Cost

AI cost per RFQ

UX

Time-to-approved-quote

🧪 Testing Strategy

Unit Tests

✓ Pricing calculation
✓ Discount calculation
✓ Margin calculation
✓ FX conversion
✓ Tax calculation
✓ Permission checks
✓ Quote versioning
✓ Quote status transitions

AI Evaluation

✓ Requirement extraction
✓ Missing-field detection
✓ Product retrieval
✓ Evidence grounding
✓ Conflicting specification detection
✓ Hallucination resistance

Security Tests

✓ Authentication
✓ Authorization
✓ Tenant isolation
✓ CSRF
✓ XSS
✓ SQL injection
✓ File upload validation
✓ Session invalidation

🧰 Suggested Technology Stack

Layer

Technology

Frontend

React + TypeScript

UI

Tailwind CSS

Backend

Python + FastAPI

AI

Gemini / compatible structured-output LLM

Agent Orchestration

LangGraph / ADK

Database

PostgreSQL

Vector Search

pgvector

Authentication

Secure sessions / JWT architecture

PDF

Server-side PDF generation

Container

Docker

Deployment

Cloud Run / equivalent

Monitoring

Structured logs + metrics

The implementation can be adapted to the team's available infrastructure.

📁 Suggested Repository

quotepilot-ai/
│
├── apps/
│   ├── web/
│   └── api/
│
├── services/
│   ├── ai-engine/
│   ├── commercial-engine/
│   ├── approval-service/
│   ├── audit-service/
│   └── currency-service/
│
├── packages/
│   ├── types/
│   ├── validation/
│   └── ui/
│
├── database/
│   ├── migrations/
│   └── seeds/
│
├── docs/
│   ├── architecture/
│   ├── diagrams/
│   ├── api/
│   └── demo/
│
├── tests/
│
├── docker-compose.yml
├── .env.example
└── README.md

⚡ Quick Start

These commands are a reference implementation structure. Adjust them to match the actual repository.

Clone

git clone <YOUR_REPOSITORY_URL>
cd quotepilot-ai

Frontend

cd apps/web
npm install
npm run dev

Backend

cd apps/api
python -m venv .venv

Windows:

.venv\Scripts\activate

Linux/macOS:

source .venv/bin/activate

Then:

pip install -r requirements.txt
uvicorn main:app --reload

Environment

Create .env from .env.example.

Example:

DATABASE_URL=
AI_API_KEY=
JWT_SECRET=
APP_ENV=development

DEFAULT_CURRENCY=INR
SUPPORTED_CURRENCIES=INR,USD,EUR,GBP,AED,SGD,AUD,CAD,JPY,CHF

FX_PROVIDER=
STORAGE_BUCKET=

Never commit secrets to Git.

🎬 Make the GitHub README Interactive

For the repository, add these assets:

docs/
└── demo/
    ├── dashboard.png
    ├── rfq-upload.gif
    ├── clarification.gif
    ├── product-matching.gif
    ├── approval.gif
    └── final-quote.gif

Then place a hero demo directly below the project title:

<p align="center">
  <img src="docs/demo/quotepilot-demo.gif" width="900" alt="QuotePilot AI Demo">
</p>

Recommended README visual sequence

HERO
 ↓
30-second GIF
 ↓
Problem
 ↓
Solution
 ↓
Interactive workflow
 ↓
Dashboard screenshot
 ↓
AI agents
 ↓
Architecture
 ↓
Security
 ↓
Tech stack
 ↓
Quick Start
 ↓
Demo
 ↓
Roadmap
 ↓
Team

This makes the repository feel like a product landing page, not just a technical document.

🗺️ Roadmap

PHASE 1 ─────────────── MVP
│
├─ RFQ upload
├─ Requirement extraction
├─ Catalogue matching
├─ Pricing rules
├─ Margin validation
├─ Approval workflow
└─ PDF quotation

PHASE 2 ─────────────── PILOT
│
├─ Multi-user SaaS
├─ Multi-tenant architecture
├─ Multi-currency
├─ Audit trail
├─ Notifications
└─ Customer management

PHASE 3 ─────────────── COMMERCIAL
│
├─ Email integration
├─ ERP / CRM integrations
├─ Advanced catalogue ingestion
├─ Analytics
├─ Usage billing
└─ Enterprise controls

🎯 Hackathon Demo

The 3-minute story

00:00  Problem
   ↓
00:20  QuotePilot introduction
   ↓
00:40  Upload RFQ
   ↓
01:00  AI extracts requirements
   ↓
01:20  Missing specification detected
   ↓
01:40  Product matching
   ↓
02:00  Price + margin
   ↓
02:20  Approval workflow
   ↓
02:40  Final quotation
   ↓
03:00  Why QuotePilot

Closing line

“We are not building an AI that simply writes quotations. We are building a governed system that turns an unstructured customer request into a commercially validated quotation, while keeping humans responsible for the final commitment.”

🚧 MVP Scope

✅ In MVP

RFQ upload

Structured extraction

Specification normalization

Missing specification detection

Product matching

Simulated catalogue

Simulated inventory

Pricing engine

Margin guardrail

Approval workflow

Quote generation

PDF export

Audit trail

Demo authentication

🔮 Later

Real ERP integration

CRM integration

Email ingestion

WhatsApp integration

Production inventory synchronization

Automated customer communication

Advanced analytics

Enterprise SSO

Usage-based billing

⚠️ Demo Data Disclaimer

The hackathon prototype may use:

fictional customers

simulated products

simulated prices

simulated inventory

simulated tax data

simulated exchange rates

mock integrations

These values should be clearly labelled DEMO / SIMULATED.

The prototype must not accidentally send real external quotations or perform real commercial transactions.

👨‍💻 Team

Adarsh Verma

Co-Founder · Product & Technology

Full-stack application development

AI/agent workflow design

Backend architecture

Database systems

Product engineering

Technical execution

Add the second team member here when their details are finalized.

🧭 Product Philosophy

QuotePilot follows five principles:

1. AI should assist — not silently decide.

2. Financial calculations should be deterministic.

3. Missing information should become a visible blocker.

4. Critical actions should require appropriate approval.

5. Every important decision should be traceable.

📚 Documentation

Recommended project documentation:

Software Requirements Specification

System Architecture

API Documentation

Database Design

Security Model

AI Agent Design

Testing Strategy

Demo Script

Project Report

If these files do not exist yet, create them before keeping the links above.

⭐ What Makes QuotePilot Different?

Traditional workflow
──────────────────────────────────────────────
RFQ → Human → Excel → Catalogue → Email → Quote


Generic AI chatbot
──────────────────────────────────────────────
RFQ → AI → Text


QuotePilot
──────────────────────────────────────────────
RFQ
 ↓
Extraction
 ↓
Normalization
 ↓
Clarification Gate
 ↓
Evidence-backed Product Matching
 ↓
Deterministic Commercial Engine
 ↓
Margin Guardrails
 ↓
Approval Chain
 ↓
Versioned Audit Trail
 ↓
Human-approved Quote

The key idea:

QuotePilot does not stop at generating text. It governs the workflow that leads to a commercial commitment.

📜 License

Add the project's chosen license here before public release.

Example:

MIT License

<div align="center">

⚡ QuotePilot AI

Turning messy RFQs into governed, human-approved quotations.

Built for intelligent B2B sales automation.

<br>

⭐ Star the repository if you find the idea interesting.

</div>
