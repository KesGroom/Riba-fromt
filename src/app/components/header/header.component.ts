import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  public dropdown: boolean = false;
  private stop$ = new Subject<void>();
  constructor(
    public _user: UserService,
    private _router: Router,
    public _database: DatabaseService
  ) { }

  sessionOff() {
    this._user.logOut().pipe(takeUntil(this.stop$))
      .subscribe({
        next: (res: any) => {
          this._user.updateLocalUser(undefined);
          Swal.fire({
            icon: 'success',
            title: 'Sesión finalizada',
            confirmButtonText: 'Entendido'
          }).then(result => {
            this._user.user_logged = false;
            if (result.isConfirmed) this._router.navigate(['/login'])
          })
        },
        error: (err: any) => {
          console.log(err);

          this._user.updateLocalUser(undefined);
          Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error inesperado',
            text: 'Hemos finalizado su sesión para evitar errores en nuestros servicios',
            confirmButtonText: 'Entendido'
          })
          this._router.navigate(['/login']);
        }
      })
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
