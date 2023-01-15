import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { enviroment } from "src/enviroments/enviroments";

import Swal from "sweetalert2";
import { UserService } from "./user.service";


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private _router: Router,
    private _user: UserService,
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let modifiedReq = req.clone();

    if (req.headers.has('Authorization')) {
      modifiedReq = req.clone({
        headers: req.headers.set('Authorization', `Page ${enviroment.Token_Page}`)
      });
    }
    else {
      if (this._user.user_logged) {
        modifiedReq = req.clone({
          headers: req.headers.set('Authorization', `Token ${this._user.user?.token}`)
        })
      }
    }

    const newHandler = next.handle(modifiedReq);
    return newHandler.pipe(
      catchError((err: HttpErrorResponse) => {
        if (req.method === 'DELETE' && req.url.includes('logout')) {
          this._router.navigate(['/getaway']);
          return throwError(err)
        }
        if (err.status === 403) {
          this._router.navigate(['/']);
          this._user.updateLocalUser(undefined);
          Swal.fire({
            title: 'Sesión expirada',
            text: 'Tú sesión ha terminado, por favor vuelve a iniciar sesión para continuar con tu navegación.',
            confirmButtonText:'De acuerdo',
            confirmButtonColor:'#079407',
            icon: 'warning'
          })
        }
        return throwError(err)
      })
    )
  }
}
