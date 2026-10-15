import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Credential } from '../../interfaces/credential';
import { ReactiveFormsModule, FormControl,FormGroup,Validators }from '@angular/forms';




@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  credentialsForm = new FormGroup({
    username: new FormControl('', Validators.required), 
    password: new FormControl('', Validators.required), 
  });

  handleSubmit() {
    console.log("works");
  }
}
