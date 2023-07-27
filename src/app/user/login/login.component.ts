import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = {
    email : '',
    password : ''
  }

  constructor(){

  }

  ngOnInit(): void{

  }

  login(){
    console.log(this.credentials)
  }
}
