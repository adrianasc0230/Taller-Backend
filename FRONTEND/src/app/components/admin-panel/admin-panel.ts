import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '../../services/user-service'; 
import { CrudProducts } from './crud-products/crud-products';

@Component({
  imports: [ CrudProducts],
  selector: 'app-admin-panel',
  styleUrl: './admin-panel.css',
  templateUrl: './admin-panel.html',
})
export class AdminPanel implements OnInit{
  private router = inject(Router);
  private userService = inject(UserService);
  adminName =signal <string>('Administrador');
  adminImage = signal<string>('http://localhost:3002/image/users/logindefault.png');
 ngOnInit(): void {
   this.loadAdminData();
 }
 
 loadAdminData(): void {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded: any = jwtDecode (token);
      console.log("token decodificado en Admin:", decoded);
      if (decoded.name){
        this.adminName.set(decoded.name);
      }
      if(decoded.image){
        const imageUrl = `http://localhost:3002/${decoded.image}`;
        this.adminImage.set(imageUrl);
      }
      if (decoded.id){
        this.userService.getUserById(decoded.id).subscribe({
          next: (response) => {
            if(response.message && response.message.includes('Acceso permitido Bienvenido')){
              this.adminName.set(response.data.name);
              if(response.data.image){
                this.adminImage.set(`http://localhost:3002/${response.data.image}`);
              }
            }
          },
          error: (err) => console.error('Error al obtener datos del admin:', err)
        });
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
    }
  }
 }

  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
