import { Component, OnInit,OnDestroy  } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
// import { } firn
@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent {

  constructor(public modal : ModalService){}

  ngOnInit(){
    this.modal.register('auth')
  } 

  ngOnDestroy(){
    this.modal.unRegister('auth');
  }
  
}
