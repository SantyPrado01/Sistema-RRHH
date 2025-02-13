import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter, withRouterConfig } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { ExtraOptions } from '@angular/router';

const routerOptions: ExtraOptions = {
  scrollPositionRestoration: 'enabled', 
  anchorScrolling: 'enabled',           
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes, 
      withRouterConfig(routerOptions)  
    ),
    provideHttpClient(),
  ],
}).catch(err => console.error(err));
