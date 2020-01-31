import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/service/category.service';
import { Category } from '../shared/model/category.model';
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';
import { AlertModalService } from 'src/app/shared/services/alert-modal.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent extends BaseResourceListComponent<Category> {

  constructor(protected categoryService: CategoryService, protected alertService: AlertModalService) {
    super(categoryService, alertService);
    this.componentName = 'Categorias';
  }

}
