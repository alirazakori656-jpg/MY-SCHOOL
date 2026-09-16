# THE SMART MODERN PUBLIC SCHOOL QAMBER
## School Management System (Frontend Demo)

Professional multi-page school ERP built with HTML5, CSS3, Vanilla JavaScript, Bootstrap 5, Font Awesome, and Chart.js.  
Data persists in **LocalStorage** and is clearly marked **DEMO ONLY**.

### Demo credentials (not real accounts)

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Principal | principal | principal123 |
| Teacher | teacher | teacher123 |
| Accountant | accountant | accounts123 |
| Staff | staff | staff123 |

Do not use personal or production passwords.

### How to run locally

1. Download or clone this folder.
2. Serve it over HTTP (required for some browsers with modules; file:// usually works here because scripts are classic tags).

```bash
cd school-management-system
python3 -m http.server 8080
```

3. Open http://localhost:8080
4. Sign in with a demo account.

### GitHub Pages

1. Create a GitHub repository.
2. Upload the contents of `school-management-system/` to the repo root (or `/docs`).
3. Settings → Pages → Deploy from branch `main` / root (or `/docs`).
4. Visit `https://<user>.github.io/<repo>/`

### Architecture

- `js/storage.js` — `getData`, `saveData`, `updateData`, `deleteData`, `generateId`, demo seed.
- `js/auth.js` — session + role permissions (`PERMS`).
- `js/app.js` — sidebar, topbar, global search, toast, CSV, print helpers.
- Page scripts map 1:1 with HTML files.

To attach Firebase / Supabase / MySQL later, replace the bodies of `SMS.getData` / `SMS.saveData` with `fetch` calls to your API. Keep the same collection names. Hash passwords on the server; never ship API keys in this frontend.

### Print / export

Use the browser Print dialog (Save as PDF) on receipts, report cards, timetables, and reports. Lists support CSV export.

### Reset demo data

Settings → System Settings → Reset demo data, or clear site LocalStorage for this origin.
