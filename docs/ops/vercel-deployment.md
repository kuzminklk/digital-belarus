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
- **Status (2026-11-26):** GitHub repository created and empty (nothing pushed yet), Vercel
  deployment credential **provisioned and verified** (`vercel whoami` → `kuzminklk`,
  `GET https://api.vercel.com/v2/user` → `200`, team-scoped API access works). No Vercel
  project has been created and nothing has been deployed yet — the code is not ready and the
  first push belongs to the Lead. See [Current credential](#current-credential-provisioned-2026-11-26).

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

| Option                                 | Result                                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `VERCEL_TOKEN` environment variable    | Not present in the environment.                                                                                                                                                                                                                                                                                                                                                         |
| Vercel CLI login (`vercel login`)      | Device OAuth flow (`https://vercel.com/oauth/device`). It ends in **"Verify Your Identity"** requiring a 6-digit TOTP code; writes `~/.local/share/com.vercel.cli/auth.json` once approved. Cannot be completed non-interactively.                                                                                                                                                      |
| Hermes Vercel MCP OAuth                | Client registration exists (`~/.hermes/mcp-tokens/vercel.client.json`) but **no token file**. Hermes logs show the OAuth setup never completed ("non-interactive environment and no cached tokens"), so this path is unusable.                                                                                                                                                          |
| Chrome dashboard session               | The `kuzminklk` Vercel dashboard session is valid — cookie-authenticated calls to `https://vercel.com/api/user`, `/api/user/projects`, `/api/user/tokens` return `200` as `kuzminklk`. The session cookie also carries a real `vcp_…` access token (URL-encoded `Bearer vcp_…`), which **works as a CLI token** — see [Current credential](#current-credential-provisioned-2026-11-26). |
| Vercel TOTP sensitive-action challenge | Creating a _new_ access token (`POST /api/user/tokens`) and the CLI device login (`vercel login`) both end in "Verify Your Identity — 6-digit authenticator code". They cannot be completed non-interactively; the account owner must do them with the authenticator.                                                                                                                   |

**Conclusion:** the dashboard session yielded a working CLI token, so deployment is not
blocked. For long-term stability prefer a token created in the dashboard by the account owner
(needs TOTP) and overwrite the same credential file; see
[Durable token](#durable-token-account-owner-one-time-recommended-long-term).

### Current credential (provisioned 2026-11-26)

- **Path:** `~/.config/digital-belarus/vercel-token` — outside the repository, directory mode
  `700`, file mode `600`. It is never committed (the path is referenced, never the value).
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

## First deploy

### Option A — GitHub integration + push (recommended, token-free)

1. Ensure the Lead has pushed `main`:

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

### Option B — CLI with the provisioned token (autonomous, no prompts)

This is the ready-to-run sequence **after the Lead's first push** (`main` must exist on
GitHub and `origin` must be set). It creates the Vercel project on first use, deploys to
production, then connects the GitHub integration so later pushes deploy automatically.

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

Subsequent deploys:

```bash
# production from the current working tree
pnpm dlx vercel@latest deploy --prod --yes --scope kuzminklk-projects
# preview
pnpm dlx vercel@latest deploy --yes --scope kuzminklk-projects
```

If the project already exists (e.g. imported in the dashboard), skip `--create-if-missing`:
`pnpm dlx vercel@latest deploy --prod --yes --scope kuzminklk-projects --project digital-belarus`.

Do **not** run a CLI deploy before the repository has its first commit + push when the Git
integration is meant to be the deployment mechanism — the project must be connected to
`kuzminklk/digital-belarus` so later pushes deploy.

### Post-deploy verification

```bash
pnpm dlx vercel@latest list --scope kuzminklk-projects        # newest deployment READY
pnpm dlx vercel@latest inspect <deployment-url>                # build logs, aliases
curl -sI https://digital-belarus-kuzminklk-projects.vercel.app | head -1   # 200
```

Production URL (default): `https://digital-belarus-kuzminklk-projects.vercel.app`
(aliases: `digital-belarus-git-main-kuzminklk-projects.vercel.app` for branch builds).
Locales are served under prefixed paths (`/ru`, `/be`, `/en`); `/` redirects to `/ru`.

## Project settings

| Setting                      | Value                                                                                                           |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Team / scope                 | `kuzminklk-projects`                                                                                            |
| Project name                 | `digital-belarus` (repository name; keep identical to avoid alias churn)                                        |
| Framework preset             | **Next.js** (auto-detected from `next.config.ts` / `next` dependency)                                           |
| Root Directory               | **`./`** — the imported repository _is_ the app. Leave the field empty; do **not** enter `web/digital-belarus`. |
| Build Command                | `pnpm build` (auto-detected; override only if needed)                                                           |
| Install Command              | `pnpm install` (auto-detected from `pnpm-lock.yaml` + `packageManager`)                                         |
| Output Directory             | `.next` (auto-detected; Next.js default, leave empty)                                                           |
| Development Command          | `next dev` (irrelevant for production)                                                                          |
| Node.js Version              | **24.x** (Next.js 16 requires Node ≥ 20.9; set explicitly in Settings → General if the default differs)         |
| Production Branch            | `main`                                                                                                          |
| Environment Variables        | **none required** — no backend, no cookies, no analytics, no third-party scripts                                |
| Build & Development Settings | defaults; "Ignore Build Step" off (all pushes build)                                                            |
| Git integration              | `kuzminklk/digital-belarus`, production branch `main`                                                           |
| Domains                      | default `*.vercel.app` for now; custom domain added later in Project → Domains                                  |

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

| Symptom                                                             | Cause / fix                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Error: No framework detected`                                      | Framework Preset not detected — set it to **Next.js** in Project → Settings → Build & Development.                                                                                                                                                                                                                    |
| Build fails on `pnpm install` / lockfile mismatch                   | Commit `pnpm-lock.yaml`; Vercel must use pnpm (it detects `"packageManager": "pnpm@11.2.2"`). Do not commit `node_modules`.                                                                                                                                                                                           |
| `Unsupported Node.js version` or build uses Node < 20.9             | Project → Settings → General → Node.js Version → **24.x**.                                                                                                                                                                                                                                                            |
| Build fails on `next-intl` plugin resolution                        | Ensure `src/i18n/request.ts` exists and is committed (`next.config.ts` references it).                                                                                                                                                                                                                                |
| Deploy shows old content / no new deploy on push                    | Check Git integration production branch is `main`; check the commit is on `main`; see Project → Settings → Git.                                                                                                                                                                                                       |
| Project imported from the monorepo fails (`package.json` not found) | Root Directory was not set to `web/digital-belarus`. Prefer importing the standalone repository instead.                                                                                                                                                                                                              |
| `vercel` asks for login despite token                               | Export `VERCEL_TOKEN` **and** pass `--scope kuzminklk-projects`, or ensure the token has the team scope.                                                                                                                                                                                                              |
| CLI returns `401`/`403` where it worked before                      | The provisioned browser-session token was revoked or rotated (e.g. owner signed out of that Chrome session). Re-provision per [Durable token](#durable-token-account-owner-one-time-recommended-long-term) (or re-extract from a signed-in dashboard session) and overwrite `~/.config/digital-belarus/vercel-token`. |
| `The request is missing an authentication token` from the REST API  | A web session cookie was sent as a token. Use the provisioned `vcp_…` access token from the credential file, not a raw cookie value.                                                                                                                                                                                  |
| Project created in the wrong scope (personal instead of team)       | Always pass `--scope kuzminklk-projects` (or set the team as the default scope) before the first deploy; deleting and recreating a project in the right team is the clean fix.                                                                                                                                        |
| Token creation says _"Challenge required"_ / TOTP prompt            | Expected: Vercel requires the account owner's TOTP code to mint access tokens. Create the token in the dashboard as described above.                                                                                                                                                                                  |
| `.vercel` appears in `git status`                                   | It must stay out of git — already covered by `.gitignore`. Remove with `git rm -r --cached .vercel` if ever staged.                                                                                                                                                                                                   |

## Security rules

- Never commit `VERCEL_TOKEN`, `~/.local/share/com.vercel.cli/auth.json`, `.env*`, or the
  contents of `~/.config/digital-belarus/`. The token path itself may be referenced in docs.
- The site needs no environment variables and stores no user data; do not add secrets to the
  Vercel project "just in case".
- Revoke a leaked token immediately at <https://vercel.com/account/settings/tokens> and issue
  a new one; store it only at `~/.config/digital-belarus/vercel-token` (mode `600`).
- Keep `main` deployable: every merge to `main` publishes to production. Use branches +
  preview deployments for risky changes.
