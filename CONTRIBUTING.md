# Contributing to use-page-view

Thank you for your interest in contributing to use-page-view! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Help

If you need help or have questions:

- Open a [GitHub issue](https://github.com/christophersesugh/use-page-view/issues) for bug reports or feature requests
- Contact maintainers: Christopher S. Aondona ([@christophersesugh](https://github.com/christophersesugh)) - Creator & Maintainer ([Website](https://codingsimba.com))
- Check existing [documentation](https://github.com/christophersesugh/use-page-view#readme) and issues first

**Response Times**: We aim to respond to issues and PRs within 48-72 hours, though this may vary based on maintainer availability.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, please include:

- **Clear, descriptive title**
- **Steps to reproduce** the problem
- **Expected vs actual behavior**
- **Code examples** demonstrating the issue
- **Environment details**: OS, browser, Node.js version, package version
- **Screenshots** if applicable
- **Error messages** or console output

### Suggesting Enhancements

For new features or improvements:

- **Use a clear, descriptive title**
- **Provide detailed description** of the proposed functionality
- **Explain the use case** and why it would be valuable
- **Reference similar features** in other projects if applicable
- **Consider backward compatibility** implications

### Pull Requests

1. **Fork** the repository and create your branch from `main`
2. **Follow branch naming**: `feature/description`, `fix/description`, or `docs/description`
3. **Add tests** for any new functionality
4. **Update documentation** if you change APIs or add features
5. **Ensure all tests pass** and code lints
6. **Write clear commit messages** (see guidelines below)
7. **Open your pull request** with a clear description

**Minimum Requirements**:

- All tests must pass (`npm run ci`)
- Code coverage should not decrease below 90%
- Code must pass linting (`npm run lint`)
- Documentation must be updated for API changes

## Development Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/christophersesugh/use-page-view.git
   cd use-page-view
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Test your setup**:

   ```bash
   npm run test
   npm run lint
   ```

4. **Link for local testing** (optional):
   ```bash
   # In this project's directory
   npm link
   # In your test app
   npm link use-page-view
   ```

## Testing

We use Vitest for testing with the following requirements:

- **Run all tests**: `npm run test`
- **Watch mode**: `npm run test:watch`
- **Run tests with coverage**: `npm run test:coverage`
- **Full CI check**: `npm run ci`
- **Minimum coverage**: 90%

**Testing Guidelines**:

- Write tests for all new features
- Include edge cases and error scenarios
- Test both TypeScript and JavaScript usage
- Mock external dependencies appropriately

## Code Style

We maintain consistent code style using:

- **TypeScript** for type safety
- **Prettier** for code formatting
- **ESLint** for code quality

**Commands**:

```bash
npm run lint        # Check code style and quality
npm run format      # Auto-format code with Prettier
```

**Style Guidelines**:

- Use TypeScript for all new code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Keep functions focused and well-named

## Branch Naming Conventions

- `feature/short-description` - New features
- `fix/short-description` - Bug fixes
- `docs/short-description` - Documentation updates
- `refactor/short-description` - Code refactoring
- `test/short-description` - Test improvements

## Commit Message Guidelines

Follow conventional commit format:

- **Use present tense**: "Add feature" not "Added feature"
- **Use imperative mood**: "Fix bug" not "Fixes bug"
- **Limit first line to 72 characters**
- **Reference issues**: "Fix login issue (#123)"
- **Be descriptive but concise**

Examples:

```
feat: add page view tracking for SPA routes
fix: prevent duplicate event listeners in useEffect
docs: update README with new API examples
test: add unit tests for edge cases
```

## Documentation

All contributions should include appropriate documentation:

- **Update README.md** for new features or API changes
- **Add JSDoc comments** to all public functions and types
- **Update TypeScript types** for any API modifications
- **Include code examples** for new functionality
- **Update changelog** via changeset (maintainers will guide you)

## Project Maintainers

Current maintainers who can review and approve PRs:

- Christopher S. Aondona ([@christophersesugh](https://github.com/christophersesugh)) - Creator & Maintainer ([Website](https://codingsimba.com))

**Maintainer Responsibilities**:

- Review and approve pull requests
- Manage releases and versioning
- Publish to npm
- Maintain project roadmap
- Moderate community discussions

## Release Process

**For Contributors**: You don't need to worry about releases! Just focus on your contributions.

**For Maintainers Only**:

1. Use `changeset` for version management
2. Run `npm run ci` to ensure all tests pass
3. Run `npm run release:local` to create new version and publish
4. Create GitHub release and update documentation

## Project Roadmap

Current priorities and upcoming features:

- NO PRIORITIES FOR NOW.

## Contributing Workflow Summary

1. **Fork** and clone the repository
2. **Create a feature branch** with appropriate naming
3. **Make your changes** following code style guidelines
4. **Add tests** and ensure they pass
5. **Update documentation** as needed
6. **Commit** with clear, conventional messages
7. **Push** to your fork and **open a PR**
8. **Respond to feedback** and make requested changes
9. **Wait for maintainer approval** and merge

## Questions or Issues?

- **Bug reports**: [Open an issue](https://github.com/christophersesugh/use-page-view/issues)
- **Feature requests**: [Open an issue](https://github.com/christophersesugh/use-page-view/issues) with "enhancement" label
- **General questions**: me@codingsimba.com
- **Security issues**: me@codingsimba.com

## License

By contributing to use-page-view, you agree that your contributions will be licensed under the project's MIT License.
