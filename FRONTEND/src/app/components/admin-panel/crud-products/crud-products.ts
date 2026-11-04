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

  createProduct(): void {
    const file = this.selectedFile();
    if (!file){
      alert('Selecciona la imagen del producto');
      return;
    }
    const formData = new FormData();
    formData.append('product', this.productForm.product);
    formData.append('category', this.productForm.category);
    formData.append('description', this.productForm.description);
    formData.append('price', this.productForm.price.toString());
    formData.append('rating', this.productForm.rating.toString());
    formData.append('numberOfReviews', this.productForm.numberOfReviews.toString());
    formData.append('images', file);
    formData.append('stock', this.productForm.stock.toString());
    this.productsService.create(formData).subscribe({
      next: () => {
        alert('Producto creado exitosamente');
        this.cancelForm();
        this.getProducts();
      },
      error: (err) => {
        console.error('Ocurrio un error al crear el producto', err);
        alert('Ocurrio un error al crear el producto');
      }
    })
  }
updateProduct(): void{
    if(!this.productForm._id){
      alert('No se encontró el ID del producto');
      return;
    }
    const formData = new FormData();
    formData.append('product', this.productForm.product);
    formData.append('category', this.productForm.category);
    formData.append('description', this.productForm.description);
    formData.append('price', this.productForm.price.toString());
    formData.append('rating', this.productForm.rating.toString());
    formData.append('numberOfReviews', this.productForm.numberOfReviews.toString());
    formData.append('stock', this.productForm.stock.toString());
    const file = this.selectedFile();
    if(file){
      formData.append('images',file);
    }
    this.productsService.update(this.productForm._id,formData).subscribe({
      next:() => {
        alert('El producto fue actualizado de manera exitosa');
        this.cancelForm();
        this.getProducts();
      },
      error:(err) =>{
        console.error('Error al actualizar producto'err);
        alert('Error al actualizar producto');
      }
    });
  }

  deleteProduct(id: string): void{
    if (confirm('¿Esta seguro de eliminar este producto?')){
      this.productsService.delete(id).subscribe({
        next: () => {
          this.getProducts();
        },
        error: (err) => console.error('Error al eliminar el producto', err)
      });
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
  cancelForm(): void {
    this.showForm.set(false);
    this.productForm = this.resetProducts();
    this.selectedFile.set(null);
  }
  
}
