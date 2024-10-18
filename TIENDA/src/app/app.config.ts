import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import {CookieService} from 'ngx-cookie-service';
import { PermisionAuth } from './pages/auth/service/auth.guard';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideAnimations(), // required animations providers
  provideToastr(),provideHttpClient(withFetch()), provideClientHydration(),CookieService,PermisionAuth]
};
