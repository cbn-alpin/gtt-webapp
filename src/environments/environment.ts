// This file can be replaced during build by using the `fileReplacements` array.
// `npm run build -- -c development` replaces `environment.ts` with `environment.development.ts`.
// This previous command use internally: `ng build --configuration=development`
// The list of environments can be found in `angular.json`.

export const environment = {
  production: true,
  apiUrl: '${API_URL}',
  googleClientId: '${GOOGLE_CLIENT_ID}',
};
