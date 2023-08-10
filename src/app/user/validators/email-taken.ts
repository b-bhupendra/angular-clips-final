import { AngularFireAuth } from "@angular/fire/compat/auth"; 
import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";

@Injectable({
    providedIn:"root"
})
export class EmailTaken implements AsyncValidator {
    constructor(
        private auth:AngularFireAuth
        ){}
        // Promise<ValidationErrors | null> | Observable<ValidationErrors | null> 
    validate =   (control: AbstractControl<any, any>):Promise<ValidationErrors | null> | Observable<ValidationErrors | null>  =>{
        console.log('musse call kiya gaya gg')
         return this.auth.fetchSignInMethodsForEmail(control.value).then(
            response => response.length ? {emailTaken :true } : null
        )
         
        // return x;
    }
}
