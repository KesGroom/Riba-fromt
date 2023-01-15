import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Storage } from "@capacitor/storage";
import { Subject, takeUntil } from "rxjs";
import { enviroment } from "src/enviroments/enviroments";
import Swal from "sweetalert2";

export interface User {
  firstname: string,
  lastname: string,
  email: string,
  dni: string,
  phone: string,
  token: string,
  role: {
    id: number,
    name: string
  },
  token_expiration?: number,
  password1?: string,
  password2?: string
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public user: User | undefined;
  public user_logged: boolean = false;
  public userLoaded: boolean = false;

  constructor(
    private _http: HttpClient,
    private _router: Router
  ) {
    Storage.get({ key: 'user' }).then(
      res => {
        if (res.value) {
          this.updateLocalUser(JSON.parse(res.value));
          this.user_logged = true;
        }
        else this.updateLocalUser(undefined);
        this.userLoaded = true;
      }
    )
  }

  updateLocalUser(user?: User, storage: boolean = true, obs: boolean = true) {
    if (user && obs) this.setUser(user)
    if (user) {
      if (storage) {
        try {
          { Storage.set({ key: 'user', value: JSON.stringify(user) }); this.user_logged = true }
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      Storage.remove({ key: 'user' });
      Storage.remove({ key: 'admin_panel' });
    }
  }

  public setUser(value: User) {
    this.user = value;
  }

  public login(credentials: { dni: string, password: string }) {
    this._http.post(`${enviroment.URLBackend}auth/login/`, credentials).subscribe({
      next: (res: any) => {
        this.updateLocalUser(res['data']);
        this._router.navigate(['/dashboard']);
      },
      error: err => {
        if (err.status === 403)
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: 'Por favor valide sus datos y vuelva a intentarlo, si el error persiste le recomendamos reestablecer su contraseña o comunicarse con el área de soporte.',
            confirmButtonText: 'Entendido'
          })
        if (err.status === 404)
          Swal.fire({
            icon: 'error',
            title: 'No existe el usuario',
            text: 'Por favor valide sus datos y vuelva a intentarlo, o cree una nueva cuenta.',
            confirmButtonText: 'Entendido'
          })
      }
    })
  }

  public logOut(){
    return this._http.get(`${enviroment.URLBackend}auth/logout`)
  }


}
