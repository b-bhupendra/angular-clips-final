import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  
 
  name = new FormControl('', [Validators.required, Validators.minLength(3)
  ])
  email = new FormControl('', [
    Validators.email
  ])
  age = new FormControl('', [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)

  ])
  confirm_password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ])

 loginForm = new FormGroup({
    name: this.name,
    email: this.email,
    age: this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber,
  })
  
 
  showAlert = false
  alertMsg = 'Please wait! We are logging you in .'
  alertColor = 'blue'
  inSubmission = false

  constructor(private auth:AngularFireAuth){

  }

  async login(){
    console.log(this.loginForm.value)
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! We are logging you in.'
    this.inSubmission = true

    try{
      await this.auth.signInWithEmailAndPassword(
        this.email.value as string,
        this.password.value as string
      )
    }
    catch(e){
      this.inSubmission = false
      this.alertMsg = 'An unexpected error occured. Please try again later'
      this.alertColor = 'red'

      return 
    }

    this.alertMsg = 'Success! You are now logged in .'
    this.alertColor = 'green'

  }

}
