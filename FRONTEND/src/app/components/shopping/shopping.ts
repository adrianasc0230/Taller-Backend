import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart-service';


/* @Component({
  imports: [],
  selector: 'app-shopping',
  styleUrl: './shopping.css',
  templateUrl: './shopping.html',
})
export class Shopping {
  constructor(
    private router: Router,
    private cartService: CartService // <-- Inyectamos el servicio
  ) {}

  shop() {
    // Incrementa la signal y actualiza el localStorage
    this.cartService.sumarClick();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
} */

  @Component({
  imports: [],
  selector: 'app-shopping',
  styleUrl: './shopping.css',
  templateUrl: './shopping.html',
})
export class Shopping {
  private cart = inject(CartService);
  constructor(private router: Router) {}

  shop() {
    this.cart.add();
  }

  logout() {
  localStorage.removeItem('token');
  this.cart.reset();
  this.router.navigate(['/login']);
}
}