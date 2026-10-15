# ALIENS Performance Intelligence

Responsive bilingual (Arabic/English) analytics dashboard for the full ALIENS student activity. Includes interactive KPI views, committee comparisons, trend charts, and configurable Google Sheets/Form links.

## Run locally

    npm install
    npm run dev

Quality checks:

    npm run lint
    npm run build

## Google Sheets connection

1. Open Data sources in the dashboard and choose Add a source.
2. Add a source name and a Google Sheets URL. A Google Form URL is optional and saved as a shortcut for the team.
3. For this static version, make the spreadsheet publicly readable (Share → General access → Anyone with the link → Viewer, or File → Share → Publish to web).
4. For Google Forms, open Responses → Link to Sheets, then add that response spreadsheet as a data source.
5. Select Sync data. Imported numeric rows power the charts and tables.

Recommended long-format columns:
- Period or Date
- Committee
- Metric or KPI
- Value or Actual
- Optional: Target, Unit, Notes

Wide format is also supported when rows include Date/Period, Committee, and numeric KPI columns. English and Arabic column labels are recognized. Sheet tabs can be selected by including their gid in the URL.

## Integration and privacy notes

- Form links are saved as shortcuts; response data is read from the linked response spreadsheet, not the Form URL itself.
- Publicly readable Sheets are required for this static-site connector. Private Sheets need Google OAuth and a trusted backend. Never put service-account credentials or private API secrets in frontend code.
- Source configuration and imported rows are stored in the current browser's local storage. They are not shared with other team members or devices, and the dashboard does not push edits back into Google Sheets.
- Demo values are clearly labelled and replaced in the analytics view once a live source imports successfully.
- This version does not provide authentication, row-level permissions, scheduled background sync, or reminders.

## GitHub Pages deployment

The workflow at .github/workflows/deploy.yml runs on every push to main, performs the TypeScript check and production build, then deploys dist to GitHub Pages. Vite's base path is configured for this repository name: dash-bord.

If the first deployment fails because Pages is not enabled, open Repository Settings → Pages → Build and deployment → Source → GitHub Actions, save, and re-run the workflow. After deployment, GitHub exposes the live URL under Settings → Pages (normally https://osamatharwat.github.io/dash-bord/).

The dashboard-checks.yml workflow also runs build/type checks on pull requests and pushes to development branches.
