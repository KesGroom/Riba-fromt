import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    public _user: UserService,
    private _router: Router,
    public _database: DatabaseService
  ) { }

  private stop$ = new Subject<void>();
  public data: any;
  public newInstructor: boolean = false;


  private getUserInfo() {
    this._database.getDatabase('users/', `${this._user.user?.dni}`).pipe(takeUntil(this.stop$))
      .subscribe({
        next: (res: any) => {
          this.data = res;
        },
        error: (err: any) => {
          Swal.fire({
            title: 'Error al cargar la información del usuario',
            text: 'Estamos teniendo inconvenientes para cargar tu información, intenta iniciar sesión nuevamente o contactate con soporte',
            icon: 'error'
          })
        }
      })
  }

  ngOnInit(): void {
    if (!this._user.user_logged) this._router.navigate(['/login']);
    this.getUserInfo();
    this.getAllUsers();
  }
  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }

  public users: any[] = [];
  private getAllUsers() {
    this._database.getDatabase('users').pipe(takeUntil(this.stop$)).subscribe({
      next: (res: any) => {
        this.users = res['data'];
        console.log(this.users);

      }, error: (err: any) => {

      }
    })
  }
}
