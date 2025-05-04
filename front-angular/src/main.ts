import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ExtraOptions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// 👇 Para idioma español
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);

// 👇 Importar y proveer el locale para Angular Material
import { MAT_DATE_LOCALE } from '@angular/material/core';

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withRouterConfig(routerOptions)),
    provideHttpClient(),
    provideAnimationsAsync('noop'),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' } // 👈 esto es clave
  ],
}).catch(err => console.error(err));
