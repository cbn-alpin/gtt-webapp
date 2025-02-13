import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

export let APP_CONFIG: any;

fetch('/assets/config.json')
.then(response => response.json())
.then(config => {
  APP_CONFIG = config; // Assign the loaded config
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});