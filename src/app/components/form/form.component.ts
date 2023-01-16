import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnDestroy, OnInit {
  @Input() buttonText: string = 'Guardar información';
  @Input() academic: boolean = true;
  @Input() personal: boolean = true;
  @Input() details: boolean = true;
  @Input() edit: boolean = false;
  @Input() link: boolean = true;
  @Input() passwords: boolean = true;
  @Input() role: number = 3;
  @Input() data: any;
  @Input() instructor: boolean = false;

  @Output() formSave = new EventEmitter();

  public updateState: boolean = false;

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  private stop$ = new Subject<void>();

  public states: string[] = ["Amazonas", "Antioquia", "Antioquia", "Arauca", "Atlántico", "Bolívar", "Boyacá", "Caldas",
    "Caquetá", "Casanare", "Cauca", "Cesar", "Chocó", "Córdoba", "Cundinamarca", "Guainía",
    "Guaviare", "Huila", "La Guajira", "Magdalena", "Meta", "Nariño", "Norte de Santander", "Putumayo",
    "Risaralda", "Quindío", "San Andrés y Providencia", "Santander", "Sucre", "Tolima", "Valle del Cauca", "Vaupés", "Vichada"]

  public formBasic!: FormGroup;
  public formPersonal!: FormGroup;
  public formAcademic!: FormGroup;
  public formInstructor!: FormGroup;
  constructor(
    private fb: FormBuilder,
    public _database: DatabaseService,
    private _user: UserService,
    private _router: Router
  ) {
    this.formBasic = fb.group({
      "firstname": ["", [Validators.required, Validators.pattern('^[A-Za-zÑñÁáÉéÍíÓóÚú ]*$')]],
      "lastname": ["", [Validators.required, Validators.pattern('^[A-Za-zÑñÁáÉéÍíÓóÚú ]*$')]],
      "dni": ["", [Validators.required, Validators.pattern('^[0-9]*$')]],
      "phone": ["", [Validators.required, Validators.pattern('^[0-9]*$')]],
      "state": ["none", [Validators.required, Validators.pattern('^[A-Za-zÑñÁáÉéÍíÓóÚú ]*$')]],
      "city": ["", [Validators.required, Validators.pattern('^[A-Za-zÑñÁáÉéÍíÓóÚú ]*$')]],
      "address": ["", [Validators.required]],
      "password": ["", [Validators.pattern(/^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/)]],
      "email": ["", [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
    })
    this.formPersonal = fb.group({
      "gender": ["none", [Validators.required]],
      "birthday": ["", [Validators.required]],
      "disability": ["", [Validators.required]],
      "stratum": ["", [Validators.required, Validators.pattern('^[0-9]*$')]],
      "personal_description": [""],
    })
    this.formAcademic = fb.group({
      "regional": ["", [Validators.required]],
      "location": ["", [Validators.required]],
      "modality": ["", [Validators.required]],
      "group": ["", [Validators.required, Validators.pattern('^[0-9]*$')]],
      "teaching_stage": ["", [Validators.required]],
      "productive_stage": ["", [Validators.required]],
      "training_level": ["", [Validators.required]],
      "end_date": ["", [Validators.required]],
      "academic_information": [""],
    })
    this.formInstructor = fb.group({
      "specialty": ["", [Validators.required]],
      "company_name": ["", [Validators.required]],
      "position_name": ["", [Validators.required]],
      "position_description": [""],
      "start_date": ["", [Validators.required]],
      "working": [1, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.setData();
  }

  private setData() {
    if (this.data) {
      for (const key of Object.keys(this.formBasic.controls)) {
        this.formBasic.controls[key].setValue(this.data[key]);
        this.formBasic.get(key)?.disable();
      }
      if (this.data.role.id === 3) {
        for (const key of Object.keys(this.formPersonal.controls)) {
          if (this.data.personal_details[key].length > 1 && !isNaN(Date.parse(this.data.personal_details[key]))) {
            const date = new Date(this.data.personal_details[key]);
            const parseDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDay() < 10 ? '0' + date.getDay() : date.getDay()}`
            this.formPersonal.controls[key].setValue(parseDate);
          }
          else this.formPersonal.controls[key].setValue(this.data.personal_details[key]);
          this.formPersonal.get(key)?.disable();
        }
        for (const key of Object.keys(this.formAcademic.controls)) {
          if (!isNaN(Date.parse(this.data.academic_details[key]))) {
            const date = new Date(this.data.academic_details[key]);
            const parseDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDay() < 10 ? '0' + date.getDay() : date.getDay()}`
            this.formAcademic.controls[key].setValue(parseDate);
          }
          else this.formAcademic.controls[key].setValue(this.data.academic_details[key]);
          this.formAcademic.get(key)?.disable();
        }
      }
      if (this.data.role.id === 2) {
        for (const key of Object.keys(this.formInstructor.controls)) {
          if (this.data.instructor_details[key].length > 1 && !isNaN(Date.parse(this.data.instructor_details[key]))) {
            const date = new Date(this.data.instructor_details[key]);
            const parseDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDay() < 10 ? '0' + date.getDay() : date.getDay()}`
            this.formInstructor.controls[key].setValue(parseDate);
          }
          else this.formInstructor.controls[key].setValue(this.data.instructor_details[key]);
          this.formInstructor.get(key)?.disable();
        }
      }
    }
  }

  public save() {
    if (!this.edit) {
      let data: { basicInfo: any, role: number, details?: any } = { basicInfo: {}, role: this.role, details: {} };
      if (this.formBasic.valid) for (const key of Object.keys(this.formBasic.controls)) data.basicInfo[key] = this.formBasic.controls[key].value;
      else {
        this.Toast.fire({ icon: 'error', title: 'Error con la información básica' });
        return;
      }
      if ((this.personal && this.formPersonal.valid)) for (const key of Object.keys(this.formPersonal.controls)) data.details[key] = this.formPersonal.controls[key].value;
      else if (this.personal) {
        this.Toast.fire({ icon: 'error', title: 'Error con la información personal' });
        return;
      }
      if ((this.academic && this.formAcademic.valid)) for (const key of Object.keys(this.formAcademic.controls)) data.details[key] = this.formAcademic.controls[key].value;
      else if (this.academic) {
        this.Toast.fire({ icon: 'error', title: 'Error con la información acádemica' });
        return;
      }
      if ((this.instructor && this.formInstructor.valid)) for (const key of Object.keys(this.formInstructor.controls)) data.details[key] = this.formInstructor.controls[key].value;
      else if (this.instructor) {
        this.Toast.fire({ icon: 'error', title: 'Error con la información acádemica' });
        return;
      }
      if (!this.updateState)
        this._database.postDatabase('auth/register', { ...data, role: this.role }).pipe(takeUntil(this.stop$))
          .subscribe({
            next: (res: any) => {
              this.Toast.fire({ icon: 'success', title: 'Usuario creado correctamente' });
              if (this.passwords && this._router.url.includes('register')) this._user.login({ dni: this.formBasic.controls['dni'].value, password: this.formBasic.controls['password'].value });
              this.formBasic.reset();
              this.formPersonal.reset();
              this.formAcademic.reset();
              this.formInstructor.reset();
              this.formSave.emit(false);
            },
            error: (err: any) => {
              Swal.fire({
                title: "Hubo un problema con el registro",
                text: "Se ha presentado un error interno en el proceso de registro",
                icon: "error"
              })
            }
          });
      else
        this._database.putDatabase('users', this.data.dni, { ...data, role: this.role }).pipe(takeUntil(this.stop$))
          .subscribe({
            next: (res: any) => {
              this.Toast.fire({ icon: 'success', title: 'Usuario actualizado correctamente' });
              this.data = res;
              this._user.updateLocalUser({ ...res, token: this._user.user?.token });
              this.setData();
            },
            error: (err: any) => {
              Swal.fire({
                title: "Hubo un problema con la actualización",
                text: "Se ha presentado un error interno en el proceso de actualización",
                icon: "error"
              })
            }
          });
    } else {
      for (const key of Object.keys(this.formBasic.controls)) this.formBasic.controls[key].enable();
      if (this.data.role.id === 3) {
        for (const key of Object.keys(this.formPersonal.controls)) this.formPersonal.controls[key].enable();
        for (const key of Object.keys(this.formAcademic.controls)) this.formAcademic.controls[key].enable();
      }
      if (this.data.role.id === 2) {
        for (const key of Object.keys(this.formInstructor.controls)) this.formInstructor.controls[key].enable();
      }
      this.buttonText = "Actualizar información";
      this.edit = false;
      this.updateState = true;
    }
  }

  ngOnDestroy(): void {
    this.stop$.next();
    this.stop$.complete();
  }
}
