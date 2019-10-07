import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EntriesRoutingModule } from './entries-routing.module';
import { EntryListComponent } from './entry-list/entry-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntryFormComponent } from './entry-form/entry-form.component';


@NgModule({
  imports: [
    CommonModule,
    EntriesRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    EntryListComponent,
    EntryFormComponent
  ]
})
export class EntriesModule { }
