import { OnInit } from '@angular/core';
import { BaseResourceModel } from '../../models/base-resource.model';
import { AlertModalService } from './../../services/alert-modal.service';
import { BaseResourceService } from './../../services/base-resource.service';
import { BehaviorSubject } from 'rxjs';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  public resources: T[] = [];
  public componentName = '';

  constructor(protected baseResourceService: BaseResourceService<T>, protected alertService: AlertModalService) { }

  ngOnInit() {
    this.getAllResources();
  }

  getAllResources() {
    this.baseResourceService.getAll().subscribe(
      resources => this.resources = resources.sort((a, b) => b.id - a.id),
      () => this.alertService.showAlertDanger(`Erro ao carregar a lista de ${this.componentName}.`)
    );
  }

  deleteResource(resource: T) {
    const mustDelete = confirm('Deseja realmente excluir este item.');

    if (mustDelete) {
      this.baseResourceService.delete(resource.id).subscribe(
        () => this.getAllResources(),
        () => alert('Erro ao tentar excluir o lançamento.')
      );
    }
  }


}
