import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class PermisionAuth {
  constructor(
    public authService: AuthService,
    public router: Router,
  ) {
    
  }
  canActive(): boolean {
    if(!this.authService.user || !this.authService.token){
      this.router.navigateByUrl("/login");
      return false;
    }
    let token = this.authService.token;
    let expiration = (JSON.parse(atob(token.split(".")[1]))).exp;
    if(Math.floor((new Date).getTime() / 1000)  > expiration){
      this.authService.logout();
      return false;
    }
    return true;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  return inject(PermisionAuth).canActive();
};
