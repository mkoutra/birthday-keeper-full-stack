import {HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class authInterceptorService implements HttpInterceptor {
  
  // Add JWT to the header of the http request sent back to the backend.
  intercept(req: HttpRequest<any>, next: HttpHandler) {
      const token = localStorage.getItem('birthday_keeper_token')

      if (!token) {
        return next.handle(req)
      }

      const authRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + token)
      });

      return next.handle(authRequest);
  }
}
