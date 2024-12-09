import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ExtraOptions } from '@angular/router';

// Configuración del router
const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled',  // Restaurar la posición del scroll
  anchorScrolling: 'enabled',           // Habilitar anclajes
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes, 
      withRouterConfig(routerOptions)  // Usamos withRouterConfig para pasar las opciones
    ),
    provideHttpClient(),
  ],
}).catch(err => console.error(err));
