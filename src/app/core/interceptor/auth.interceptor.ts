import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export function AuthInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const token = window.localStorage.getItem("token"); // Reemplaza con tu token JWT
    if (token) {
      // Clonamos la solicitud para añadir los headers
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      // Pasamos la solicitud clonada con el header al siguiente handler
      return next(cloned);
    }

    // Si no hay token, continuamos la solicitud sin modificarla
    return next(req);
}