import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Credential } from '../../interfaces/credential';
import { ReactiveFormsModule, FormControl,FormGroup,Validators }from '@angular/forms';
import { LoginService } from '../../services/login-service';
import { response } from 'express';
import { Router } from '@angular/router';




@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  router = inject(Router);
  loginServide: LoginService = inject(LoginService);
  credentialsForm = new FormGroup({
    username: new FormControl('', Validators.required), 
    password: new FormControl('', Validators.required), 
    
  });

  handleSubmit() {
    if(this.credentialsForm.valid){
      const username = this.credentialsForm.value.username;
      const password = this.credentialsForm.value.password;
    if(typeof username === 'string' && typeof password === 'string'){
    const credential: Credential={
        username,
        password,
    };
  console.log(credential);

  this.loginServide.login(credential).subscribe((response: any)=>{
    console.log("response:", response);
   if(response.message && response.message.includes('Acceso permitido Bienvenido')){
    localStorage.setItem('token',response.data);
    const decoded: any =this.loginServide.decodeToken(response.data)
    console.log('token decodificado' , decoded);
    if(decoded.rol === 'admin'){
      this.router.navigateByUrl('/adminPanel')
    }else{
      alert("redirigiendo a productos");
      this.router.navigateByUrl('/shopping');
    }
   } else{console.log('no funcionó')};
    
  })
      };
    }else{
      console.log('Error, formulario inválido')
    }
  };
}
