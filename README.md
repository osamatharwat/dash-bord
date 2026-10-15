# ALIENS Performance Hub

Responsive React + TypeScript prototype for committee reporting, KPI targets, and action items.

## Important limitations

This branch is a local-browser prototype, not a production multi-user system. Sample values are illustrative. The app saves to localStorage in the current browser only. It does not authenticate users, synchronize Google Sheets, send reminders, or share data between devices.

Do not use it as the source of truth for organizational decisions until a backend, access controls, shared database, backups, and tested integrations are implemented.

## Run locally

    npm install
    npm run dev

Check types and build:

    npm run lint
    npm run build

## Current features

- Responsive overview and committee directory
- Period-specific report records and explicit missing-value handling
- KPI target evaluation with configurable higher/lower direction
- Reporting matrix and action tracker
- Local JSON backup and demo reset
- Clear status labels for unconfigured integrations

## Production work still required

1. Add an authenticated backend and shared database (for example, Supabase/PostgreSQL).
2. Add role-based access for committee leads and admins.
3. Implement server-side report validation and audit history.
4. Connect Google Sheets/Forms through authorized APIs and report real sync outcomes.
5. Add a real notification provider for reminders.
6. Add automated tests for KPI calculations, report completion, permissions, and persistence.
7. Run browser tests across mobile and desktop breakpoints before release.
