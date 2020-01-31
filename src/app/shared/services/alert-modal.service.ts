import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TitlesAlert } from '../enums/titles-alert.enum';

@Injectable({
  providedIn: 'root'
})
export class AlertModalService {

  constructor(private toastrService: ToastrService) { }

  public showAlertSuccess(message: string): void {
    this.toastrService.success(message, TitlesAlert.CONCLUIDO);
  }

  public showAlertDanger(message: string): void {
    this.toastrService.error(message, TitlesAlert.ERRO);
  }

  public showAlertWarning(message: string): void {
    this.toastrService.warning(message, TitlesAlert.ALERTA);
  }

  public showConfirm(title: string, message: string, okTxt?: string, cancelTxt?: string): void {

  }

}
