import { Injectable } from '@angular/core';
import { BaseResourceModel } from '../models/base-resource.model';

@Injectable({
  providedIn: 'root'
})
export class BaseResourceService<T extends BaseResourceModel> {

  constructor() { }

}
