import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from "./nabvar/navbar.component";
import { UsuarioNewComponent } from './usuario/components/usuario-new/usuario-new.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet, LoginComponent, ReactiveFormsModule, UsuarioNewComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isNavbarCollapsed: boolean = false;
  showNavbar: boolean = true

  toggleNavbar(): void {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  constructor (private router: Router){

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) =>{
      const currentUrl = event.urlAfterRedirects
      this.showNavbar = !(currentUrl === '/' || currentUrl.includes('/login'));
    })

  }

}
