# QuotePilot AI structure

## Runtime

`index.html` is the browser entry point. It loads the stylesheet and runtime from `src/css` and `src/js`.

## Folders

- `src/css`: application and responsive styles
- `src/js`: SPA state, view renderers, routing, and interactions
- `src/pages`: page and route documentation; views are currently rendered client-side
- `src/data`: demo configuration and sample quotation data
- `docs`: project architecture and implementation notes

## Product flow

Landing -> Create Quotation -> Requirement Analysis -> Product Matching -> Pricing -> Validation -> Preview -> Human Approval -> Sent.

The prototype keeps pricing and approval logic in the browser for demonstration. A production implementation should move catalog, pricing rules, identity, document generation, and email delivery behind authenticated APIs.
