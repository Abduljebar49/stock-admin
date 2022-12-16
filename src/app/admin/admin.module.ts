import { ThemeModule } from './../@theme/theme.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './home/home.component';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormlyModule } from '@ngx-formly/core';
import { ADetailComponent } from './a-detail/a-detail.component';


@NgModule({
  declarations: [
    AdminComponent,
    HomeComponent,
    ADetailComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    NbCardModule,
    FormsModule,
    ThemeModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot(),
    NbLayoutModule,
  ]
})
export class AdminModule { }
