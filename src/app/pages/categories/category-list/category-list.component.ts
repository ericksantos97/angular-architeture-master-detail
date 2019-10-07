import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  public categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      () => alert('Erro ao carregar a lista de categorias.')
    );
  }

  deleteCategory(category: Category) {
    const mustDelete = confirm('Deseja realmente excluir este item.');

    if (mustDelete) {
      this.categoryService.delete(category.id).subscribe(
        () => this.getAllCategories(),
        () => alert('Erro ao tentar excluir à categoria.')
      );
    }
  }

}
