import { ApplicationConfig, ApplicationModule, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { NabvarComponent } from './nabvar/nabvar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


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
    provideHttpClient(withFetch()), provideAnimationsAsync(), 
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, 
  ]

};
