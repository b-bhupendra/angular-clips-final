import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  isAuthenticated = false
  constructor(public modal : ModalService,
    public auth : AuthService
    ){
      this.auth.isAuthenticated$.subscribe(
        status => {
          this.isAuthenticated = status
        }

      );

    }
  ngOnInit(){}
  openModal($event: Event){
    $event.preventDefault()
    this.modal.toggleMode('auth')
    // console.log(this.modal.visible)
  }
}
