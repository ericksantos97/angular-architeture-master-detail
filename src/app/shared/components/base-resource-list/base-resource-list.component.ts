import { OnInit } from '@angular/core';
import { EMPTY } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import Messages from '../../enums/messages.enum';
import { BaseResourceModel } from '../../models/base-resource.model';
import { AlertModalService } from './../../services/alert-modal.service';
import { BaseResourceService } from './../../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  public resources: T[] = [];
  public componentName = '';

  constructor(protected baseResourceService: BaseResourceService<T>, protected alertService: AlertModalService) { }

  public ngOnInit() {
    this.getAllResources();
  }

  public getAllResources() {
    this.baseResourceService.getAll().subscribe(
      resources => this.resources = resources.sort((a, b) => b.id - a.id),
      () => this.alertService.showAlertDanger(Messages.ERRO_GENERICO_CARREGAMENTO(this.componentName))
    );
  }

  public deleteResource(resource: T) {
    const result$ = this.alertService.showConfirm('Confirmação', Messages.CONFIRMAR_EXCLUSAO);
    result$.asObservable().pipe(
      take(1),
      switchMap(result => result ? this.baseResourceService.delete(resource.id) : EMPTY)
    ).subscribe(
      () => this.getAllResources(),
      () => this.alertService.showAlertDanger(Messages.ERRO_EXCLUSAO)
    );
  }

}
