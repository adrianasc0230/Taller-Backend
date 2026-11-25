import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products-service';
import { Products } from '../../interfaces/products';

@Component({
  imports: [],
  selector: 'app-shopping',
  styleUrl: './shopping.css',
  templateUrl: './shopping.html',
})
export class Shopping implements OnInit {
  private router = inject(Router);
  private productsService = inject(ProductsService);

  // En tu clase Shopping dentro de shopping.ts:

logout(): void {
  localStorage.removeItem('token');
  this.router.navigate(['/login']);
}

  productosDeSaludyBienestar = signal<Products[]>([]);
  productosDeEquiposAgricolas = signal<Products[]>([]);
  productosDeSemillasyFertilizantes = signal<Products[]>([]);
  productosDeNutricionAnimal = signal<Products[]>([]);

  // Ojo: en la captura anterior tu backend servía imágenes en /images/users/ o /images/
  // Asegúrate de que coincida con la ruta estática de tu backend Express
  imageBaseUrl = 'http://localhost:3002/images/';

  ngOnInit(): void {
    this.loadSections();
  }

  // Función auxiliar para limpiar tildes y mayúsculas
  private cleanText(text: string | undefined): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  loadSections(): void {
    this.productsService.getAll().subscribe({
      next: (all: Products[]) => {
        this.productosDeEquiposAgricolas.set(
          all.filter(prod => this.cleanText(prod.category) === 'equipos agricolas')
        );

        this.productosDeNutricionAnimal.set(
          all.filter(prod => this.cleanText(prod.category) === 'nutricion animal')
        );

        this.productosDeSaludyBienestar.set(
          all.filter(prod => this.cleanText(prod.category) === 'salud y bienestar')
        );

        this.productosDeSemillasyFertilizantes.set(
          all.filter(prod => this.cleanText(prod.category) === 'semillas y fertilizantes')
        );
      },
      error: (err) => console.error('Error al cargar productos', err)
    });
  }
}