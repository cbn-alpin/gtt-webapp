# GTT Webapp - AI Assistant Instructions

Frontend for **Gestion du Temps de Travail** (GTT) - a time tracking and expense management application.

## Quick Context

- **Stack**: Angular 15 with Material Design
- **API**: Connects to Flask REST API (gtt-api) running on localhost:5000
- **Dev Server**: `npm start` → http://localhost:4200 (auto-reload)
- **Authentication**: JWT tokens from `/api/auth` endpoints
- **Locale**: French (dates, paginator, labels)

## Setup & Execution

```bash
# Install Node version from .nvmrc
nvm install && nvm use

# Install dependencies
npm install

# Development
npm start           # ng serve (port 4200)
npm test            # Karma/Jasmine tests
npm run cypress:open  # E2E tests
npm run build       # Production build → dist/
```

## Frontend Structure

```
src/app/
├── app.module.ts           # Material imports, i18n config (FRENCH_DATE_FORMATS, FrenchPaginatorIntl)
├── app-routing.module.ts   # Routes with guards
├── components/             # Feature components (projects, users, calendar, timesheet, expenses)
├── core/                   # Singletons: auth config, date formats
├── guards/                 # Route guards (auth protection)
├── services/               # HTTP services → API calls
├── models/                 # TypeScript interfaces (API response types)
└── popup-message/          # Global notification system
```

## Key Patterns

**Material Design:**
- All UI uses Angular Material v15 (no Bootstrap)
- Date handling: `MomentDateAdapter` with `FRENCH_DATE_FORMATS` config
- Form validation: `ReactiveFormsModule` with Material form fields

**HTTP Services:**
- Located in `src/app/services/`
- Call Flask API with `http://localhost:5000/api/` prefix
- Include JWT token in `Authorization` header (auto-handled by interceptor)

**Components Structure:**
- Declare in `app.module.ts`
- Register routes in `app-routing.module.ts`
- Use Material dialogs for confirmations/forms
- Apply French locale formatting (dates, currency)

**Example: Adding a Feature:**
1. Generate component: `ng generate component components/{name}`
2. Create service: `src/app/services/{name}.service.ts` → call API endpoints
3. Add route: `app-routing.module.ts`
4. Import Material modules in `app.module.ts`
5. Use French date format from `core/config/date-formats.ts`

## Environment Configuration

**Development:**
- API: `http://localhost:5000` (hardcoded or env-based)
- Config file: `src/environments/environment.ts` (Angular build-time)

**Production:**
- Built to `dist/` folder
- Served by Nginx (see `nginx.conf`)
- Docker build: `dockerfile` (multi-stage with Node)

## Development Workflows

**Testing:**
```bash
npm test            # Watch mode (Karma/Jasmine)
npm run cypress:open   # Cypress GUI for E2E
npm run cypress:run    # Headless Cypress
```

**Debugging:**
- Chrome DevTools for Angular Inspector
- Check Network tab for API calls
- Use `ng serve --source-map` for better debugging

**Code Quality:**
```bash
npm run lint        # ESLint (if configured)
ng build --prod    # Optimized production build
```

## API Communication Pattern

```typescript
// Example service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private http: HttpClient) {}

  getProjects() {
    return this.http.get('/api/projects');  // Flask returns JSON
  }
}
```

**Response Format:** All API responses follow Flask error structure:
```json
{
  "status": "error|success",
  "type": "ERROR_TYPE",
  "code": "CODE_KEY",
  "message": "..."
}
```

## Project-Specific Conventions

- **Naming**: `camelCase` for services, components, variables
- **Routes**: Lazy-loaded modules recommended for large features
- **Date Handling**: Always use `FRENCH_DATE_FORMATS` for display
- **Material Modules**: Import only needed modules in `app.module.ts`
- **No External Services**: Google Sheets/GEFIPROJ config in backend only

## CI/CD Pipeline

- GitHub Actions builds Docker image on push to `main`/`develop`
- Multi-stage Dockerfile: Node build stage → Nginx serving
- Automatic deployment to staging on `develop` merge

## Git Workflow

- Default branch: `main` (production)
- Development: `develop` branch
- Feature branches follow conventional commits
