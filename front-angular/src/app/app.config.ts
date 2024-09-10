import { ApplicationConfig, ApplicationModule, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { NabvarComponent } from './nabvar/nabvar.component';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()), 
    provideRouter(routes), 
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideClientHydration(),
    BrowserAnimationsModule,
    provideToastr(),
    FormsModule,
    NabvarComponent,
    provideHttpClient(withFetch()),  
  ]

};
