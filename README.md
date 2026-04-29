# Linux/DevOps Command Reference

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-3.3-green.svg)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen.svg)
![Sections](https://img.shields.io/badge/sections-84-orange.svg)
![Command Blocks](https://img.shields.io/badge/command%20blocks-1283-red.svg)
![Lines](https://img.shields.io/badge/lines-47%2C849-purple.svg)

**The most comprehensive Linux, DevOps, and Cloud command reference for senior-level professionals.**

[System Administration](system-admin.html) · [DevOps Tools](devops-tools.html) · [Monitoring & Security](monitoring-security.html)

</div>

---

## Table of Contents

1. [Overview](#overview)
2. [Project Statistics](#project-statistics)
3. [Project Structure](#project-structure)
4. [Architecture](#architecture)
   - [HTML Pages](#html-pages)
   - [CSS Design System](#css-design-system)
   - [JavaScript Modules](#javascript-modules)
5. [Command Classification System](#command-classification-system)
6. [Coverage Breakdown](#coverage-breakdown)
   - [System Administration — 33 Sections](#system-administration--33-sections)
   - [DevOps Tools — 29 Sections](#devops-tools--29-sections)
   - [Monitoring & Security — 22 Sections](#monitoring--security--22-sections)
7. [Features](#features)
8. [Quick Start](#quick-start)
9. [Browser Compatibility](#browser-compatibility)
10. [Accessibility](#accessibility)
11. [Performance](#performance)
12. [Target Audience](#target-audience)
13. [Contributing](#contributing)
14. [Change Log](#change-log)

---

## Overview

This is a **static HTML command and code reference** for Linux system administration, DevOps engineering, cloud infrastructure, site reliability engineering, and production security. It is not a tutorial — it assumes you understand the underlying concepts and need a fast, structured lookup resource.

**Core design principles:**

- **Reference-first, not tutorial-first.** Commands are grouped by operational context, not by learning progression.
- **Production-safe language.** Every dangerous command is explicitly tagged and visually distinct.
- **Zero dependencies.** Pure HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no CDN.
- **Offline-capable.** Open directly in any browser from the filesystem or a local server.

---

## Project Statistics

| Metric | Value |
|---|---|
| **Total sections** | 84 |
| **Total command blocks** | 1,283 |
| **Total project lines** | 47,849 |
| **HTML content lines** | 42,149 |
| **CSS lines** | 1,847 |
| **JavaScript lines** | 1,064 |
| **Total HTML payload** | ~1.64 MB |
| **Difficulty range** | Beginner → Principal Engineer |
| **Platforms covered** | RHEL 9, Ubuntu, AWS, Azure, GCP, Kubernetes |

**Per-file breakdown:**

| File | Lines | Command Blocks | Sections |
|---|---|---|---|
| `system-admin.html` | 17,051 | 651 | 33 |
| `devops-tools.html` | 18,872 | 430 | 29 |
| `monitoring-security.html` | 6,226 | 202 | 22 |
| `index.html` | 2,789 | — | — |
| `assets/styles.css` | 1,847 | — | — |
| `assets/scripts.js` | 1,064 | — | — |

---

## Project Structure

```
devops-command-summary/
├── index.html                  # Landing page — section navigator, global search
├── system-admin.html           # Part 1: Linux system administration (sections 01–33)
├── devops-tools.html           # Part 2: DevOps & cloud tools (sections 34–62)
├── monitoring-security.html    # Part 3: Observability, security, SRE (sections 63–84)
└── assets/
    ├── styles.css              # Shared design system — all pages
    ├── scripts.js              # Shared JavaScript modules — all pages
    └── favicon.png             # Site icon
```

All pages share one CSS file and one JS file. There are no external runtime dependencies.

---

## Architecture

### HTML Pages

Each content page (`system-admin.html`, `devops-tools.html`, `monitoring-security.html`) follows this layout:

```
<body class="index-page">
  <div class="container">
    <div class="part-links">          ← cross-page navigation bar
    <div class="hero-section">        ← page title + badge
    <div class="content">
      <div class="breadcrumb-nav">    ← sticky current-section indicator
      <div class="progress-bar-container"> ← study progress tracker
      <div class="section-index">     ← collapsible table of contents (TOC)
      <div id="searchResultsContainer"> ← dynamic search results
      <div id="sectionNavContainer"> ← prev/next section navigation

      <!-- sections: each is an <h2 id="..."> followed by .command-block elements -->
      <h2 id="section-id">Section Title</h2>
      <div class="command-block">
        <h4>Sub-topic</h4>
        <pre><code>...</code></pre>
      </div>
    </div>
  </div>
</body>
```

`index.html` is the landing page. It contains the three section cards, a global search widget (static keyword index, no server), the command classification legend, and site stats.

### CSS Design System

**File:** `assets/styles.css` — 1,847 lines

The stylesheet is organized into these layers:

| Layer | Selectors | Purpose |
|---|---|---|
| **Custom properties** | `:root` | Color palette and design tokens |
| **Base reset** | `*`, `body` | Box-model normalization |
| **Typography** | `h1`–`h4` | Heading hierarchy and scale |
| **Navigation** | `.navigation`, `.part-links` | Cross-page and in-page nav |
| **Hero** | `.hero-section`, `.hero-content`, `.hero-stats` | Page headers |
| **Cards** | `.cards-grid`, `.card`, `.card-btn` | Index page section cards |
| **Content** | `.section-index`, `.command-block`, `.toc-*` | Reference content layout |
| **Search** | `.search-container`, `.search-input`, `.search-result-item` | Search UI |
| **Feedback** | `.warning`, `.info`, `.success`, `.danger` | Alert/callout boxes |
| **Progress** | `.progress-bar-container`, `.toc-checkbox`, `.progress-bar-fill` | Study tracker |
| **Navigation buttons** | `.navigation-buttons`, `.nav-btn`, `.nav-up`, `.nav-down` | Floating scroll controls |
| **Category tags** | `.command-category`, `.category-*` | Command classification badges |
| **Tables** | `table`, `th`, `td` | Reference data tables |
| **Light mode** | `body.light-mode` | Optional light theme override |
| **Copy buttons** | `.copy-btn`, `.copy-btn.copied` | Per-block clipboard buttons |
| **Animations** | `@keyframes *` | Gradient shift, pulse, float, shimmer |
| **Responsive** | `@media (max-width: 1024px/768px/480px)` | Mobile-first breakpoints |
| **Print** | `@media print` | Print-friendly layout |
| **Accessibility** | `@media (prefers-reduced-motion)` | Motion-disabled users |

**Design tokens (CSS custom properties):**

```css
:root {
  --primary-color:   #0d1117;   /* deepest background */
  --secondary-color: #00d9ff;   /* cyan accent — links, headings, focus */
  --accent-color:    #ff6b9d;   /* pink accent — hover states, warnings */
  --bg-color:        #0f0f0f;   /* page background */
  --text-color:      #c9d1d9;   /* body text */
  --border-color:    #30363d;   /* borders and dividers */
  --code-bg:         #0d1117;   /* code block background */
  --success-color:   #3fb950;   /* green — success states, copy confirm */
  --warning-color:   #d29922;   /* amber — warnings */
}
```

### JavaScript Modules

**File:** `assets/scripts.js` — 1,064 lines

The script is organized as independent singleton modules, all initialized through a central `App` controller. All modules use safe `localStorage` wrappers and debounced scroll handlers.

| Module | Responsibility |
|---|---|
| `Utils` | `safeStorageGet`, `safeStorageSet`, `debounce`, `safeQuery` — shared helpers |
| `ThemeManager` | Dark/light mode toggle persisted to `localStorage`; defaults to dark |
| `ScrollManager` | Back-to-top button visibility via debounced scroll listener |
| `NavigationManager` | Creates floating ↑/↓ scroll buttons; hides each at page extremes |
| `CopyManager` | Injects `Copy` buttons into every `.command-block`; uses Clipboard API with `execCommand` fallback; shows `Copied!` feedback for 2 s |
| `CodeFormatter` | Aligns inline `# comments` in code blocks to a consistent column |
| `TOCGenerator` | Builds a dynamic TOC from `h2`/`h3[id]` headings; adds progress checkboxes to h2 items |
| `SearchManager` | Full-text search across section headings and content; debounced at 200 ms; highlights matches |
| `ProgressTracker` | Persists per-page section completion to `localStorage`; drives the progress bar |
| `BreadcrumbManager` | Updates the sticky breadcrumb with the current visible `h2` as you scroll |
| `SectionNavManager` | Renders Prev/Next navigation buttons between sections; updates on scroll |
| `TOCToggle` | Expand/collapse the section index sidebar |
| `Accessibility` | Ensures all links have `tabindex="0"` for keyboard navigation |
| `App` | Bootstraps all modules on `DOMContentLoaded`; initializes `Accessibility` on `load` |

**Module initialization order:**

```
DOMContentLoaded →
  ThemeManager.init()
  ScrollManager.initBackToTop()
  NavigationManager.init()
  CopyManager.init()
  CodeFormatter.formatComments()
  CodeFormatter.cleanCodeBlocks()
  TOCGenerator.generate()
  SearchManager.init()
  ProgressTracker.init()
  BreadcrumbManager.init()
  SectionNavManager.init()
  TOCToggle.init()

load → Accessibility.improve()
```

**`localStorage` keys used:**

| Key | Module | Value |
|---|---|---|
| `theme` | `ThemeManager` | `"dark"` or `"light"` |
| `learning-progress` | `ProgressTracker` | JSON object keyed by filename → section ID |

---

## Command Classification System

Every command block is prefixed with a classification tag that indicates its operational context and risk level. These tags are styled with color-coded badges.

| Tag | Color | Meaning |
|---|---|---|
| `[COMMON]` | Green | Used daily in routine operations |
| `[PRODUCTION]` | Amber | Requires care; used in live environments |
| `[DEBUG]` | Teal | Diagnostic and investigation commands |
| `[RARE]` | Grey | Infrequently used; specialized scenarios |
| `[DANGEROUS]` | Red (pulsing) | Risk of data loss or service outage if misused |
| `[BEGINNER]` | Teal | Entry-level commands for onboarding |
| `[INTERMEDIATE]` | Amber | Mid-level operational complexity |
| `[ADVANCED]` | Pink | Complex commands requiring deep expertise |
| `[SECURITY]` | Cyan | Security-focused commands and hardening |

**Safety rules:**

- Never run `[DANGEROUS]` commands without understanding the exact impact first.
- Always test in an isolated environment before applying to production.
- Many commands require `root` or `sudo`. Assume this unless stated otherwise.
- Examples default to **RHEL 9 / CentOS Stream / Amazon Linux** unless noted.
- Command behavior varies across versions — check your installed version with `--version` or the relevant man page.

---

## Coverage Breakdown

### System Administration — 33 Sections

`system-admin.html` · 17,051 lines · 651 command blocks

| # | Section | Key Topics |
|---|---|---|
| 01 | System Information & Navigation | `uname`, `hostname`, `lscpu`, `lsmem`, `lsblk`, `dmidecode`, `uptime`, `w`, `who`, `last` |
| 02 | File Operations | `cp`, `mv`, `rm`, `find`, `rsync`, `ln`, `tar`, `zip`, `stat`, `file`, `xargs` |
| 03 | Text Editors | Vim motions, navigation, registers, macros; Nano shortcuts; Emacs basics |
| 04 | File Permissions & Ownership | `chmod` octal/symbolic, `chown`, `chgrp`, `umask`, `setfacl`, `getfacl`, sticky bit, SUID/SGID |
| 05 | SELinux Comprehensive Guide | Modes, contexts, `semanage`, `restorecon`, booleans, audit log analysis, troubleshooting |
| 06 | User & Group Management | `useradd`, `usermod`, `userdel`, `groupadd`, `gpasswd`, `/etc/passwd`, `/etc/shadow`, `chage` |
| 07 | System Limits, PAM & Resource Control | `/etc/security/limits.conf`, `ulimit`, PAM modules, cgroups, `systemd-cgls` |
| 08 | Process Management | `ps`, `top`, `htop`, `kill`, `nice`, `renice`, `jobs`, `bg`, `fg`, `nohup`, `lsof` |
| 09 | Systemd Service Management | `systemctl`, unit files, targets, dependencies, `journalctl`, `systemd-analyze`, timers |
| 10 | Package Management (DNF/YUM) | `dnf install/update/remove/search`, repos, groups, modules, AppStream, offline installs |
| 11 | RPM Package Management | `rpm -ivh/-e/-q/-V/-F`, spec files, build dependencies, GPG verification |
| 12 | System Logging | `journalctl` filters, `rsyslog`, `/var/log/*`, log rotation, `logrotate`, remote syslog |
| 13 | Disk Management | `fdisk`, `parted`, `mkfs`, `mount`/`umount`, `/etc/fstab`, `df`, `du`, `lsblk`, `blkid`, `fsck` |
| 14 | Logical Volume Manager (LVM) | `pvcreate`, `vgcreate`, `lvcreate`, extend/reduce, snapshots, thin pools, migration |
| 15 | Memory & Swap Management | `/proc/meminfo`, `free`, `vmstat`, `smem`, `swapon`, `swapoff`, `mkswap`, OOM killer tuning |
| 16 | Networking Basics | `ip addr/route/link`, `nmcli`, `nmtui`, `ss`, `ping`, `traceroute`, `dig`, `nslookup`, bonds, VLANs |
| 17 | Firewall Management | `firewall-cmd` zones/services/ports/rich-rules, `iptables`, `nftables`, NAT |
| 18 | SSH (Secure Shell) | `ssh`, `scp`, `sftp`, key management, `ssh-agent`, multiplexing, tunnels, `sshd_config` hardening |
| 19 | NTP & Time Synchronization | `timedatectl`, `chrony`, `ntpd`, stratum, drift, hardware clock sync |
| 20 | Kernel Parameters & Sysctl Tuning | `/proc/sys/*`, `sysctl.conf`, TCP tuning, memory overcommit, inotify limits |
| 21 | Network Troubleshooting & Security | `tcpdump`, `netstat`, `ss`, `nmap`, `curl` debugging, MTU discovery, ARP table |
| 22 | Text Processing | `grep`/`egrep` regex, `awk` field splitting, `sed` in-place edits, `cut`, `tr`, `sort`, `uniq`, `wc` |
| 23 | YAML Fundamentals | Scalars, mappings, sequences, multi-line strings, anchors, aliases, merge keys, validation |
| 24 | Bash Scripting Essentials | Strict mode (`set -euo pipefail`), functions, arrays, parameter expansion, traps, heredocs |
| 25 | Backup and Recovery | `rsync` flags, `tar` incremental, `dd`, `cpio`, integrity verification, restoration testing |
| 26 | Automation and Scheduling | `crontab` syntax, `at`, `anacron`, `systemd` timers, `batch`, job logging |
| 27 | Boot Process, GRUB & System Recovery | Boot stages, `grub2-mkconfig`, kernel parameters, rescue mode, `dracut`, initramfs |
| 28 | Advanced System Administration | `strace`, `ltrace`, `perf`, `valgrind`, coredumps, `gdb` basics, audit subsystem |
| 29 | Enterprise Automation & Scripting | Idempotent scripts, lock files, signal trapping, modular script design, parallel execution |
| 30 | Advanced Troubleshooting Techniques | Systematic diagnosis frameworks, `sar`, `iostat`, CPU profiling, memory leak detection |
| 31 | Miscellaneous Useful Commands | `screen`, `tmux`, `watch`, `parallel`, `bc`, `column`, `jq`, `envsubst`, `getent` |
| 32 | Useful One-Liner Commands | Power one-liners for log analysis, system health checks, disk ops, network diagnostics |
| 33 | RHCSA Exam Essential Commands | Exam-pattern tasks: user management, storage, SELinux, services, network, cron |

### DevOps Tools — 29 Sections

`devops-tools.html` · 18,872 lines · 430 command blocks

| # | Section | Key Topics |
|---|---|---|
| 34 | Git Version Control | init/clone, staging, commits, branches, merge, rebase, stash, tags, `git log` forensics, hooks |
| 35 | Python for DevOps | venv, pip, type hints, subprocess, pathlib, `argparse`, boto3, requests, Fabric |
| 36 | Docker — From Scratch | Architecture (daemon, containerd, runc), images, layers, Dockerfile best practices, multi-stage |
| 37 | Docker Commands | `build`, `run`, `exec`, `logs`, `inspect`, `stats`, `network`, `volume`, compose, registry |
| 38 | Podman Container Management | Rootless containers, `podman` vs Docker CLI parity, pods, `systemd` integration, Buildah |
| 39 | Container Security | Image scanning (Trivy), rootless, read-only FS, seccomp, AppArmor, user namespaces, Distroless |
| 40 | Kubernetes (kubectl) Commands | Pods, deployments, services, configmaps, secrets, namespaces, context switching, port-forward |
| 41 | Advanced Kubernetes Production Patterns | HPA, VPA, PodDisruptionBudgets, PriorityClasses, topology spread, node affinity, taints |
| 42 | Kubernetes Security & RBAC | ServiceAccounts, Roles, ClusterRoles, RoleBindings, NetworkPolicies, PodSecurity admission |
| 43 | Kubernetes Monitoring & Observability | Prometheus stack, metrics-server, `kubectl top`, logging agents, tracing with Jaeger |
| 44 | Terraform IaC — From Scratch | HCL syntax, providers, resources, data sources, variables, outputs, modules, state |
| 45 | Terraform Commands | `init`, `plan`, `apply`, `destroy`, `fmt`, `validate`, `import`, `state mv`, workspaces |
| 46 | Ansible Commands | Inventory, ad-hoc, playbooks, roles, vault, `ansible-galaxy`, idempotency, tags, handlers |
| 47 | AWS — From Scratch | IAM, VPC, EC2, S3, RDS, Lambda, ALB, ASG, CloudFormation, CloudWatch, least-privilege patterns |
| 48 | AWS CLI Commands | `aws ec2`, `s3`, `iam`, `lambda`, `cloudformation`, `logs`, `ecs`, `eks`, profiles, pagination |
| 49 | Microsoft Azure | `az` CLI, RBAC, managed identities, VNet, AKS, App Service, Key Vault, Monitor, ARM templates |
| 50 | Google Cloud Platform (GCP) | `gcloud`, IAM, GKE, Cloud Run, Cloud Storage, BigQuery, Pub/Sub, VPC, Firestore |
| 51 | Advanced Cloud | Multi-cloud patterns, FinOps tagging, DR across regions, transit gateways, service meshes |
| 52 | Cloud Architecture | Well-Architected Framework pillars, landing zones, hub-spoke, zero-trust networking |
| 53 | Cost Optimization | Reserved instances, Savings Plans, rightsizing, orphan resource cleanup, cost anomaly detection |
| 54 | Databases | MySQL/PostgreSQL administration, connection pooling, replication, Redis, MongoDB, backup/restore |
| 55 | HashiCorp Vault | Initialization, unsealing, KV secrets, dynamic credentials (AWS/DB), PKI, AppRole auth, policies |
| 56 | CI/CD Tools | Jenkins Pipelines (declarative/scripted), GitHub Actions workflows, GitLab CI, artifact management |
| 57 | Enterprise CI/CD | Blue/green, canary, feature flags, pipeline security scanning (SAST/DAST), release governance |
| 58 | GitOps (ArgoCD/Flux) | App of Apps pattern, sync policies, health checks, rollback, RBAC, notification hooks |
| 59 | Advanced GitOps | Progressive delivery with Flagger, multi-cluster Argo, Flux image automation, drift detection |
| 60 | Advanced DevOps Workflows | Platform engineering, internal developer portals, golden paths, shift-left security |
| 61 | Automation One-Liners | Shell + Python + `jq` one-liners for AWS, Kubernetes, git, logs, JSON/YAML manipulation |
| 62 | RHCE Exam Commands | Exam-pattern tasks: Ansible playbooks, roles, vault, templating, conditional tasks |

### Monitoring & Security — 22 Sections

`monitoring-security.html` · 6,226 lines · 202 command blocks

| # | Section | Key Topics |
|---|---|---|
| 63 | Logging & Auditing | ELK/EFK stack, Filebeat, Logstash pipelines, `auditd`, `ausearch`, SIEM integration |
| 64 | Observability | The three pillars (metrics, logs, traces), OpenTelemetry, cardinality, SLI/SLO/SLA |
| 65 | Monitoring & Observability Stack | Prometheus scrape configs, PromQL, Alertmanager routing, Grafana dashboards, Loki |
| 66 | Performance Monitoring & Tuning | `sar`, `iostat`, `mpstat`, `vmstat`, `perf stat/record/report`, flame graphs, BPF/eBPF |
| 67 | Performance Optimization & Tuning | CPU affinity, NUMA awareness, TCP buffer tuning, disk I/O schedulers, huge pages |
| 68 | Security and Hardening | CIS benchmarks, `lynis`, `aide`, `fail2ban`, SSH hardening, kernel hardening, `auditd` rules |
| 69 | DevSecOps Practices | Shift-left security, SAST (Semgrep), SCA (Trivy), secrets scanning, policy-as-code (OPA) |
| 70 | Security & Compliance Automation | SCAP, OpenSCAP, compliance-as-code, automated remediation, CIS-CAT, regulatory frameworks |
| 71 | Security Automation & Compliance | Automated vulnerability management, patch cadence, SOAR integration, ticketing workflows |
| 72 | High Availability & Load Balancing | HAProxy, Nginx upstream, Keepalived/VRRP, Pacemaker/Corosync, DRBD, active-active vs active-passive |
| 73 | Service Mesh (Istio/Linkerd) | mTLS, traffic management, circuit breaking, retries, canary via virtual services, telemetry |
| 74 | Incident Response & On-Call | Runbooks, escalation paths, war-room communication, post-mortems, RCA templates, blameless culture |
| 75 | Chaos Engineering | Steady-state hypothesis, blast radius, Gremlin/LitmusChaos/Chaos Mesh, GameDays |
| 76 | Backup, Recovery, Monitoring & Security | Unified backup strategy, 3-2-1 rule, RTO/RPO, restore verification, monitoring coverage gaps |
| 77 | Interview Preparation — System Design | System design patterns, STAR method, Linux internals Q&A, troubleshooting scenarios |
| 78 | Career Advancement & Certifications | RHCSA/RHCE/CKA/CKS/AWS-SAA/GCP-ACE/Azure-104 study roadmaps, exam strategies |
| 79 | Real-World Project Examples | Full project walkthroughs: K8s cluster setup, CI/CD pipeline, monitoring stack, IaC deployment |
| 80 | Project Templates & Starters | Terraform modules, Ansible roles, Dockerfile templates, GitHub Actions workflow templates |
| 81 | Certification Preparation Guides | Domain-by-domain breakdown for RHCSA, CKA, AWS SAA with priority topics |
| 82 | Exam Strategies & Career Development | Time management, hands-on lab tips, common failure patterns, mock exam approach |
| 83 | Final Resources & Reference | Curated tool docs, official manuals, cheat sheet links, community resources |
| 84 | Summary | Consolidated reference card of the most critical commands across all domains |

---

## Features

### In-Page Search

Each content page has a live search bar that searches section headings and content text. The search index is built at page load from the DOM — no server required.

- Debounced input at 200 ms
- Highlights matched terms in results
- Click any result to scroll to that section with a flash animation
- Results limited to 20 matches; shows "N results found" count

The index page has a separate global search that routes to the correct sub-page and anchor.

### Progress Tracker

Each section heading in the TOC has a checkbox. Checking it marks the section as complete. Progress is persisted to `localStorage` per page. A progress bar at the top of the TOC shows `X/N sections (%)`.

Reset button wipes page-specific progress. Progress is independent per page.

### Copy to Clipboard

Every `.command-block` element gets a **Copy** button injected by `CopyManager`. Clicking it:

1. Copies the text content of the `<pre>` inside the block
2. Changes the button to **Copied!** (green) for 2 seconds
3. Falls back to `document.execCommand('copy')` if the Clipboard API is unavailable

### Dark Mode Toggle

`ThemeManager` reads `localStorage.theme` on load and defaults to dark mode if no preference is saved. The toggle button flips the `dark-mode` class on `<body>`.

Light mode is a partial implementation — it adjusts containers and navigation elements. The site is designed primarily dark.

### Floating Navigation Buttons

`NavigationManager` injects fixed ↑ and ↓ buttons into the page. The ↑ button hides when near the top; the ↓ button hides when near the bottom. Both use smooth scrolling.

### Breadcrumb & Section Navigation

A sticky breadcrumb at the top of the content area updates as you scroll to show which section you are currently reading.

Below each section heading, Prev/Next navigation buttons appear, letting you step through sections linearly without scrolling.

### Collapsible TOC

The section index can be collapsed with a toggle button to give more screen space for the content. State is not persisted (intentional — it resets on reload).

### Accessibility

- All links receive `tabindex="0"` for consistent keyboard focus
- `aria-label` on navigation buttons, TOC checkboxes, and command blocks
- Skip-link support via `.skip-link` focus handler
- `@media (prefers-reduced-motion: reduce)` disables all CSS animations and transitions

---

## Quick Start

### Open in browser

```bash
# Firefox
firefox index.html

# Chromium / Chrome
google-chrome index.html

# Any POSIX system
xdg-open index.html
```

### Serve locally (recommended for mobile testing)

```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx, no install)
npx serve .

# PHP
php -S 0.0.0.0:8080
```

Then open `http://localhost:8080` from any device on the same network.

### Direct file access

Because there are no API calls or module imports, all pages work via `file://` directly. No build step, no `npm install`, no configuration.

### Navigate by section

| What you want | Go to |
|---|---|
| Linux commands, RHCSA prep | `system-admin.html` |
| Docker, Kubernetes, Terraform, AWS | `devops-tools.html` |
| Prometheus, security hardening, SRE | `monitoring-security.html` |
| Search across all sections | `index.html` (global search) |

---

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---|---|---|
| Chrome / Chromium | 80+ | Full support |
| Firefox | 75+ | Full support |
| Edge (Chromium) | 80+ | Full support |
| Safari | 13.1+ | Full support |
| Opera | 67+ | Full support |
| Mobile Chrome | 80+ | Responsive layout |
| Mobile Safari | 13.4+ | Responsive layout |

**CSS features used:** custom properties, CSS Grid, Flexbox, `backdrop-filter`, `clamp`, `@keyframes`, `@media (prefers-reduced-motion)`.

**JS features used:** `async/await`-free; only ES6+ (arrow functions, destructuring, `const`/`let`, template literals, spread operator, `class`). No transpilation needed for any modern browser.

**Clipboard API** is used with `execCommand` fallback — copy buttons work in all environments including older Safari.

---

## Accessibility

| Feature | Implementation |
|---|---|
| Keyboard navigation | All interactive elements have `tabindex="0"` |
| Screen reader labels | `aria-label` on nav buttons, copy buttons, TOC checkboxes |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables all animations |
| Semantic HTML | `<header>`, `<main>`, `<footer>`, `<nav>` landmarks used |
| Focus styles | Browser-default focus outlines preserved; skip-link supported |
| Color contrast | Body text `#c9d1d9` on `#0a0a0a` background — WCAG AA compliant |
| No motion-only information | All animated elements convey information through text/structure too |

---

## Performance

All pages are static files — there is no JavaScript framework overhead, no hydration, no network requests beyond the initial page load.

| Concern | Approach |
|---|---|
| Large HTML files | Pages are 6–19 K lines; browsers handle this without issue |
| Scroll handlers | All scroll listeners are debounced (50–100 ms) and registered `{ passive: true }` |
| DOM queries | Cached via module-level `sections` arrays; not re-queried on every event |
| `localStorage` | Wrapped in `try/catch`; no synchronous throws if storage is unavailable |
| Animations | CSS-only; GPU-composited `transform`/`opacity` properties used |
| Print | Navigation, search, and download controls hidden via `@media print` |

---

## Target Audience

This reference is designed for engineers who already understand the underlying concepts and need a fast, structured lookup resource.

| Role | What you'll use it for |
|---|---|
| **Linux System Administrator** | Daily operations, troubleshooting, RHCSA/RHCE exam preparation |
| **DevOps / Platform Engineer** | Container orchestration, IaC, CI/CD, GitOps, cloud CLI workflows |
| **SRE / Infrastructure Engineer** | Incident response, observability stack setup, performance tuning |
| **Cloud Engineer** | AWS/Azure/GCP CLI commands, IAM patterns, cost optimization |
| **Security Engineer** | Hardening checklists, DevSecOps tooling, compliance automation |
| **Junior Engineer** | Bridging gaps between theory and production operations |

**Pre-requisites assumed:** Working knowledge of Linux, basic networking (TCP/IP, DNS), and familiarity with at least one scripting language.

---

## Contributing

### Setup

No build tooling is required.

```bash
git clone https://github.com/samiulAsumel/devops-command-summary.git
cd devops-command-summary
# Open any .html file directly, or serve with python3 -m http.server 8080
```

### Contribution guidelines

- **Test all commands** before submission. Every command in this reference has been verified.
- **Follow the classification system.** Tag every new command with the appropriate `[COMMON]`, `[PRODUCTION]`, `[DEBUG]`, `[RARE]`, or `[DANGEROUS]` label.
- **Keep the `.command-block` structure.** New content must use the established HTML pattern so `CopyManager`, `SearchManager`, and `CodeFormatter` work correctly.
- **Validate HTML.** No unclosed tags, no broken anchor IDs, no duplicate `id` attributes.
- **No external dependencies.** Do not add CDN links, npm packages, or external fonts.
- **Update statistics.** If you add a section, update the counts in `index.html` and this README.

### Pull request checklist

- [ ] Commands verified on the stated platform and version
- [ ] Classification tag applied to every new command block
- [ ] Section anchor ID added to the `section-index` TOC
- [ ] New section added to the `searchData` array in `index.html` (for global search)
- [ ] `README.md` statistics updated if section count or line count changed
- [ ] No inline `<style>` blocks — CSS belongs in `assets/styles.css`
- [ ] No inline `<script>` blocks (other than existing per-page data) — JS belongs in `assets/scripts.js`

---

## Change Log

### Version 3.3 — April 2026

**Bug fixes and code quality:**

- Fixed `debounce` utility using `this` in an arrow function (context was always `undefined` in strict mode — caused silent failures in scroll handler binding)
- Fixed `ThemeManager` defaulting to light mode on a dark-designed site (changed default from `"light"` to `"dark"`)
- Fixed invalid `role="navigation"` being set on every `<a>` tag (ARIA navigation role is a landmark for container elements, not links — replaced with `tabindex="0"`)
- Removed 7 duplicate CSS rule blocks (`.command-block`, `.section-index`, `.search-container`, `.search-clear-btn`, `.search-result-item`, `.copy-btn`, `.nav-down:hover`) that were causing silent cascade conflicts
- Removed all `!important` from `.container` width/padding/margin rules — these were unnecessary overrides with no specificity conflicts
- Removed dead `color: white` rule from `.navigation a` (was immediately overridden by `color: #0d1117` two lines below)
- Merged two separate `@media (max-width: 768px)` blocks for navigation into one
- Moved `@keyframes pulse-danger` out of inline `<style>` blocks in 4 HTML files into `assets/styles.css` — it was the only animation defined outside the stylesheet

**New features:**

- `CopyManager` module: injects functional **Copy** buttons into every `.command-block`. Uses Clipboard API with `execCommand` fallback. Shows `Copied!` confirmation for 2 seconds.
- `.copy-btn.copied` CSS state with green success color
- `@media (prefers-reduced-motion: reduce)` — all CSS animations and transitions disabled for users who prefer reduced motion (WCAG 2.1 Success Criterion 2.3.3)
- `<meta name="description">` added to all four pages for SEO and accessibility tooling
- Removed emoji from `<title>` tags (causes encoding issues in certain RSS readers, tab groups, and bookmark managers)
- `<footer>` moved to correct semantic position outside the CTA `<div>` in `index.html`
- Restored `.search-container` to `position: sticky` behavior — the enhanced Learning Guide CSS block had silently overridden it to `position: relative`, breaking the sticky search header on content pages

### Version 3.2 — April 2026

- Fixed encoding issues in `index.html`
- Fixed broken internal anchor links
- Enhanced Learning Path UI with floating boxes and animated section headers
- Improved HTML validation across all pages

### Version 3.1 — February 2026

- Added **Advanced Kubernetes** production patterns (section 41)
- Enhanced **Security & Compliance** coverage (sections 70–71)
- Improved mobile responsiveness across all breakpoints
- Added **performance optimization** guides (section 67)

### Version 3.0 — January 2026

- Complete web interface redesign with dark-mode-first design system
- Added **1,283 verified command blocks** across all pages
- Implemented safety classification system with color-coded tags
- Expanded cloud coverage: AWS CLI (section 48), Azure (section 49), GCP (section 50)
- Added `ProgressTracker` module for study progress persistence
- Added `SearchManager` with full-text search across all section content

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

_**Last updated:** April 2026_  
_**Version:** 3.3_  
_**Maintained by:** [samiulAsumel](https://github.com/samiulAsumel)_
