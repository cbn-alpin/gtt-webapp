# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Handle working hours limit by project.
- Add hours limit field to project form.
- Add new favicon. [@jpm-cbna, @eratajczak-cbna]
- Add new unit tests for Calendar component.
- Add `karma.conf.ts` file to disable randomness if necessary.

### Changed

- Rename and reduce size of image assets.
- Add and apply Prettier import sort.
- Add fetch hollidays method.
- Simplify time entry recording by using `onBlur` and Enter key instead of a timer with `ngOnChange`.
- Refactor all the components and apply code formatting & best practices.
- Switch all components and the application to the standalone version.
- Replace Moment with Luxon to reduce the number of third-party libraries.
- Use a setter for pagination and sorting with `@ViewChild` instead of a timer.

### Fixed

- Correct all the Jasmine unit tests.
- Fix Cypress `tsconfig.json` include parameter.
- Improve sticky header of time entry table.
- Correct heights of main content and container.
- Improve accessibility of home component html.
- Improve resizing of app sticky header.
- Add auth http interceptor and refactor auth.
- Record time entry even if hour limit exceeded.
- Correct and simplify calendar component.
- Correctly handle first and last week of each year.

## [1.2.0] - 2026-02-12

### Added

- Add collapsible projects, improve the display.
- Add weekly total in hours and std days.
- Add Vscode settings.

### Changed

- Use readonly attributes for business constants.
- Improve code formatting.
- Update `package-lock.json`.

### Fixed

- Color background cells instead of inputs.

## [1.1.1] - 2026-01-22

### Fixed

- Use latest with prod deployment.

## [1.1.0] - 2026-01-22

### Added

- Add copilot instructions.
- Enable local-dev environment & add node version.
- Add and configure Eslint extension.
- Add rule to enforce kebab-case notation for filenames.
- Add section about coding conventions and code analysis.
- Add all extensions used.
- Add Prettier to format code.
- Add Cypress for e2e tests.

### Changed

- Hide travel expenses button for agent users.
- Rename npm command check-format to format:check.
- Enable tsconfig option for moment and tests.
- Use warn instead of error to unblock CI.
- Rename github action test-on-push.
- Apply eslint fixes.
- Use short names, reorder tests steps.
- Enable Eslint and Prettier in test on push action.
- Use staging instead of development environment.
- Improve tsconfig file for tests.
- Format all with Prettier.
- Use last Node version compatible with Angular.
- Add extension .md to LICENSE file.
- Improve the Nvm usage doc.
- Improve tasks with use of Nvm.

### Fixed

- Use existing UserInfos model instead of new one.
- Fix lint errors for user.
- Use a default value for googleClientId.
- Fix and enable tests on checks-on-push.
- Fix the Cypress version to use.

### Removed

- Remove local-dev environment to keep only development.

## [1.0.0] - 2025-12-12

### Added

- Initial project structure and frontend framework (Angular). [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
- Connect webapp to backend API. [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
- Time tracking, projects and actions interfaces. [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
- Travel and Expense management views. [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
- User authentication and Google OAuth2 login flow. [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
- CI/CD setup for testing and building frontend. [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
