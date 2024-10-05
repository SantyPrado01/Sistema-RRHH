import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LoginService } from './login/services/login.service'; // Asegúrate de importar tu servicio de autenticación

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const requiredRole = route.data['role']; // Obtener el rol requerido de la ruta
    const userRole = this.authService.getUserRole(); // Obtener el rol del usuario desde el servicio

    if (userRole && userRole === requiredRole) {
      return true; // El usuario tiene el rol correcto, permitir el acceso
    }

    this.router.navigate(['/unauthorized']); // Redirigir a una página de acceso denegado o similar
    return false; // Bloquear el acceso
  }
}
