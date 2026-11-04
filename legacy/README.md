# StudySathi
A responsive resource discovery prototype for children and community educators in Nepal.

## Run
- `npm install`
- `npm run dev`
- `npm run build` creates `dist/` after TypeScript validation.

## Features
Exactly 15 curated resource entries, combined search and filters, resource details and original-provider links, persistent bookmarks, three learning paths, completion progress, private reflection notes and a practice NPR 500 budget. Volunteer resources and a suggested session plan support adult-guided learning.

No authentication or backend. Bookmarks, progress and notes use this browser's LocalStorage; clearing site data removes them. Users are asked not to include personal information in notes.

## Content
`src/data/resources.json` holds all original URLs and labels. Provider landing pages were located on 4 November 2026. Age ranges are editorial guidance, not provider certification. Availability, languages and suitability of specific activities require review. Rupantaran requires sign-in; Common Sense materials may require a free educator account. CFPB materials use US examples. No partnerships, learner counts or measured impact are claimed.

## Deployment
Static Vite output is hosted using `.openai/hosting.json`. Production hosting must serve index.html for client-side routes.
