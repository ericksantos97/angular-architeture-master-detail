import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    BreadCrumbComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadCrumbComponent
  ]
})
export class SharedModule { }
