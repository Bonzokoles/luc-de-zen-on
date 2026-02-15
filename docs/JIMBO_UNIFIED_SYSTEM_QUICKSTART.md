# Jimbo Unified System - Quick Start

## What is it?

The Jimbo Unified System is an AI workflow automation platform that lets you:
- **Build intelligent workflows** using 140+ AI tools
- **Analyze workflow quality** with automatic scoring (0-100%)
- **Execute workflows** with retry logic and error handling
- **Use pre-built templates** for common business tasks

## Access

Visit: `http://localhost:4321/jimbo-unified-system`

## Quick Example

### 1. Choose a Template
Click on "SEO Content Pipeline" or "Code Review & Documentation"

### 2. Analyze
Click "Analyze Workflow" to:
- Validate DAG structure (no cycles)
- Check tool compatibility
- Get quality score
- See execution plan

### 3. Execute
Click "Execute Workflow" to run the automation

## Templates Available

1. **SEO Content Pipeline** - Research → Write → Optimize → Publish
2. **Code Review & Documentation** - Review → Document → Export → Save
3. **E-commerce Product Optimization** - Scrape → Optimize → Update → Notify
4. **Social Media Campaign** - Generate → Design → Transform → Share
5. **Data Analysis & Reporting** - Collect → Analyze → Visualize → Send

## API Endpoints

- `GET /api/unified-system` - System info
- `POST /api/unified-system` - Execute workflows
- `GET /api/chuck/tools` - List 140+ AI tools
- `POST /api/chuck/analyze` - Analyze workflow
- `POST /api/chuck/exec` - Execute AI tool

## Architecture

```
Universal Nodes:
├── AI_AGENT (🤖) - Delegates to CHUCK for AI execution
├── PROCESSOR (⚙️) - Data operations (scrape, transform, export)
└── OUTPUT (📤) - Final destinations (email, PDF, Slack, etc.)

Tool Categories:
├── SEO/Content (20 tools)
├── Code/Dev (25 tools)  
├── E-commerce/B2B (30 tools)
├── Creative/Productivity (35 tools)
└── New 2026 (30 tools)
```

## Key Features

✅ **DAG Validation** - Prevents cycles in workflows  
✅ **Quality Scoring** - 0-100% quality assessment  
✅ **Compatibility Matrix** - Smart tool pairing  
✅ **Auto Execution** - Topological sorting with retry  
✅ **Templates** - Pre-built workflows ready to use  
✅ **140+ Tools** - Comprehensive AI tool library

## Full Documentation

See: [JIMBO_UNIFIED_SYSTEM.md](./JIMBO_UNIFIED_SYSTEM.md)

## Support

- GitHub: [luc-de-zen-on](https://github.com/Bonzokoles/luc-de-zen-on)
- Demo: `/chuck-jimbo` for API testing
- Main System: `/jimbo-unified-system`
