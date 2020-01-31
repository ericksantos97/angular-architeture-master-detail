import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {

  @Input()
  public title: string;

  @Input()
  public message: string;

  @Input()
  public cancelTxt = 'Não';

  @Input()
  public confirmTxt = 'Sim';

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  public onConfirm() {

  }

  public onClose(): void {
    this.bsModalRef.hide();
  }



}
