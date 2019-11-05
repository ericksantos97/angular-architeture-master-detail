import { AfterContentChecked, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';
import { BaseToastr } from '../../models/base-toastr.model';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  public currentAction: string;
  public resourceForm: FormGroup;
  public pageTitle: string;
  public serverErrorMessages: string[] = [];
  public submittingForm = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(protected injector: Injector,
    public resource: T,
    protected baseResourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData) => T) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit(): void {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.baseResourceService.create(resource).subscribe(
      (resultResource) => this.actionsForSuccess(resultResource),
      (error) => this.actionsForError(error)
    );
  }

  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.baseResourceService.update(resource).subscribe(
      (resultResource) => this.actionsForSuccess(resultResource),
      (error) => this.actionsForError(error)
    );
  }

  protected setCurrentAction(): void {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  protected loadResource(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.baseResourceService.getById(+params.get('id')))
      ).subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource);
        }, () => toastr.error('Ocorreu um erro no servidor, tente mais tarde.')
      );
    }
  }

  protected setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = this.creationPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
    return 'Novo';
  }

  protected editionPageTitle(): string {
    return 'Edição';
  }

  protected actionsForSuccess(resource: T) {
    BaseToastr.configuration();
    toastr.success('Solicitação processada com sucesso!');
    const baseComponentPath = this.route.snapshot.parent.url[0].path;

    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(
      () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
    );
  }

  protected actionsForError(error) {
    BaseToastr.configuration();
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

  protected abstract buildResourceForm(): void;

}
