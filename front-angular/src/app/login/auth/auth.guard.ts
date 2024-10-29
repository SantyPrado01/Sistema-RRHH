import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRole = route.data['expectedRole']; 
    const userRole = this.authService.getUserRole(); 

    if (!this.authService.isAuthenticated() || userRole !== expectedRole) {
      this.router.navigate(['/login']);
      return false; 
    }
    return true; 
  }
}
