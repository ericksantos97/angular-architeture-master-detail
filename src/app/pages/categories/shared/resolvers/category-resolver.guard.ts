import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Category } from '../model/category.model';
import { CategoryService } from '../service/category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryResolver implements Resolve<Category> {

  constructor(private categoryService: CategoryService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Category> | Promise<Category> | Category {
    if (route.params && route.params['id']) {
      return this.categoryService.getById(route.params['id']);
    }

    return null;
  }

}
