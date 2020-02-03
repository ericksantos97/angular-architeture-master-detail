import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { FormFieldErrorComponent } from './components/form-field-error/form-field-error.component';
import { PageHeaderComponent } from './components/page-header/page-header.component';
import { ServerErrorMessagesComponent } from './components/server-error-messages/server-error-messages.component';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // ModalModule.forRoot()
  ],
  declarations: [
    BreadCrumbComponent,
    PageHeaderComponent,
    FormFieldErrorComponent,
    ServerErrorMessagesComponent,
    // ConfirmModalComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadCrumbComponent,
    PageHeaderComponent,
    FormFieldErrorComponent,
    ServerErrorMessagesComponent,
    // ConfirmModalComponent
  ],
  entryComponents: [
    // ConfirmModalComponent
  ]
})
export class SharedModule { }
