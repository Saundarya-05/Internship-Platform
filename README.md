# P24 – Is This Internship Real?

A beginner-friendly single Next.js App Router project containing three connected modules:

1. Internship Listing Service – create, read, update, delete and search listings.
2. Verification & Risk Service – rule-based risk score, reasons and reviewer decision.
3. Student Experience Repository – submit and display student internship experiences.

## Technology

Next.js App Router, React, JavaScript, Tailwind CSS, MongoDB, Mongoose, Next.js Route Handlers and Zod.

## Setup

1. Install Node.js (LTS) and MongoDB, or create a MongoDB Atlas database.
2. Open this folder in VS Code.
3. Run `npm install` in the terminal.
4. Copy `.env.example` to `.env.local`.
5. Add your MongoDB connection string to `MONGODB_URI`.
6. Set a private value for `REVIEWER_KEY` (example: `p24-review-2026`, only for local classroom demo).
7. Run `npm run dev`.
8. Open `http://localhost:3000`.

## Pages

- `/` – Dashboard
- `/internships` – Add, search, edit and delete internship listings
- `/verification` – View risk assessment and make a manual reviewer decision
- `/experiences` – Submit and read student experiences

## API routes

- `GET /api/internships?search=` – list/search internships
- `POST /api/internships` – create internship
- `GET /api/internships/:id` – get one internship
- `PUT /api/internships/:id` – update internship
- `DELETE /api/internships/:id` – delete internship
- `GET /api/experiences` – list experiences
- `POST /api/experiences` – create experience
- `PATCH /api/verification/:id` – reviewer decision (requires `x-reviewer-key` header)

## Important classroom-project limitations

- The reviewer key is a simple demo gate, not production authentication. For a real public deployment, implement proper user authentication, server-side role checks, rate limiting and audit logs.
- The risk score only checks the predefined signals in `lib/risk.js`. It cannot prove that an internship is genuine or fraudulent.
- The experience form is intentionally simple. Authentication, edit/delete permissions, moderation and spam protection should be added before public use.
- The `internshipId` field is available in the Experience model/schema for linking an experience to a listing; the current simple form keeps it optional.
