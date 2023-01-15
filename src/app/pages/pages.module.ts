import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '../components/components.module';
import { RegisterComponent } from './register/register.component';
import { AgGridModule } from 'ag-grid-angular';



@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    AgGridModule
  ]
})
export class PagesModule { }
