# React Components Skill

This skill automates the conversion of Stitch-generated HTML/CSS designs into production-ready React component systems.

## Features

- **Automated Conversion:** Transforms UI screens into TypeScript React components following Atomic Design methodology
- **Five-Stage Pipeline:**
  1. **Retrieval:** Fetches HTML designs from cloud storage
  2. **Mapping:** Cross-references design with source design tokens and local style guidelines
  3. **Generation:** Scaffolds React components based on Atomic Design hierarchy
  4. **Validation:** Uses AST parsing to ensure no hardcoded values and maintain type safety
  5. **Audit:** Performs architectural quality audit

## Usage

When working with Stitch designs:

1. Generate your UI design using Stitch (via text prompt or Figma)
2. The skill will automatically convert the design to React components
3. Components are generated with:
   - TypeScript strict typing
   - Design token consistency
   - Atomic Design structure (atoms, molecules, organisms, templates, pages)
   - Production-ready code quality

## Integration

This skill integrates with:
- Antigravity
- Gemini CLI
- Claude Code
- Cursor
- GitHub Copilot

## Best Practices

- Use design tokens for consistency
- Follow the Atomic Design hierarchy
- Maintain type safety throughout
- Review generated components for your specific use case
- Customize as needed for your project requirements

## Related Skills

- `design-md`: Generates DESIGN.md documentation from Stitch projects
- `stitch-loop`: Generates complete multi-page websites from a single prompt
- `shadcn-ui`: Works with shadcn/ui component library
