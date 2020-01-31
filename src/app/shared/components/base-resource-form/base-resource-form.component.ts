import { AfterContentChecked, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';
import { BaseToastr } from '../../models/base-toastr.model';
import { Messages } from '../../enums/messages.enum';
import { AlertModalService } from '../../services/alert-modal.service';

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
    protected jsonDataToResourceFn: (jsonData) => T,
    protected alertService: AlertModalService) {
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
        }, () => this.alertService.showAlertDanger(Messages.FALHA_SERVIDOR)
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
    this.alertService.showAlertSuccess(Messages.OPERACAO_SUCESSO);
    const baseComponentPath = this.route.snapshot.parent.url[0].path;

    this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(
      () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
    );
  }

  protected actionsForError(error) {
    this.alertService.showAlertDanger(Messages.OPERACAO_ERRO);
    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = [Messages.FALHA_SERVIDOR];
    }
  }

  protected abstract buildResourceForm(): void;

}
