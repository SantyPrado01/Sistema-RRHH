import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['expectedRole']; // Obtén el rol esperado desde la ruta
    const userRole = this.authService.getUserRole(); // Obtén el rol del usuario

    if (!this.authService.isAuthenticated() || userRole !== expectedRole) {
      this.router.navigate(['/login']);
      return false; // Bloquea la ruta
    }
    return true; // Permite el acceso
  }
}
