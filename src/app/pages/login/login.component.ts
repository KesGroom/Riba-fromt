import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public show_password: boolean = false;
  public form!: FormGroup;
  public formCode!: FormGroup;
  public formRetrieve!: FormGroup;
  public retrievePasswordState: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _user: UserService,
    private _router: Router,
    public _database: DatabaseService
  ) {
    this.form = fb.group({
      "dni": ['', [Validators.required, Validators.pattern('^[0-9.]*$')]],
      "password": ['', [Validators.required, Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]]
    })
    this.formCode = fb.group({
      'code': ['', Validators.required]
    })
    this.formRetrieve = fb.group({
      'email': ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]]
    })
  }

  login() {
    this._user.login({ dni: this.form.controls['dni'].value, password: this.form.controls['password'].value });
  }

  ngOnInit(): void {
    if (this._user.user_logged) this._router.navigate(['/dashboard'])
  }
}
