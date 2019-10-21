import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

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
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.create(category).subscribe(
      (resultCategory) => this.actionsForSuccess(resultCategory),
      (error) => this.actionsForError(error)
    );
  }

  protected updateResource() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);

    this.categoryService.update(category).subscribe(
      (resultCategory) => this.actionsForSuccess(resultCategory),
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

  protected loadCategory(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      ).subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category);
        }, () => toastr.error('Ocorreu um erro no servidor, tente mais tarde.')
      );
    }
  }

  protected setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando Categoria: ' + categoryName;
    }
  }

  protected actionsForSuccess(category: Category) {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl('categories', { skipLocationChange: true }).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    );
  }

  protected actionsForError(error) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação!');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

}


}
