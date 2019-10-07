import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  public currentAction: string;
  public entryForm: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: string[] = [];
  public submittingForm = false;
  public entry: Entry = new Entry();

  constructor(private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry).subscribe(
      (resultEntry) => this.actionsForSuccess(resultEntry),
      (error) => this.actionsForError(error)
    );
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry).subscribe(
      (resultEntry) => this.actionsForSuccess(resultEntry),
      (error) => this.actionsForError(error)
    );
  }

  private setCurrentAction(): void {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm(): void {
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      description: [null],
      type: [null, Validators.compose([Validators.required])],
      amount: [null, Validators.compose([Validators.required])],
      date: [null, Validators.compose([Validators.required])],
      paid: [null, Validators.compose([Validators.required])],
      categoryId: [null, Validators.compose([Validators.required])],
    });
  }

  private loadEntry(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      ).subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        }, () => toastr.error('Ocorreu um erro no servidor, tente mais tarde.')
      );
    }
  }

  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Novo Lançamento';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando Lançamento: ' + entryName;
    }
  }

  private actionsForSuccess(entry: Entry) {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl('entries', { skipLocationChange: true }).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    );
  }

  private actionsForError(error) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

}
