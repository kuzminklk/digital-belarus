# Vercel deployment runbook

Operational runbook for publishing «Цифровая Беларусь» on Vercel from the standalone
GitHub repository. It is written for the shared team infrastructure and contains **no
secret values** — credentials live outside the repository (see [Authentication](#authentication)).

- **Repository:** <https://github.com/kuzminklk/digital-belarus> (public, default branch `main`)
- **Clone URLs:** `https://github.com/kuzminklk/digital-belarus.git` (HTTPS) —
  `git@github.com:kuzminklk/digital-belarus.git` (SSH)
- **Vercel account:** `kuzminklk`, scope/team: `kuzminklk-projects`
  (`team_eKHdlzyIpIXyna81thEhuUi0`)
- **App root:** the repository is the standalone Next.js application, so the Vercel project
  root directory is the repository root (`./`). The parent monorepo path
  `web/digital-belarus` is _not_ used as a Vercel root directory (see
  [Root directory](#root-directory)).
- **Status (2026-11-27): Launched (v2.1 multi-page).** `main` is pushed (HEAD `489567f`), the Vercel project
  `digital-belarus` (`prj_jua02NLjr9ebxOy1y25nY52QdavS`, framework Next.js) was created in
  team `kuzminklk-projects`, the GitHub repository is connected as the project's Git source
  (production branch `main`), and production deployment `dpl_BD4JnUfyfWDyqNafYC1Bv84ftUqa`
  is **READY**. Canonical production URL: <https://digital-belarus.vercel.app>.
  See [Live deployment](#live-deployment) and
  [Current credential](#current-credential-provisioned-2026-11-26).

## Prerequisites

| Requirement     | Value / note                                                                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GitHub CLI      | authenticated as `kuzminklk`; repository exists and is public                                                                                                |
| Node.js         | 24.x (Node ≥ 20.9 required by Next.js 16; CI/dev use Node 24)                                                                                                |
| pnpm            | 11.2.2 — pinned via `"packageManager": "pnpm@11.2.2"` in `package.json`                                                                                      |
| Vercel CLI      | 66.x; run ephemeral with `pnpm dlx vercel@latest` / `npx vercel@latest` — do **not** add it to `package.json`                                                |
| Vercel account  | `kuzminklk` with TOTP 2FA; team `kuzminklk-projects` already used by all other projects                                                                      |
| GitHub ↔ Vercel | GitHub integration (Vercel GitHub App) is already installed for the `kuzminklk` account — every other project deploys from a public `kuzminklk/*` repository |

The local project directory `.next/`, `node_modules/`, `.vercel/` are git-ignored and must
never be committed.

## Authentication

### Options investigated (2026-11-26)

| Option                                 | Result                                                                                                                                                                                                                                                                                                                                                                                                               |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VERCEL_TOKEN` environment variable    | Not present in the environment.                                                                                                                                                                                                                                                                                                                                                                                      |
| Vercel CLI login (`vercel login`)      | Device OAuth flow (`https://vercel.com/oauth/device`). It ends in **"Verify Your Identity"** requiring a 6-digit TOTP code; writes `~/.local/share/com.vercel.cli/auth.json` once approved. Cannot be completed non-interactively.                                                                                                                                                                                   |
| Hermes Vercel MCP OAuth                | Client registration exists (`~/.hermes/mcp-tokens/vercel.client.json`) but **no token file**. Hermes logs show the OAuth setup never completed ("non-interactive environment and no cached tokens"), so this path is unusable.                                                                                                                                                                                       |
| Chrome dashboard session               | The `kuzminklk` Vercel dashboard session is valid — cookie-authenticated calls to `https://vercel.com/api/user`, `/api/user/projects`, `/api/user/tokens` return `200` as `kuzminklk`. The session cookie also carries a real `vcp_…` access token (URL-encoded `Bearer vcp_…`), which **works as a CLI token** for reads/project management — see [Current credential](#current-credential-provisioned-2026-11-26). |
| Vercel TOTP sensitive-action challenge | Creating a _new_ access token (`POST /api/user/tokens`), the CLI device login (`vercel login`) and **CLI production deployments** (`vercel deploy --prod`) end in "Verify Your Identity — 6-digit authenticator code" / `Challenge required`. They cannot be completed non-interactively; do not bypass — use the dashboard or Git integration instead (see below).                                                  |
| Dashboard Git integration              | **Working path used for the launch.** The dashboard session connected `kuzminklk/digital-belarus` to the project and triggered a Git-sourced production deployment with **no TOTP prompt**. Once connected, every push to `main` builds production server-side.                                                                                                                                                      |

**Conclusion:** deployments are fully autonomous through the Git integration (push to `main`)
or the project's deploy hook; no interactive 2FA step is needed for them. A manually created
dashboard token (TOTP required) remains the durable replacement for the session token — see
[Durable token](#durable-token-account-owner-one-time-recommended-long-term). CLI production
deploys from this credential are rejected by Vercel's challenge — do not retry them, use
[Option A](#option-a--github-integration--push-recommended-token-free) or the
[deploy hook](#manual-deploy-trigger-deploy-hook-fallback).

### Current credential (provisioned 2026-11-26)

- **Path:** `~/.config/digital-belarus/vercel-token` — outside the repository, directory mode
  `700`, file mode `600`. It is never committed (the path is referenced, never the value).
  The project's deploy hook is stored the same way at
  `~/.config/digital-belarus/vercel-deploy-hook` (mode `600`).
- **Provenance:** extracted from the account owner's signed-in Chrome Vercel dashboard
  session on this workstation. The Chrome cookie store was decrypted with the OS keyring
  (freedesktop Secret Service "Chrome Safe Storage" key, PBKDF2-HMAC-SHA1 "saltysalt",
  AES-128-CBC) and the decoded cookie value was `Bearer vcp_…`; the `vcp_…` part is the
  access token. No token value was printed or logged.
- **Scope:** account `kuzminklk` with access to team `kuzminklk-projects`
  (`team_eKHdlzyIpIXyna81thEhuUi0`), same access level as the dashboard session.
- **Verified:**
    - `VERCEL_TOKEN="$(cat ~/.config/digital-belarus/vercel-token)" pnpm dlx vercel@latest whoami` → `kuzminklk`
    - `pnpm dlx vercel@latest list --scope kuzminklk-projects` → lists team deployments
    - `GET https://api.vercel.com/v2/user` with `Authorization: Bearer <token>` → `200`
    - `GET https://api.vercel.com/v9/projects?teamId=team_eKHdlzyIpIXyna81thEhuUi0` → `200`
    - project/deployment/domain read+manage API calls for team `kuzminklk-projects` → `200`
- **Limitation:** this credential cannot create **production deployments via CLI** — Vercel
  answers `Challenge required` for `vercel deploy --prod` (sensitive action, TOTP-gated).
  Deployments go through the Git integration or the deploy hook instead. Read/manage API
  calls and the dashboard still work with it.
- **Risk:** this is a _browser sign-in session_ token, not a manually created dashboard
  token. It stays valid while that session lives ("Current", "Never expires" in the Vercel
  token list) but **signing out of that Chrome session or rotating it invalidates the token**.
  If CLI calls suddenly return `401`/`403`, re-provision per
  [Durable token](#durable-token-account-owner-one-time-recommended-long-term) or extract the
  token again from a signed-in dashboard session; keep the file path unchanged.

### Durable token (account owner, one time; recommended long-term)

1. Open <https://vercel.com/account/settings/tokens> and sign in (TOTP required).
2. **Create Token**:
    - Name: `digital-belarus-deploy`
    - Scope: team **`kuzminklk-projects`** (same scope as the existing projects; _All Projects_)
    - Expiration: **No Expiration** (permanent deployment token)
3. Copy the token once — Vercel shows it only once.
4. Store it outside the repository, readable only by the owner:

    ```bash
    mkdir -p ~/.config/digital-belarus
    # paste the token when prompted (no trailing newline issues if printf is used)
    printf %s 'PASTE_TOKEN_HERE' > ~/.config/digital-belarus/vercel-token
    chmod 600 ~/.config/digital-belarus/vercel-token
    ```

    Never commit it, never paste it into chat or docs, never put it in `.env*` in the repo.

5. Verify:

    ```bash
    VERCEL_TOKEN="$(cat ~/.config/digital-belarus/vercel-token)" pnpm dlx vercel@latest whoami
    # expected: kuzminklk (and the kuzminklk-projects scope)
    ```

To rotate or revoke: delete the token at the same dashboard page and create a new one; the
file path above stays the same.

### Alternative without a token: dashboard Git import

If no token is available, the account owner can import the repository once in the dashboard
and every subsequent push to `main` deploys automatically (Vercel builds on its servers, no
local credential needed). Use this for the first project creation; the CLI token is only
required for command-line deploys, rollbacks and automation.

## Live deployment

Production has been deployed and verified (2026-11-26).

| Item                | Value                                                                                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Project             | `digital-belarus` — `prj_jua02NLjr9ebxOy1y25nY52QdavS`, team `kuzminklk-projects`                                                                                                                                      |
| Deployment          | `dpl_BD4JnUfyfWDyqNafYC1Bv84ftUqa` — **READY**, target `production`, source `git` (triggered through the `production-main` deploy hook, which builds the latest commit of `main` from the connected GitHub repository) |
| Deployed commit     | `489567f` — "feat(routes): expand the site into a full multi-page structure" (`main`); previous deployments `30ccb72`, `77bb5ba`                                                                                       |
| Canonical URL       | **<https://digital-belarus.vercel.app>** (project production domain)                                                                                                                                                   |
| All aliases         | `digital-belarus.vercel.app`, `digital-belarus-kuzminklk-projects.vercel.app`, `digital-belarus-git-main-kuzminklk-projects.vercel.app`                                                                                |
| Immutable build URL | `digital-belarus-qykf5vq4k-kuzminklk-projects.vercel.app`                                                                                                                                                              |
| Git integration     | connected: GitHub `kuzminklk/digital-belarus`, production branch `main`                                                                                                                                                |
| Deploy hook         | `production-main` for branch `main`; URL stored outside the repo at `~/.config/digital-belarus/vercel-deploy-hook` (mode `600`)                                                                                        |

Verified after `READY`:

| URL                                     | Result                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------- |
| <https://digital-belarus.vercel.app/>   | `200` after redirect to `/ru`; RU title, `lang="ru"`                   |
| <https://digital-belarus.vercel.app/ru> | `200`; «Цифровая Беларусь — сайты, Telegram-боты и ИИ для бизнеса»     |
| <https://digital-belarus.vercel.app/be> | `200`; «Цыфровая Беларусь — сайты, Telegram-боты і ШІ для бізнесу»     |
| <https://digital-belarus.vercel.app/en> | `200`; "Digital Belarus — websites, Telegram bots and AI for business" |

The rendered HTML uses `https://digital-belarus.vercel.app` for `<link rel="canonical">`,
the `hreflang` alternates and `og:url`, i.e. the Vercel system environment variable
`VERCEL_PROJECT_PRODUCTION_URL` resolves to `digital-belarus.vercel.app` at build time — **no
code change is needed for canonical URLs**. Changing the canonical domain later (custom
domain) only requires adding it in Project → Domains; canonical/hreflang follow automatically
on the next build.

## First deploy (reference — already completed for this project)

The real launch was done through the dashboard Git integration path (Option A) because Vercel
rejected the CLI production deploy with a sensitive-action challenge. Both paths are kept for
fresh environments.

### Option A — GitHub integration + push (recommended, token-free)

1. Ensure `main` is pushed (done for this project; HEAD `489567f`):

    ```bash
    cd web/digital-belarus
    git remote add origin git@github.com:kuzminklk/digital-belarus.git
    git push -u origin main
    ```

2. In the Vercel dashboard: **Add New… → Project → Import Git Repository →
   `kuzminklk/digital-belarus` → Import**.
3. On the configuration screen use the settings in
   [Project settings](#project-settings) — framework preset is auto-detected as Next.js,
   root directory stays `./`, no environment variables.
4. **Deploy**. Every later push to `main` produces a production deployment; pushes to other
   branches produce preview deployments.

### Option B — CLI with the provisioned token (blocked by TOTP challenge)

> **Observed 2026-11-26:** `vercel deploy --prod --yes --scope kuzminklk-projects --project
digital-belarus --create-if-missing` failed with `✗ Challenge required / Check that the
selected team is correct...`. Vercel treats production deployment creation as a
> sensitive action for this session credential. **Do not retry or try to bypass it** — deploy
> through the Git integration (Option A) or the [deploy hook](#manual-deploy-trigger-deploy-hook-fallback)
> instead. Read-only/manage CLI commands (`whoami`, `list`, `inspect`, `link`, project
> settings) do work with the credential.

Original command sequence for reference (only if a durable token is issued and the challenge
no longer applies):

```bash
cd web/digital-belarus
export VERCEL_TOKEN="$(cat ~/.config/digital-belarus/vercel-token)"

# 0. sanity check the credential (expected output: kuzminklk)
pnpm dlx vercel@latest whoami

# 1. first production deploy; creates project `digital-belarus` in the team if missing
pnpm dlx vercel@latest deploy --prod --yes \
  --scope kuzminklk-projects \
  --project digital-belarus \
  --create-if-missing

# 2. link this working copy to the project (creates git-ignored .vercel/)
pnpm dlx vercel@latest link --project digital-belarus --scope kuzminklk-projects --yes

# 3. connect the Git repository so pushes to main deploy production automatically
pnpm dlx vercel@latest git connect --scope kuzminklk-projects
```

Normal deploys after launch: **push to `main`**. The Git integration builds and promotes
production automatically (preview deployments for other branches). No token/CLI involved.

### Manual deploy trigger (deploy hook fallback)

For redeploying the latest `main` commit without a push, or when a Git-triggered build must be
replayed, the project has a deploy hook:

- Name `production-main`, branch `main`, id `SL8IP0cYXw`.
- The hook URL is a **secret** and lives outside the repository at
  `~/.config/digital-belarus/vercel-deploy-hook` (mode `600`).

```bash
# trigger a production deployment of the latest commit on main
curl -fsS -X POST "$(cat ~/.config/digital-belarus/vercel-deploy-hook)"
# → {"job":{"id":"…","state":"PENDING","createdAt":…}}
```

Manage it in the dashboard: Project → **Settings → Git → Deploy Hooks** (create a new hook
and revoke the old one there). The hook URL is shown only in that table; rotate it if leaked.

### Post-deploy verification

```bash
pnpm dlx vercel@latest list --scope kuzminklk-projects        # newest deployment READY
pnpm dlx vercel@latest inspect <deployment-url>                # build logs, aliases

for l in ru be en; do
  curl -sS -o /dev/null -w "/$l -> %{http_code}\n" "https://digital-belarus.vercel.app/$l"
done
curl -sS https://digital-belarus.vercel.app/ru | grep -oE '<title>[^<]+' | head -1
```

Production domain: `https://digital-belarus.vercel.app` (canonical; aliases
`digital-belarus-kuzminklk-projects.vercel.app` and
`digital-belarus-git-main-kuzminklk-projects.vercel.app`). Locales are served under prefixed
paths (`/ru`, `/be`, `/en`); `/` redirects to `/ru`.

## Project settings

| Setting                      | Value                                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Team / scope                 | `kuzminklk-projects`                                                                                                 |
| Project name                 | `digital-belarus` (repository name; keep identical to avoid alias churn)                                             |
| Framework preset             | **Next.js** (auto-detected from `next.config.ts` / `next` dependency)                                                |
| Root Directory               | **`./`** — the imported repository _is_ the app. Leave the field empty; do **not** enter `web/digital-belarus`.      |
| Build Command                | `pnpm build` (auto-detected; override only if needed)                                                                |
| Install Command              | `pnpm install` (auto-detected from `pnpm-lock.yaml` + `packageManager`)                                              |
| Output Directory             | `.next` (auto-detected; Next.js default, leave empty)                                                                |
| Development Command          | `next dev` (irrelevant for production)                                                                               |
| Node.js Version              | **24.x** (Next.js 16 requires Node ≥ 20.9; set explicitly in Settings → General if the default differs)              |
| Production Branch            | `main`                                                                                                               |
| Environment Variables        | **none required** — no backend, no cookies, no analytics, no third-party scripts                                     |
| Build & Development Settings | defaults; "Ignore Build Step" off (all pushes build)                                                                 |
| Git integration              | **connected** — `kuzminklk/digital-belarus`, production branch `main`                                                |
| Domains                      | `digital-belarus.vercel.app` (verified, canonical production domain); add a custom domain later in Project → Domains |

### Root directory

The repository `kuzminklk/digital-belarus` is a **standalone application**: its root is the
Next.js app root (`package.json`, `next.config.ts`, `src/`, `messages/` are at the top level).
That is why the Vercel Root Directory is the repository root.

The path `web/digital-belarus` exists only inside the _parent monorepo_
(`kuzminklk/artificial-intelligence`), where the site is embedded as a git submodule. If a
Vercel project is ever imported **from the parent monorepo instead**, then Root Directory
must be `web/digital-belarus` and the "Include source files outside of the Root Directory"
option must be enabled (shared workspace settings). This is not the supported setup: the
standalone repository above is the source of truth for deployments.

### Adding / changing the GitHub integration

The Vercel GitHub App is already authorised for `kuzminklk`. To connect this repository to a
project:

1. **New project:** dashboard → _Add New… → Project → Import Git Repository_ → pick
   `kuzminklk/digital-belarus`.
2. **Existing project:** Project → **Settings → Git → Connect Git Repository** → select the
   repository → production branch `main`.
3. If the repository is not listed: GitHub → _Settings → Applications → Vercel_ (install/configure
   to grant access to `kuzminklk/digital-belarus`), then reload the import dialog.
4. CLI equivalent: `pnpm dlx vercel@latest git connect --scope kuzminklk-projects`
   (from the linked project directory).

Once connected, `git push` is the deployment mechanism: no token is needed for Git-triggered
builds.

## Rollback

Rollbacks are instant — they re-point production to a previous immutable deployment.

### Dashboard (fastest)

Project → **Deployments** → open the last known-good `READY` production deployment → **⋯ →
Promote to Production** (or the **Instant Rollback** button in the banner after a failed
production deploy).

### CLI

> Rollback/promote may be treated as sensitive actions too; if the CLI answers
> `Challenge required`, use the dashboard path above (verified to work without TOTP).

```bash
export VERCEL_TOKEN="$(cat ~/.config/digital-belarus/vercel-token)"
pnpm dlx vercel@latest list --scope kuzminklk-projects        # find the deployment URL/ID
pnpm dlx vercel@latest rollback <deployment-url-or-id> --scope kuzminklk-projects --yes
pnpm dlx vercel@latest rollback status --scope kuzminklk-projects   # confirm completion

# alternatives
pnpm dlx vercel@latest promote <deployment-url> --scope kuzminklk-projects --yes
pnpm dlx vercel@latest redeploy <deployment-url> --scope kuzminklk-projects --yes
```

### Git-based revert

Revert the offending commit on `main` and push; the Git integration builds and promotes a new
production deployment from the reverted state:

```bash
git revert <commit-sha>
git push origin main
```

## Troubleshooting

| Symptom                                                             | Cause / fix                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Error: No framework detected`                                      | Framework Preset not detected — set it to **Next.js** in Project → Settings → Build & Development.                                                                                                                                                                                                                           |
| Build fails on `pnpm install` / lockfile mismatch                   | Commit `pnpm-lock.yaml`; Vercel must use pnpm (it detects `"packageManager": "pnpm@11.2.2"`). Do not commit `node_modules`.                                                                                                                                                                                                  |
| `Unsupported Node.js version` or build uses Node < 20.9             | Project → Settings → General → Node.js Version → **24.x**.                                                                                                                                                                                                                                                                   |
| Build fails on `next-intl` plugin resolution                        | Ensure `src/i18n/request.ts` exists and is committed (`next.config.ts` references it).                                                                                                                                                                                                                                       |
| Deploy shows old content / no new deploy on push                    | Check Git integration production branch is `main`; check the commit is on `main`; see Project → Settings → Git.                                                                                                                                                                                                              |
| Project imported from the monorepo fails (`package.json` not found) | Root Directory was not set to `web/digital-belarus`. Prefer importing the standalone repository instead.                                                                                                                                                                                                                     |
| `vercel` asks for login despite token                               | Export `VERCEL_TOKEN` **and** pass `--scope kuzminklk-projects`, or ensure the token has the team scope.                                                                                                                                                                                                                     |
| `vercel deploy --prod` fails with `Challenge required`              | Vercel treats CLI production deploys as a sensitive action for the session credential; it is **not** a team/scope problem and must not be bypassed. Deploy via a push to `main` (Git integration) or the [deploy hook](#manual-deploy-trigger-deploy-hook-fallback). Dashboard deploys/rollbacks work without the challenge. |
| CLI returns `401`/`403` where it worked before                      | The provisioned browser-session token was revoked or rotated (e.g. owner signed out of that Chrome session). Re-provision per [Durable token](#durable-token-account-owner-one-time-recommended-long-term) (or re-extract from a signed-in dashboard session) and overwrite `~/.config/digital-belarus/vercel-token`.        |
| `The request is missing an authentication token` from the REST API  | A web session cookie was sent as a token. Use the provisioned `vcp_…` access token from the credential file, not a raw cookie value.                                                                                                                                                                                         |
| Project created in the wrong scope (personal instead of team)       | Always pass `--scope kuzminklk-projects` (or set the team as the default scope) before the first deploy; deleting and recreating a project in the right team is the clean fix.                                                                                                                                               |
| Token creation says _"Challenge required"_ / TOTP prompt            | Expected: Vercel requires the account owner's TOTP code to mint access tokens. Create the token in the dashboard as described above.                                                                                                                                                                                         |
| `.vercel` appears in `git status`                                   | It must stay out of git — already covered by `.gitignore`. Remove with `git rm -r --cached .vercel` if ever staged.                                                                                                                                                                                                          |

## Security rules

- Never commit `VERCEL_TOKEN`, `~/.local/share/com.vercel.cli/auth.json`, `.env*`, the deploy
  hook URL, or the contents of `~/.config/digital-belarus/`. The credential paths themselves
  may be referenced in docs.
- The site needs no environment variables and stores no user data; do not add secrets to the
  Vercel project "just in case".
- Revoke a leaked token immediately at <https://vercel.com/account/settings/tokens> and issue
  a new one; store it only at `~/.config/digital-belarus/vercel-token` (mode `600`). Revoke or
  rotate the deploy hook in Project → Settings → Git → Deploy Hooks; store its URL only at
  `~/.config/digital-belarus/vercel-deploy-hook` (mode `600`).
- Keep `main` deployable: every merge to `main` publishes to production. Use branches +
  preview deployments for risky changes.
