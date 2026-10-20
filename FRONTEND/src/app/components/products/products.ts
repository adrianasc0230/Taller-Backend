import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  imports: [],
  selector: 'app-products',
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products {
  constructor(private router:Router){}

  login(){
    alert("Primero debes loguearte");
    this.router.navigate(['/login']);
  }
}
