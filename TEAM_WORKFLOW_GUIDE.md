# Team Workflow Guide - MyBonzo Platform

## Overview

This guide establishes the feature branch workflow and deployment processes for the MyBonzo platform, based on the GitHub rules outlined in the GITHUB_RULEZ documentation.

## Branch Strategy

### Main Branches

- **`main`** - Production-ready code only
  - Protected with branch protection rules
  - Requires PR reviews and passing CI/CD
  - Auto-deploys to production when merged
  - Never push directly to this branch

- **`develop`** - Integration branch for features
  - Staging environment deployment
  - Feature branches merge here first
  - Regular merges to `main` for releases

### Feature Branches

All new features, fixes, and experiments must use the feature branch pattern:

```bash
feature/[feature-name]     # New features
hotfix/[fix-name]          # Critical production fixes
bugfix/[bug-name]          # Bug fixes
experiment/[exp-name]      # Experimental features
```

## Development Workflow

### 1. Starting New Work

```bash
# Always start from the latest main
git checkout main
git pull origin main

# Create your feature branch
git checkout -b feature/user-authentication

# Push the branch to create remote tracking
git push -u origin feature/user-authentication
```

### 2. Development Process

```bash
# Make your changes
# Edit files, add features, fix bugs

# Stage and commit frequently with clear messages
git add .
git commit -m "feat: add login form validation"

# Push your changes regularly
git push origin feature/user-authentication
```

### 3. Keeping Branch Updated

```bash
# Regularly sync with main to avoid conflicts
git checkout main
git pull origin main
git checkout feature/user-authentication
git rebase main

# If there are conflicts, resolve them and continue
# git add .
# git rebase --continue

git push --force-with-lease origin feature/user-authentication
```

### 4. Creating Pull Requests

When your feature is ready:

1. **Push final changes:**
   ```bash
   git push origin feature/user-authentication
   ```

2. **Create PR on GitHub:**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select `feature/user-authentication` → `main`
   - Fill out the PR template
   - Add reviewers and labels

3. **PR Requirements:**
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Test coverage information

### 5. Code Review Process

**For PR Authors:**
- Respond promptly to review feedback
- Make requested changes in new commits
- Push updates to the same branch
- Request re-review when ready

**For Reviewers:**
- Review within 24 hours when possible
- Check functionality, security, and code quality
- Test the feature locally if needed
- Approve only when satisfied with changes

### 6. Merging and Cleanup

Once approved and CI passes:

```bash
# Merge via GitHub (squash and merge preferred)
# Then clean up locally:

git checkout main
git pull origin main
git branch -d feature/user-authentication
git remote prune origin
```

## Deployment Process

### Automatic Deployments

The platform uses automatic deployments based on branch activity:

#### Feature Branch Deployments
- **Trigger:** Push to any `feature/*` branch
- **Environment:** Preview/Staging
- **URL:** `https://[branch-name].[project].pages.dev`
- **Purpose:** Testing and review

#### Production Deployments
- **Trigger:** Merge to `main` branch
- **Environment:** Production
- **URL:** `https://www.mybonzo.com`
- **Purpose:** Live site updates

#### Manual Deployments

For emergency deployments or rollbacks:

```bash
# Deploy to production manually
pnpm build
pnpm deploy

# Deploy specific worker
npx wrangler deploy --config wrangler-[worker-name].toml
```

### Environment Management

#### Staging Environment
- **Purpose:** Integration testing, stakeholder review
- **Data:** Safe test data only
- **Access:** Team members and stakeholders
- **Secrets:** Staging-specific API keys and tokens

#### Production Environment
- **Purpose:** Live user traffic
- **Data:** Real user data - handle with care
- **Access:** Limited to authorized personnel
- **Secrets:** Production API keys and tokens

## CI/CD Pipeline

### Automated Checks

Every PR and push triggers automated checks:

1. **Linting** - Code style and syntax validation
2. **Testing** - Unit and integration tests
3. **Security Scan** - Vulnerability and secret detection
4. **Build** - Ensure the project builds successfully
5. **Type Check** - TypeScript type validation

### Required Status Checks

Before merging to `main`, these checks must pass:
- ✅ `test` - All tests passing
- ✅ `lint` - Code meets style standards
- ✅ `security-scan` - No security vulnerabilities
- ✅ `build` - Project builds without errors

### Failure Handling

If CI fails:

1. **Check the logs:** Review the failed job in GitHub Actions
2. **Fix locally:** Make necessary changes
3. **Test locally:** Run the same checks locally:
   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```
4. **Push fix:** Commit and push the fix
5. **Monitor:** Ensure CI passes on the new push

## Security Guidelines

### Secrets Management

- **Never commit secrets** to the repository
- Use Cloudflare Secrets Store for sensitive data
- Different secrets for different environments
- Regular rotation of API keys and tokens

### Code Security

- Use security scanning tools in CI/CD
- Regular dependency updates
- Follow secure coding practices
- Review security-sensitive changes carefully

### Access Control

- Minimum required permissions for team members
- Regular audit of repository access
- Use of code owners for sensitive files
- MFA required for all team members

## Testing Strategy

### Local Testing

Before pushing changes:

```bash
# Run linting
pnpm lint

# Run tests
pnpm test

# Test build
pnpm build

# Test locally
pnpm dev
```

### Integration Testing

Use the preview environments:

1. **Push to feature branch** for automatic preview deployment
2. **Test the preview** URL thoroughly
3. **Share with stakeholders** for feedback
4. **Fix issues** before merging

### Production Testing

After deployment to production:

1. **Smoke tests** - Basic functionality verification
2. **Monitor errors** - Watch for new errors or issues
3. **Performance monitoring** - Check for performance regressions
4. **User feedback** - Monitor user reports and feedback

## Troubleshooting

### Common Issues

#### "Branch protection rule violations"
- **Cause:** Trying to push directly to protected branch
- **Solution:** Use feature branches and PRs

#### "Required status checks failing"
- **Cause:** CI/CD pipeline failures
- **Solution:** Check logs and fix the underlying issue

#### "Merge conflicts"
- **Cause:** Multiple developers changing the same code
- **Solution:** Rebase your branch and resolve conflicts

#### "Secrets not accessible in deployment"
- **Cause:** Incorrect secrets store configuration
- **Solution:** Check Cloudflare Secrets Store setup

### Getting Help

1. **Check this documentation** first
2. **Review GitHub Actions logs** for CI/CD issues
3. **Ask in team chat** for quick questions
4. **Create GitHub issue** for bugs or feature requests
5. **Check Cloudflare documentation** for deployment issues

## Best Practices

### Commit Messages

Use conventional commit format:

```
feat: add new user authentication system
fix: resolve login redirect issue
docs: update API documentation
style: format code according to style guide
refactor: reorganize component structure
test: add unit tests for auth service
chore: update dependencies
```

### Branch Naming

- Use descriptive, kebab-case names
- Include the type prefix
- Keep names concise but clear

Good examples:
- `feature/user-profile-page`
- `bugfix/login-redirect-loop`
- `hotfix/payment-processing-error`

### PR Descriptions

Include:
- **What:** Brief description of changes
- **Why:** Reason for the changes
- **How:** Technical approach used
- **Testing:** How changes were tested
- **Screenshots:** For UI changes

### Code Quality

- Write self-documenting code
- Add comments for complex logic
- Keep functions small and focused
- Use TypeScript types properly
- Follow existing code patterns

## Team Communication

### Standup Updates

Include:
- What you worked on yesterday
- What you're working on today
- Any blockers or issues

### PR Reviews

- Be constructive and specific
- Explain the "why" behind suggestions
- Approve when you're confident in the changes
- Block when there are serious issues

### Issue Reporting

When reporting bugs or issues:
- Use the provided issue templates
- Include reproduction steps
- Add relevant screenshots or logs
- Label appropriately

## Monitoring and Maintenance

### Regular Tasks

#### Weekly
- Review and merge dependency updates
- Check security alerts and fix issues
- Clean up merged branches
- Review CI/CD performance

#### Monthly
- Audit team access and permissions
- Review and update documentation
- Analyze deployment metrics
- Plan technical debt reduction

#### Quarterly
- Review and update workflow processes
- Security audit and penetration testing
- Performance optimization review
- Team workflow retrospective

### Metrics to Monitor

- **Deployment frequency** - How often we deploy
- **Lead time** - Time from commit to production
- **Change failure rate** - Percentage of deployments causing issues
- **Recovery time** - Time to recover from incidents

## Emergency Procedures

### Production Hotfixes

For critical production issues:

1. **Create hotfix branch** from `main`:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-security-fix
   ```

2. **Make minimal changes** to fix the issue
3. **Test thoroughly** in staging
4. **Create emergency PR** with fast-track review
5. **Deploy immediately** after approval
6. **Monitor** post-deployment for issues

### Rollback Procedures

If a deployment causes issues:

1. **Immediate rollback** via GitHub Actions:
   - Go to Actions tab
   - Find last successful deployment
   - Click "Re-run all jobs"

2. **Manual rollback** via Cloudflare:
   - Access Cloudflare Pages dashboard
   - Select previous successful deployment
   - Click "Rollback to this deployment"

3. **Code rollback** if needed:
   ```bash
   git revert [commit-hash]
   git push origin main
   ```

### Incident Response

When production issues occur:

1. **Acknowledge** the incident quickly
2. **Assess** the impact and severity
3. **Communicate** status to stakeholders
4. **Fix** the immediate issue
5. **Document** the incident and lessons learned
6. **Prevent** similar issues in the future

---

## Quick Reference

### Essential Commands

```bash
# Start new feature
git checkout main && git pull origin main
git checkout -b feature/[name]

# Regular development
git add . && git commit -m "description"
git push origin feature/[name]

# Sync with main
git checkout main && git pull origin main
git checkout feature/[name] && git rebase main

# Local testing
pnpm lint && pnpm test && pnpm build

# Deploy manually
pnpm build && pnpm deploy
```

### Important Links

- **Repository:** https://github.com/Bonzokoles/luc-de-zen-on
- **Production Site:** https://www.mybonzo.com
- **Staging Dashboard:** https://staging.mybonzo.com
- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **GitHub Actions:** https://github.com/Bonzokoles/luc-de-zen-on/actions

### Contact Information

- **Team Lead:** @stolarczyk-ams
- **DevOps:** @stolarczyk-ams
- **Emergency Contact:** Create GitHub issue with `urgent` label

---

*This guide is a living document. Please update it as processes evolve and improve.*