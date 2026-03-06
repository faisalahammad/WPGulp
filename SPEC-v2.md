# WPGulpPro v2.0 Technical Specification

**Version:** 2.0.0 (Installer Enhancement Spec)
**Date:** 2026-03-06
**Status:** Draft - Pending Implementation
**Based on:** v4.0.0 Release + User Interview Decisions

---

## Executive Summary

This specification defines the v2.0 installer experience for WPGulpPro, building upon the v4.0.0 foundation. The key enhancements include:

- **Repository rename** from `WPGulp` to `WPGulpPro` on GitHub
- **Interactive installation** with user prompts for project configuration
- **GitHub Releases integration** for versioned template downloads
- **Custom config generation** based on user preferences
- **Progressive UX** with confirmation steps and interactive next actions

---

## 1. Repository Renaming Strategy

### 1.1 Repository URL Changes

| Current | After Rename |
|---------|--------------|
| `github.com/faisalahammad/WPGulp` | `github.com/faisalahammad/WPGulpPro` |
| `npm: wpgulppro` | `npm: wpgulppro` (unchanged) |
| `raw.githubusercontent.com/faisalahammad/WPGulp/master` | `raw.githubusercontent.com/faisalahammad/WPGulpPro/master` |

### 1.2 URL Update Sequence

**Pre-rename (current state):**
```javascript
const filesToDownload = [
    `https://raw.githubusercontent.com/faisalahammad/WPGulp/master/WPGulp/.editorconfig`,
    // ... 6 more files
];
```

**Post-rename (after implementation):**
```javascript
const filesToDownload = [
    `https://raw.githubusercontent.com/faisalahammad/WPGulpPro/master/WPGulp/.editorconfig`,
    // ... 6 more files
];
```

### 1.3 Rename Execution Plan

1. **Update all URLs** in `installer/index.js` to use `WPGulpPro`
2. **Commit and push** URL changes to current repo
3. **Execute GitHub rename** via Settings → Repository name
4. **Verify** raw.githubusercontent.com URLs resolve correctly
5. **Test** `npx wpgulppro` installation flow

**Downtime Window:** 5-10 minutes expected during DNS propagation.

### 1.4 GitHub Redirect Behavior

| Operation | Redirect Status |
|-----------|-----------------|
| `git clone` | ✅ Auto-redirect by GitHub |
| `npm install` | ✅ Auto-redirect by GitHub |
| `raw.githubusercontent.com` | ❌ No redirect, 404 until URLs updated |
| GitHub Pages | ⚠️ Manual DNS update required |

---

## 2. Interactive Installation Flow

### 2.1 Installation Sequence

```
┌─────────────────────────────────────────┐
│  1. Welcome & Node Version Check        │
├─────────────────────────────────────────┤
│  2. Directory Detection & Conflict Scan │
├─────────────────────────────────────────┤
│  3. Interactive Prompts (if no conflict)│
├─────────────────────────────────────────┤
│  4. Final Confirmation Summary          │
├─────────────────────────────────────────┤
│  5. File Download & Template Generation │
├─────────────────────────────────────────┤
│  6. npm Install (with progress)         │
├─────────────────────────────────────────┤
│  7. Interactive Next Steps Menu         │
└─────────────────────────────────────────┘
```

### 2.2 Progressive Prompt Design

**Phase 1: Project Metadata** (asked before download)
```
? What is your project name? › my-wordpress-theme
? Project description? › A custom WordPress theme
? Author name? › Your Name
```

**Phase 2: Configuration** (asked during npm install background task)
```
? JavaScript source directory? › assets/js (default)
? CSS output directory? › assets/css (default)
? Enable CSS sourcemaps in production? › No (default)
```

**Phase 3: Telemetry Opt-in** (asked after npm install)
```
? Share anonymous usage data to improve WPGulpPro? (y/N) ›
```

### 2.3 Prompt Library

**Selected:** `prompts` library (lightweight, ~50KB)

```javascript
const prompts = require('prompts');

const projectMeta = await prompts([
    {
        type: 'text',
        name: 'projectName',
        message: 'What is your project name?',
        initial: 'my-wordpress-project'
    },
    {
        type: 'text',
        name: 'description',
        message: 'Project description?',
        initial: 'A WordPress project built with WPGulpPro'
    },
    {
        type: 'text',
        name: 'author',
        message: 'Author name?',
        initial: 'Your Name'
    }
]);
```

### 2.4 Conflict Detection

**Scenario:** Existing `package.json` or `wpgulp.config.js` found

```
⚠️  Existing WPGulp installation detected.

   Found: package.json, wpgulp.config.js

   What would you like to do?
   ❯ Update existing configuration
     Backup and overwrite
     Cancel installation
```

**Behavior:**
- If "Update": Merge new fields, preserve user customizations
- If "Backup": Create `.backup.TIMESTAMP` copies before overwrite
- If "Cancel": Exit gracefully with no changes

---

## 3. GitHub Releases Integration

### 3.1 Download Strategy: Hybrid Release + Latest

**Current (v4.0.0):** Downloads from `master` branch (unversioned)

**New (v2.0.0):** Downloads from GitHub Releases API

```javascript
// Fetch latest release from GitHub API
const release = await fetch('https://api.github.com/repos/faisalahammad/WPGulpPro/releases/latest', {
    headers: process.env.GITHUB_TOKEN
        ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
        : {}
});
const { tag_name } = await release.json();

// Download from release tag instead of master
const baseUrl = `https://raw.githubusercontent.com/faisalahammad/WPGulpPro/${tag_name}/WPGulp/`;
```

### 3.2 Semver Strategy: Always Latest

| Installer Version | Template Version | Behavior |
|-------------------|------------------|----------|
| v4.0.0 | v4.0.0 | ✅ Compatible |
| v4.0.0 | v4.1.0 | ✅ Auto-upgrade to v4.1.0 |
| v4.0.0 | v5.0.0 | ⚠️ Fetch v5.0.0 (no major lock) |
| v5.0.0 | v4.x.x | ❌ Won't downgrade |

**Decision:** Always fetch absolute latest release, no semver guards.

### 3.3 GitHub API Rate Limits

| Auth Type | Rate Limit | Sufficiency |
|-----------|------------|-------------|
| None (default) | 60 req/hour/IP | ~60 installs/hour |
| GITHUB_TOKEN env | 5000 req/hour | CI/CD friendly |
| Embedded token | 5000 req/hour | Public, read-only |

**Decision:** Start without embedded token. Add if users report rate limiting.

### 3.4 Release Asset Structure

```
Release: v4.0.0
├── wpgulp-templates.zip (optional, future)
└── Source code (automatic)
    └── WPGulp/
        ├── .editorconfig
        ├── .eslintrc.js
        ├── gulpfile.babel.js
        ├── package.json
        └── wpgulp.config.js
```

---

## 4. Template Generation

### 4.1 wpgulp.config.js Generation

**Method:** Programmatic generation (not string replacement)

```javascript
const configTemplate = `// WPGulpPro Configuration
// Generated: ${new Date().toISOString()}

module.exports = {
    projectURL: '${userConfig.projectURL || 'http://local.wordpress.test'}',

    // Paths
    jsCustomDir: '${userConfig.jsDir || 'assets/js'}',
    cssCustomDir: '${userConfig.cssDir || 'assets/css'}',

    // Features
    enableSourceMaps: ${userConfig.sourceMaps ? 'true' : 'false'},
    enableRTL: false, // Not in prompts, user can enable manually

    // ... rest of config
};
`;

await fs.promises.writeFile(
    path.join(CWD, 'wpgulp.config.js'),
    configTemplate
);
```

### 4.2 package.json Customization

**Template Values:**
```javascript
const packageJson = {
    name: kebabCase(userConfig.projectName),
    description: userConfig.description,
    author: userConfig.author,
    version: '1.0.0',
    license: 'MIT',
    devDependencies: { /* template deps */ },
    scripts: { /* gulp scripts */ }
};
```

### 4.3 Configurable Options

| Option | Default | User Can Change |
|--------|---------|-----------------|
| JS Directory | `assets/js` | ✅ Yes (prompt) |
| CSS Directory | `assets/css` | ✅ Yes (prompt) |
| CSS Sourcemaps | `false` | ✅ Yes (prompt) |
| RTL Stylesheets | `false` | ❌ Manual edit only |
| Project URL | `http://local.wordpress.test` | ❌ Manual edit only |

---

## 5. Error Handling & Recovery

### 5.1 Silent Retry Strategy

```javascript
async function downloadWithRetry(url, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await download(url, CWD);
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await sleep(1000 * (i + 1)); // Exponential backoff
        }
    }
}
```

### 5.2 Error Messages

| Error Type | User Message | Debug Mode |
|------------|--------------|------------|
| Network failure | "Templates not found. Check your internet connection." | Full stack trace |
| Rate limited | "GitHub rate limit reached. Wait 5 minutes or set GITHUB_TOKEN." | API response |
| 404 Not Found | "Template files not found. Repo may have been renamed." | URL attempted |
| npm install fails | "Dependencies installation failed. Run 'npm install' manually." | npm error log |

### 5.3 Failure Recovery

**Decision:** Leave partial files for debugging (no auto-rollback)

**Behavior:**
1. On failure, keep downloaded files
2. Show error message with recovery instructions
3. User can inspect files or re-run installation

---

## 6. Post-Installation UX

### 6.1 Final Summary Display

```
╔══════════════════════════════════════════════════╗
║  ✅ WPGulpPro installed successfully!            ║
╚══════════════════════════════════════════════════╝

📁 Installed in: /Users/you/my-wordpress-theme
📦 Files created: 7
⚙️  Config: wpgulp.config.js

Next steps:
  ↓ Use arrow keys to select, Enter to confirm

❯ 🏃 Run 'npm start' now
  📖 Open documentation
  ⏎ Exit (do nothing)
```

### 6.2 Interactive Menu Implementation

```javascript
const prompts = require('prompts');

const { nextAction } = await prompts({
    type: 'select',
    name: 'nextAction',
    message: 'What would you like to do next?',
    choices: [
        { title: "🏃 Run 'npm start' now", value: 'start' },
        { title: '📖 Open documentation', value: 'docs' },
        { title: '⏎ Exit (do nothing)', value: 'exit' }
    ]
});

switch (nextAction) {
    case 'start':
        await execa('npm', ['start'], { stdio: 'inherit' });
        break;
    case 'docs':
        await execa('open', ['https://github.com/faisalahammad/WPGulpPro#readme']);
        break;
    case 'exit':
    default:
        console.log('Happy coding! Run "npm start" when ready.');
}
```

### 6.3 Documentation URL

**Selected:** GitHub README
- URL: `https://github.com/faisalahammad/WPGulpPro#readme`
- Fallback: npm package page if GitHub unavailable

---

## 7. Accessibility & Compatibility

### 7.1 Visual Feedback

**Decision:** Keep spinner animations (ora library)

| Feature | Implementation |
|---------|----------------|
| Spinners | ora v5.4.1 |
| Colors | chalk v4.1.2 |
| NO_COLOR | Respected (ora auto-detects) |
| Reduced motion | Not implemented (v2.0) |

### 7.2 Node Version Requirements

**Decision:** Hard requirement with warning option

```javascript
const checkNode = require('cli-check-node');

// Current: Hard requirement
checkNode('20'); // Exit if Node < 20

// Future: Warning only (if user selects soft requirement)
const nodeVersion = process.version;
if (semver.lt(nodeVersion, '20.0.0')) {
    console.warn('⚠️  Warning: Node 20+ recommended. Current:', nodeVersion);
}
```

**Engine Guard in package.json:**
```json
{
    "engines": {
        "node": ">=20.0.0"
    }
}
```

---

## 8. Telemetry & Analytics

### 8.1 Opt-in Telemetry Design

**Prompt:**
```
? Share anonymous usage data to improve WPGulpPro? (y/N)

This helps us understand:
  • Node.js version in use
  • Installation success rate
  • Most-used features

No personal data collected. Toggle anytime in package.json.
```

### 8.2 Telemetry Storage

**Location:** `.wpgulppro-config.json` (gitignored)

```json
{
    "telemetry": true,
    "telemetryId": "uuid-v4-random",
    "firstInstall": "2026-03-06T10:00:00Z"
}
```

### 8.3 Data Collected (if opted in)

| Field | Purpose |
|-------|---------|
| `nodeVersion` | Track Node compatibility |
| `npmVersion` | Track npm compatibility |
| `platform` | OS-specific debugging |
| `installDuration` | Performance tracking |
| `installSuccess` | Success/failure rate |

### 8.4 Telemetry Endpoint

**Future implementation:**
```javascript
if (config.telemetry) {
    fetch('https://telemetry.wpgulppro.dev/collect', {
        method: 'POST',
        body: JSON.stringify(telemetryData)
    }).catch(() => {}); // Silent fail
}
```

---

## 9. npm Package Configuration

### 9.1 Package Identity

**Decision:** Keep unscoped `wpgulppro`

| Option | Status |
|--------|--------|
| `wpgulppro` | ✅ Current, keep |
| `@wpgulp/pro` | ❌ Not selected |
| `@faisalahammad/wpgulppro` | ❌ Not selected |

### 9.2 Package Contents

```
wpgulppro-4.0.0.tgz
├── installer/
│   ├── index.js
│   └── utils/
├── WPGulp/ (templates, downloaded at runtime)
│   └── [files from GitHub Releases]
├── package.json
├── readme.md
└── LICENSE
```

### 9.3 .npmignore Rules

```
# Test files
.github/
.claude/
.vscode/

# Documentation
*.md
!readme.md

# Template files (downloaded at runtime)
WPGulp/

# Development
.nvmrc
.npmrc
```

---

## 10. Release & Rollback Strategy

### 10.1 Rollback Plan

**Decision:** Deprecate + republish (never unpublish)

| Scenario | Action |
|----------|--------|
| Bug discovered within 24h | Deprecate v4.0.0, publish v4.0.1 |
| Breaking change complaint | Document migration, publish patch |
| Security vulnerability | Publish v4.0.2 immediately, advisory |

### 10.2 Release Checklist

```markdown
## Pre-release
- [ ] All tests pass (Node 20/22/24 matrix)
- [ ] npm publish --dry-run shows correct files
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Git tag created (v4.0.0)

## Release
- [ ] npm publish
- [ ] Verify on npmjs.com
- [ ] Create GitHub Release

## Post-release
- [ ] Test: npx wpgulppro --version
- [ ] Update documentation URLs
- [ ] Announce on social media
```

### 10.3 CI/CD Automation

**Decision:** Manual release process (v2.0)

Future enhancement: Automated release workflow
```yaml
# .github/workflows/release.yml (future)
on:
  push:
    tags: ['v*']
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 11. Implementation Priority

### Phase 1: Repository Rename (Critical)
1. Update URLs in `installer/index.js`
2. Commit and push
3. Execute GitHub rename
4. Verify all URLs work

### Phase 2: Interactive Prompts (High)
1. Add `prompts` dependency
2. Implement project metadata prompts
3. Implement config prompts
4. Generate customized wpgulp.config.js

### Phase 3: GitHub Releases (High)
1. Implement release API fetch
2. Update download URLs to use tags
3. Add GITHUB_TOKEN env support
4. Test rate limiting scenarios

### Phase 4: UX Enhancements (Medium)
1. Final confirmation screen
2. Interactive next steps menu
3. Improved error messages
4. Silent retry logic

### Phase 5: Telemetry (Low)
1. Add telemetry prompt
2. Implement config storage
3. Build telemetry endpoint (future)
4. Add opt-out toggle

---

## 12. Technical Debt & Tradeoffs

### Known Tradeoffs

| Decision | Tradeoff | Mitigation |
|----------|----------|------------|
| No embedded GitHub token | Rate limiting possible | Document GITHUB_TOKEN workaround |
| Keep GitHub downloads | Requires network, GitHub uptime | Fast, small npm package |
| Always latest release | No major version guard | Monitor for breaking changes |
| Leave files on failure | Cluttered directory | Document cleanup process |
| No RTL in prompts | Extra manual config | Default RTL task available |

### Future Considerations

1. **Bundle templates in npm** - Eliminates GitHub dependency
2. **ESM support** - Modern module format option
3. **Vite alternative** - Faster dev server option
4. **Monorepo scaffolding** - Support for complex projects
5. **Plugin system** - Extensible build pipeline

---

## Appendix A: Complete User Journey

```bash
# User runs installer
$ npx wpgulppro

Installing WPGulpPro in directory: my-awesome-theme
This might take a couple of minutes.

? What is your project name? › my-awesome-theme
? Project description? › A custom WordPress theme
? Author name? › Faisal Ahammad

? JavaScript source directory? › assets/js
? CSS output directory? › assets/css
? Enable CSS sourcemaps in production? › No

Summary of changes:
  📁 Location: /Users/faisal/my-awesome-theme
  📄 Files: 7 files will be created
  ⚙️  Config: Custom paths configured

  Proceed with installation? (Y/n) › y

DOWNLOADING WPGulp files… ✓
INSTALLING npm packages… ✓

? Share anonymous usage data to improve WPGulpPro? (y/N) › No

╔══════════════════════════════════════════════════╗
║  ✅ WPGulpPro installed successfully!            ║
╚══════════════════════════════════════════════════╝

What would you like to do next?
❯ 🏃 Run 'npm start' now
  📖 Open documentation
  ⏎ Exit (do nothing)

[User selects "Run npm start now"]

> my-awesome-theme@1.0.0 start
> gulp

[22:00:00] Starting 'default'...
[22:00:01] Starting 'watch' task...
[22:00:01] BrowserSync started at http://localhost:3000
```

---

## Appendix B: Interview Decision Summary

| Question | Decision |
|----------|----------|
| Repo rename timing | Rename now, update URLs first |
| Download strategy | Hybrid: Release + latest flag |
| Package distribution | Keep GitHub downloads |
| Project scaffolding | Interactive prompts |
| Prompts library | Prompts (lightweight) |
| Release versioning | Always get latest release |
| GitHub API auth | Start without token |
| Error handling | Silent retry with fallback |
| Prompt flow | Progressive prompts |
| Config customization | JS dir, CSS dir, sourcemaps |
| Token scope | Start without token |
| Post-install UX | Interactive next steps |
| Next steps selection | Arrow key menu |
| Documentation URL | GitHub readme |
| Semver strategy | Always latest (no guards) |
| Rollback plan | Deprecate + republish |
| Existing project handling | Detect & ask |
| Node version check | Warning only (soft) |
| Accessibility | Spinner animations (keep) |
| Telemetry | Opt-in only |
| Config generation | Programmatic |
| RTL option | Not in prompts |
| Final confirmation | Confirm before write |
| Error recovery | Leave files for debug |
| Documentation approach | Spec-first |

---

## Approval

**Spec Author:** Claude Opus 4.6 (AI Assistant)
**Spec Status:** Draft - Pending User Review
**Implementation:** Not Started
