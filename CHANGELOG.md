# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Handle working hours limit by project. [@jpm-cbna]
- Add hours limit field to project form. [@jpm-cbna]

### Changed

- Rename and reduce size of image assets. [@jpm-cbna]
- Add and apply Prettier import sort. [@jpm-cbna]
- Add fetch hollidays method. [@jpm-cbna]

### Fixed

- Improve sticky header of time entry table. [@jpm-cbna]
- Correct heights of main content and container. [@jpm-cbna]
- Improve accessibility of home component html. [@jpm-cbna]
- Improve resizing of app sticky header. [@jpm-cbna]
- Fix Cypress `tsconfig.json` include parameter. [@jpm-cbna]
- Add auth http interceptor and refactor auth. [@jpm-cbna]
- Record time entry even if hour limit exceeded. [@jpm-cbna]
- Correct and simplify calendar component. [@jpm-cbna]
- Correctly handle first and last week of each year. [@jpm-cbna]

## [1.2.0] - 2026-02-12

### Added

- Add collapsible projects, improve the display. [@jpm-cbna]
- Add weekly total in hours and std days. [@jpm-cbna]
- Add Vscode settings. [@jpm-cbna]

### Changed

- Use readonly attributes for business constants. [@jpm-cbna]
- Improve code formatting. [@jpm-cbna]
- Update `package-lock.json`. [@jpm-cbna]

### Fixed

- Color background cells instead of inputs. [@jpm-cbna]

## [1.1.1] - 2026-01-22

### Fixed

- Use latest with prod deployment. [@jpm-cbna]

## [1.1.0] - 2026-01-22

### Added

- Add copilot instructions. [@jpm-cbna]
- Enable local-dev environment & add node version. [@jpm-cbna]
- Add and configure Eslint extension. [@jpm-cbna]
- Add rule to enforce kebab-case notation for filenames. [@jpm-cbna]
- Add section about coding conventions and code analysis. [@jpm-cbna]
- Add all extensions used. [@jpm-cbna]
- Add Prettier to format code. [@jpm-cbna]
- Add Cypress for e2e tests. [@jpm-cbna]

### Changed

- Hide travel expenses button for agent users. [@jpm-cbna]
- Rename npm command check-format to format:check. [@jpm-cbna]
- Enable tsconfig option for moment and tests. [@jpm-cbna]
- Use warn instead of error to unblock CI. [@jpm-cbna]
- Rename github action test-on-push. [@jpm-cbna]
- Apply eslint fixes. [@jpm-cbna]
- Use short names, reorder tests steps. [@jpm-cbna]
- Enable Eslint and Prettier in test on push action. [@jpm-cbna]
- Use staging instead of development environment. [@jpm-cbna]
- Improve tsconfig file for tests. [@jpm-cbna]
- Format all with Prettier. [@jpm-cbna]
- Use last Node version compatible with Angular. [@jpm-cbna]
- Add extension .md to LICENSE file. [@jpm-cbna]
- Improve the Nvm usage doc. [@jpm-cbna]
- Improve tasks with use of Nvm. [@jpm-cbna]

### Fixed

- Use existing UserInfos model instead of new one. [@jpm-cbna]
- Fix lint errors for user. [@jpm-cbna]
- Use a default value for googleClientId. [@jpm-cbna]
- Fix and enable tests on checks-on-push. [@jpm-cbna]
- Fix the Cypress version to use. [@jpm-cbna]

### Removed

- Remove local-dev environment to keep only development. [@jpm-cbna]

## [1.0.0] - 2025-12-12

### Added

- Initial project structure and frontend framework (Angular). [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
- Connect webapp to backend API. [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
- Time tracking, projects and actions interfaces. [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
- Travel and Expense management views. [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
- User authentication and Google OAuth2 login flow. [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
- CI/CD setup for testing and building frontend. [@SeynabouConde, @najoukou8, @l3miage-freundgm, @floreal15, @jpm-cbna, @ch-cbna]
