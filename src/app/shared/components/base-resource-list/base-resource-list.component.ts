import { OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from './../../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  public resources: T[] = [];

  constructor(private baseResourceService: BaseResourceService<T>) { }

  ngOnInit() {
    this.getAllEntries();
  }

  getAllEntries() {
    this.baseResourceService.getAll().subscribe(
      resources => this.resources = resources.sort((a, b) => b.id - a.id),
      () => alert('Erro ao carregar a lista de lançamentos.')
    );
  }

  deleteResource(resource: T) {
    const mustDelete = confirm('Deseja realmente excluir este item.');

    if (mustDelete) {
      this.baseResourceService.delete(resource.id).subscribe(
        () => this.getAllEntries(),
        () => alert('Erro ao tentar excluir o lançamento.')
      );
    }
  }

}
