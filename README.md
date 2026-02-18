# Learningbank Initiatives — Workforce Readiness Analytics

Next.js prototype of the Initiatives feature for Learningbank's workforce enablement platform.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  layout.js          Root layout
  page.js            App shell (routing, state, theme provider)
  globals.css        Global styles + wizard animations

lib/
  theme.js           Theme context (dark/light mode tokens)
  utils.js           Formatting helpers (fmt, fD, rc, cc2, cw, pv)
  readiness.js       Readiness calculations (weighted, staffing, skill, cert)
  data.js            Mock data (departments, circles, job profiles, initiatives)
  actions.js         Action plan generator + content matching engine

components/
  Badge.js           Inline badge/pill component
  ProgressBar.js     Horizontal progress bar
  MiniGauge.js       Small SVG ring (no label)
  Gauge.js           Large SVG ring with percentage label
  TabBar.js          Segmented tab control
  Overlay.js         Modal overlay wrapper
  KPICard.js         KPI metric card

  OverviewPage.js    Initiative list, cards, ranking, heatmap, portfolio views
  HeatmapView.js     Cross-location readiness heatmap
  PortfolioView.js   Risk vs. readiness scatter plot
  DetailPage.js      Single initiative detail with simulation tabs
  RiskActionsTab.js  Risk & Actions tab (gap analysis, action plan, mobility)
  ReportPage.js      Executive 4-page PDF report generator
  WizardPage.js      Create Initiative wizard (5 steps with smart analysis)
```

## Key Features

- **Readiness Simulation**: Dynamic weighted readiness calculations (Essential=2x, Important=1x, Nice-to-have=0.5x)
- **Role Source Toggle**: Circles or Job Profiles — same output regardless of source
- **Smart Wizard**: 5-step creation with CSS animations, contextual hints, and AI-like analysis phase
- **Executive Report**: Print-optimized 4-page report for C-level presentations
- **Risk & Actions**: Auto-generated action plans with content matching from learning library
- **Dark/Light Mode**: Full theme toggle
- **Investment Tracking**: Revenue potential, investment required, projected ROI

## Architecture

The readiness engine is source-agnostic. It consumes `{name, required_count, qualified_count, criticality_weight}` tuples regardless of whether they come from Circles or Job Profiles. All calculations and views work identically with either source.
