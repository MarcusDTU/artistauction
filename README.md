# Artist Auction 

This repository contains the Artist Auction frontend (React + Material UI) under `artauction/web`. It is a Create React App (CRA) project configured with tests and code‑coverage, and is deployable to GitHub Pages.

## Available Scripts

In `artauction/web/package.json`:

- `npm start` – Start the dev server
- `npm test` – Run tests in watch mode
- `npm run build` – Production build in `build/`

## Testing
- Run tests (watch):
  - `cd artauction/web && npm test`

### Code Coverage
  -  Run test coverage
  - `cd artauction/web && npm test -- --coverage --watchAll=false`


## Common Tasks

- Install dependencies cleanly:
  - `cd artauction/web: npm i`

## Supabase Setup


- If you want top push database from CLI then use these cpmmands: (Optional)
- Initialize CLI state (creates `supabase/` folder under `artauction/web` when you run it the first time)
  - `cd artauction/web`
  - `npm run supabase:login` (opens browser to authenticate)
  - `npm run supabase:init`
  - Link the project:
    - PowerShell/CMD: `npx supabase link --project-ref qakvpogpkoujwownqkqt`     

- Push database (migrations) via terminal
  - With SQL migrations under `artauction/web/supabase/migrations/`:
    - `npm run db:push`
  - Open local Studio to inspect DB:
    - `npm run db:studio`
- NOTE: If Push database not working from terminal then go to sql editor in supabase and paste sql code there. And run. 

- Use in code
  - Import the client from `artauction/web/src/lib/supabaseClient.js` and call Supabase APIs. Example:
    - `import { supabase } from '../lib/supabaseClient';`
    - `const { data, error } = await supabase.from('artworks').select('*');`
## Test
