import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthLoginService } from '../services/auth-login.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  const router = inject(Router);
  const authLoginService = inject(AuthLoginService);
  if(authLoginService.isLoggedIn()){
    return true
  }
  router.navigate(['login'])
  return false;
}
