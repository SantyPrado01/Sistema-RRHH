import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NabvarComponent } from "./nabvar/nabvar.component";
import { UsuarioNewComponent } from './usuario/components/usuario-new/usuario-new.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NabvarComponent, RouterOutlet, LoginComponent, ReactiveFormsModule, UsuarioNewComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'front-angular';
}
