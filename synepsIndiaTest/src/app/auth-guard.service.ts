import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { ApiService } from './api.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private apiservice: ApiService) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.apiservice.isAuthenticated();
  }
}









