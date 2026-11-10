import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products-service';
import { Products } from '../../interfaces/products';

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
export class Shopping implements OnInit {
  private router = inject(Router);
  private productsService = inject(ProductsService);

  productosDeSaludyBienestar = signal<Products[]>([]);
  productosDeEquiposAgricolas =signal<Products[]>([]);
  productosDeSemillasyFertilizantes = signal<Products[]>([]);
  productosDeNutricionAnimal= signal<Products[]>([]);

  imageBaseUrl = 'http://localhost:3002/images/';
  ngOnInit(): void {
    this.loadSections();
  }

  loadSections(): void{
    this.productsService.getAll().subscribe({
      next: (all)=>{
        this.productosDeEquiposAgricolas.set(
          all.filter(prod => prod.category === 'Equipos Agrícolas')
        );
        this.productosDeNutricionAnimal.set(
          all.filter(prod => prod.category ==='Nutrición Animal')
        );
        this.productosDeSaludyBienestar.set(
          all.filter(prod => prod.category === 'Salud y Bienestar')
        );
        this.productosDeSemillasyFertilizantes.set(
          all.filter(prod => prod.category === 'Semillas y Fertilizantes')
        );
      },
      error:(err) => console.error('Error al cargar productos', err)
    });
  }
/*   private cart = inject(CartService);
  constructor(private router: Router) {} */

/*   shop() {
    this.cart.add();
  }

  logout() {
  localStorage.removeItem('token');
  this.cart.reset();
  this.router.navigate(['/login']);
} */
}