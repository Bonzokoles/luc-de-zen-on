#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);

function printUsage() {
  console.log(`
Usage: npx add-skill <repository> --skill <skill-name> [--global]

Arguments:
  <repository>     The GitHub repository in format owner/repo (e.g., google-labs-code/stitch-skills)
  --skill <name>   The skill to install (e.g., react:components, design-md)
  --global         Install the skill globally in .github/agents/ directory
  --list           List available skills from the repository

Examples:
  npx add-skill google-labs-code/stitch-skills --skill react:components --global
  npx add-skill google-labs-code/stitch-skills --list
`);
}

// Parse arguments
let repository = null;
let skillName = null;
let isGlobal = false;
let listSkills = false;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  
  if (arg === '--skill' && i + 1 < args.length) {
    skillName = args[i + 1];
    i++;
  } else if (arg === '--global') {
    isGlobal = true;
  } else if (arg === '--list') {
    listSkills = true;
  } else if (!arg.startsWith('--') && !repository) {
    repository = arg;
  }
}

// Available skills catalog
const SKILLS_CATALOG = {
  'google-labs-code/stitch-skills': {
    'react:components': {
      name: 'React Components Skill',
      description: 'Converts Stitch HTML/CSS designs into production-ready React components using Atomic Design methodology',
      files: {
        'react-components.md': `# React Components Skill

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

- \`design-md\`: Generates DESIGN.md documentation from Stitch projects
- \`stitch-loop\`: Generates complete multi-page websites from a single prompt
- \`shadcn-ui\`: Works with shadcn/ui component library
`
      }
    },
    'design-md': {
      name: 'Design Documentation Skill',
      description: 'Generates DESIGN.md documentation from Stitch projects',
      files: {
        'design-md.md': `# Design Documentation Skill

Automatically generates comprehensive DESIGN.md documentation from your Stitch projects.

## Features

- Extracts design decisions and rationale
- Documents component hierarchies
- Captures design token usage
- Creates visual documentation

## Usage

Run this skill after completing your Stitch design to automatically generate documentation that helps your team understand the design system.
`
      }
    },
    'shadcn-ui': {
      name: 'Shadcn UI Skill',
      description: 'Integration with shadcn/ui component library',
      files: {
        'shadcn-ui.md': `# Shadcn UI Skill

Integrates Stitch designs with the shadcn/ui component library.

## Features

- Maps Stitch components to shadcn/ui equivalents
- Maintains consistent styling
- Leverages existing component patterns

## Usage

Use this skill when working with projects that use shadcn/ui to ensure compatibility and consistency.
`
      }
    }
  }
};

function listAvailableSkills(repo) {
  const skills = SKILLS_CATALOG[repo];
  
  if (!skills) {
    console.error(`❌ Unknown repository: ${repo}`);
    console.log('\nAvailable repositories:');
    Object.keys(SKILLS_CATALOG).forEach(r => {
      console.log(`  - ${r}`);
    });
    process.exit(1);
  }
  
  console.log(`\n📦 Available skills from ${repo}:\n`);
  Object.keys(skills).forEach(skillKey => {
    const skill = skills[skillKey];
    console.log(`  🔧 ${skillKey}`);
    console.log(`     ${skill.description}\n`);
  });
}

function installSkill(repo, skill, global) {
  const skills = SKILLS_CATALOG[repo];
  
  if (!skills) {
    console.error(`❌ Unknown repository: ${repo}`);
    process.exit(1);
  }
  
  const skillData = skills[skill];
  
  if (!skillData) {
    console.error(`❌ Unknown skill: ${skill}`);
    console.log(`\nAvailable skills from ${repo}:`);
    Object.keys(skills).forEach(s => console.log(`  - ${s}`));
    process.exit(1);
  }
  
  console.log(`\n🚀 Installing skill: ${skill}`);
  console.log(`📦 From: ${repo}`);
  console.log(`📝 ${skillData.description}\n`);
  
  // Determine installation directory
  let installDir;
  if (global) {
    // Find the project root (look for package.json)
    let currentDir = process.cwd();
    let projectRoot = currentDir;
    
    while (currentDir !== '/') {
      if (existsSync(join(currentDir, 'package.json'))) {
        projectRoot = currentDir;
        break;
      }
      currentDir = dirname(currentDir);
    }
    
    installDir = join(projectRoot, '.github', 'agents', 'skills');
    console.log(`🌍 Global installation to: ${installDir}`);
  } else {
    installDir = join(process.cwd(), '.skills');
    console.log(`📁 Local installation to: ${installDir}`);
  }
  
  // Create directory if it doesn't exist
  if (!existsSync(installDir)) {
    mkdirSync(installDir, { recursive: true });
  }
  
  // Install skill files
  Object.entries(skillData.files).forEach(([filename, content]) => {
    const filePath = join(installDir, filename);
    writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Created: ${filename}`);
  });
  
  console.log(`\n✨ Skill "${skill}" installed successfully!`);
  console.log(`📍 Location: ${installDir}\n`);
  
  // Create or update skills manifest
  const manifestPath = join(installDir, 'skills-manifest.json');
  let manifest = { skills: [] };
  
  if (existsSync(manifestPath)) {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  }
  
  // Add or update skill in manifest
  const existingIndex = manifest.skills.findIndex(s => s.name === skill);
  const skillEntry = {
    name: skill,
    repository: repo,
    installedAt: new Date().toISOString(),
    description: skillData.description
  };
  
  if (existingIndex >= 0) {
    manifest.skills[existingIndex] = skillEntry;
  } else {
    manifest.skills.push(skillEntry);
  }
  
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`📋 Updated skills manifest`);
}

// Main execution
if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
  printUsage();
  process.exit(0);
}

if (!repository) {
  console.error('❌ Error: Repository is required\n');
  printUsage();
  process.exit(1);
}

if (listSkills) {
  listAvailableSkills(repository);
} else if (skillName) {
  installSkill(repository, skillName, isGlobal);
} else {
  console.error('❌ Error: Either --skill or --list must be specified\n');
  printUsage();
  process.exit(1);
}
