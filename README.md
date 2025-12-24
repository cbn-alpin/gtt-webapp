# gtt-webapp
Frontend de l'outil de Gestion du Temps de Travail (GTT).

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.11.

## Installation

Install NVM on your machine if it's not alread done. See [the NVM "Installing and Updating" documentation](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating).

To install this project in development mode, clone the project into your local workspace:

```bash
    git clone https://github.com/cbn-alpin/gtt-webapp.git
```

Navigate to the cloned project folder:

```bash
cd gtt-webapp/
```

Load (or install) Node and Npm recommended version:
```bash
# If they are not installed, use:
nvm install
# Enable the appropriate version of Node and npm:
nvm use
```

Install the dependencies:
```bash
npm install
```

## Development server

We use `ng serve` for a dev server. This command is accessible with:
```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `npm run ng -- generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm run build` to use `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to use `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm run e2e` to use `ng e2e` to execute the end-to-end tests via a platform of your choice.

We use Cypress for end-to-end tests. So, you can use this command too:

```bash
# Open the Cypress interface:
npm run cypress:open
# Run the tests if Angular dev server is running:
npm run cypress:run
```

## Further help

To get more help on the Angular CLI use `npm run ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Docker

To build an image localy use : `docker build -t gtt-webapp:develop --build-arg ANGULAR_ENV="development" .`

When you run the image you can pass this environment variables with your own values :

```
API_URL="http://127.0.0.1:5000/api"
GOOGLE_CLIENT_ID="apps.googleusercontent.com"
```
