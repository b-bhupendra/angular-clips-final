import { Component , OnInit, Input } from '@angular/core';
import { FormGroup,FormControl,Validators } from '@angular/forms';
@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  @Input() control : FormControl = new FormControl()
  @Input() type  = 'text'
  @Input() placeholder = ''
  @Input() format = ''
 

  name = new FormControl('',[ Validators.required,Validators.minLength(3)
  ])
  email = new FormControl('',[
    Validators.email
  ])
  age   = new FormControl('',[
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ])
  password = new FormControl('',[
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)

  ])
  confirm_password = new FormControl('',[
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  ])
  phoneNumber = new FormControl('',[
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ])

  @Input() registerForm =  new FormGroup({
    name: this.name,
    email : this.email,
    age : this.age,
    password : this.password,
    confirm_password : this.confirm_password,
    phoneNumber : this.phoneNumber,
  })


  constructor(){}

  ngOnInit(): void{
    
  }
}
