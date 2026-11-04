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
  imageBaseURL = 'http://localhost:3002/images/';
  productForm: Products = this.resetProducts();

  ngOnInit(): void {
    this.getProducts();
  }
  
  getProducts(): void {
    this.productsService.getAll().subscribe({
      next: (resp) => {
        this.products.set(resp);
      },
      error: (err) => console.error('Error al cargar los productos', err)
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0){
      this.selectedFile.set(input.files[0]);
    }
  }
  resetProducts(): Products {
    return {
    product: '', 
    category: '', 
    description: '', 
    price: 0, 
    rating: 0, 
    numberOfReviews: 0,   
    images: '', 
    stock: 0
    };
  }
  prepareCreate(): void{
    this.mode.set('crear');
    this.productForm = this.resetProducts();
    this.selectedFile.set(null);
    this.showForm.set(true);
  }
  selectForEdit(products: Products): void{
    this.mode.set('editar');
    this.productForm = { ...products};
    this.selectedFile.set(null);
    this.showForm.set(true);
  }
  
}
