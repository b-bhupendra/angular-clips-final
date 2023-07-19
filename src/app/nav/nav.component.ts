import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  constructor(public modal : ModalService){}
  ngOnInit(){}
  openModal($event: Event){
    $event.preventDefault()
    this.modal.toggleMode('auth')
    // console.log(this.modal.visible)
  }
}
