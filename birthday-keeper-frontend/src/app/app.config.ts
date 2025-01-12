import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Necessary for HttpClient
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

// For interceptor
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptorService } from './shared/interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
              provideRouter(routes),
              provideAnimationsAsync(),
              provideHttpClient(withInterceptorsFromDi()),  // Necessary for HttpClient
              
              // The following are for Interceptors
              {
                provide: HTTP_INTERCEPTORS,
                useClass: authInterceptorService,
                multi:true
              }
            ]
};
