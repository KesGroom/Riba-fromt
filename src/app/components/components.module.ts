import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FormComponent } from './form/form.component';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [HeaderComponent, FormComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule
  ], exports: [HeaderComponent, FormComponent]
})
export class ComponentsModule { }
