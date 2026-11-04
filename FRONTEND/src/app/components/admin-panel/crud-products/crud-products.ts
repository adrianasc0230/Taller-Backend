import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '../../../services/products-service';
import { Products } from '../../../interfaces/products';

@Component({
  imports: [FormsModule],
  selector: 'app-crud-products',
  styleUrl: './crud-products.css',
  templateUrl: './crud-products.html',
})
export class CrudProducts {
  private productsService = inject (ProductsService);
  products = signal <Products[]>([]);
  showForm = signal<boolean>(false);
  mode = signal<'crear' | 'editar'>('crear'); 
  selectedFile = signal<File | null>(null);
  imageBaseURL = 'http://localhost:3002/images/' 
}
