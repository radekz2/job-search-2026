# GitHub Pages deployment for the job-search report

Publishing the generated HTML report so it renders in the browser (instead of
being a raw file in the repo). Learned on `radekz2/job-search-2026` (private repo).

## Source path: `/docs`

GitHub Pages can serve from the repo **root** or a **`/docs`** directory. If the
user says "pages come from /docs", the site root maps to the `docs/` folder:

- `docs/index.html` → served at the site root `/`
- `docs/job-search-YYYY-MM-DD.html` → served at `/job-search-YYYY-MM-DD.html`

So the pipeline must **copy the report into `docs/`** (dated snapshot + a fresh
`index.html` that mirrors the latest report), not into the repo root. A plain
static HTML file needs no Jekyll/build config — GitHub serves it as-is.

## Enabling Pages via the REST API

```
POST https://api.github.com/repos/{owner}/{repo}/pages
Accept: application/vnd.github+json
{ "source": { "branch": "main", "path": "/docs" } }
```

Read the current site config / status with `GET .../repos/{owner}/{repo}/pages`
(`status` = `building` → `built`; `html_url` = live URL).

## Gotchas (all hit this session)

1. **Fine-grained PAT → 403 "Resource not accessible by personal access token".**
   Enabling Pages needs a token with the **"Pages"** repository permission set to
   **Read and write** (or, if "Pages" isn't offered, **"Administration"** Read and
   write). A token that can push *contents* (the `repo` contents scope) is NOT
   enough to configure Pages. The fix is on the user's side — they edit the token
   permissions in GitHub settings; the token *value* stays the same, so existing
   auth keeps working.

2. **Private repos need a paid plan.** GitHub Pages is unavailable on *private*
   repos for free accounts (requires Pro/Team/Enterprise). `GET /user` doesn't
   expose the plan reliably, so if the enable call fails on a private repo, ask
   the user whether to (a) make it public, or (b) confirm they're on Pro. Do NOT
   assume — this is a billing/policy decision for the user.

3. **Stale "errored" builds are normal during a restructure.** The `pages/builds`
   endpoint lists every build; an earlier commit that didn't match the source
   path (e.g. files still at repo root while Pages points at `/docs`) shows
   `status: errored`. A fresh push re-triggers a build that goes
   `building` → `built`. Verify by polling `GET .../pages/builds` for the LATEST
   commit's `status == "built"`, and confirm with a `curl -sI <html_url>` (HTTP 200).

4. **Verify the live URL actually serves**, don't trust the API status alone:
   `curl -s <html_url>/ | grep '<title>'` should return the report's title.

## API auth recap (fine-grained vs classic)

- Fine-grained PAT → `Authorization: Bearer <token>`; no `x-oauth-scopes` header.
- Classic PAT → `Authorization: token <token>`; has `x-oauth-scopes`.
- Verify identity: `GET /user` → `login`.
- Confirm repo access/existence: `GET /repos/{owner}/{repo}` (404 = missing or private-and-unauthorized).
