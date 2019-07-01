import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const check = (req.url[req.url.length - 1]) + (req.url[req.url.length - 3]) +  (req.url[req.url.length - 2]);
    if (check === '1c9') {
      const authRequest = req.clone({
        headers: req.headers.set("Accept", "application/json, text/plain, */*")
      });
      return next.handle(authRequest);
    }
    const authToken = this.authService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}
