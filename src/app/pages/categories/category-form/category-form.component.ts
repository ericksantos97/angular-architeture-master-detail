import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
import { Category } from '../shared/model/category.model';
import { CategoryService } from '../shared/service/category.service';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  public category: Category = new Category();

  constructor(protected categoryService: CategoryService,
              protected injector: Injector,
              protected alertService: AlertModalService) {
    super(injector, new Category(), categoryService, Category.fromJson, alertService);
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      description: [null]
    });
  }

  protected creationPageTitle(): string {
    return 'Cadastro de Nova Categoria';
  }

  protected editionPageTitle(): string {
    const categoryName = this.resource.name || '';
    return `Editando Categoria: ${categoryName}`;
  }

}
