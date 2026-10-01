import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Products } from '../products/products';


@Component({
  imports: [RouterLink, Products],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {}
