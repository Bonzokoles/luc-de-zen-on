# Security Policy

## Supported Versions

This project is currently in active development. Security updates are provided for the latest version only.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

We take the security of this project seriously. If you discover a security vulnerability, please follow these steps:

1. **Do NOT** open a public issue
2. Send a detailed report to: karollisson.ams@gmail.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

You should receive a response within 48 hours. We will keep you informed about the progress of fixing the issue.

## Security Measures

This project implements the following security measures:

- **Environment Variables**: Sensitive data is stored in `.env` files which are gitignored
- **GitHub Actions Secrets**: CI/CD pipelines use GitHub Secrets for sensitive tokens
- **Dependency Scanning**: Regular npm audits are performed
- **Code Scanning**: CodeQL analysis is available

## Best Practices for Contributors

1. **Never commit sensitive data** (API keys, passwords, tokens) to the repository
2. **Always use environment variables** for configuration
3. **Keep dependencies updated** and review security advisories
4. **Run `npm audit`** before submitting pull requests
5. **Use `.env.example`** as a template, never commit actual `.env` files

## Known Security Considerations

- API keys must be configured via environment variables
- Cloudflare deployment requires proper secret configuration in GitHub Actions
- Regular dependency updates are recommended to address vulnerabilities
