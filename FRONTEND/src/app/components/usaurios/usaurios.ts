import { Component, inject,signal, } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { response } from 'express';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-usaurios',
  styleUrl: './usaurios.css',
  templateUrl: './usaurios.html',
})
export class Usaurios {
  router = inject(Router);
  private fb = inject(FormBuilder);
  private userSevice = inject(UserService);
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  registerForm = this.fb.nonNullable.group({
    name:['',[Validators.required]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,]],
    idCard:['',[Validators.required]],
    telefono:['',[Validators.pattern(/^\+?[1-9]\d{6,14}$/)]],
    rol:['']
  });
  onFileSelected(event:Event):void{
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0 ){
      const file =  input.files[0];
      this.selectedFile.set(file);
      const reader = new FileReader();
      reader.onload = ()=>{
        this.imagePreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }else{
      this.selectedFile.set(null);
      this.imagePreview.set(null);
    }
  }
  onSubmit(): void{
    if(this.registerForm.invalid){
      alert('Por favor completa los campos obligatorios (Nombre, correo, contraseña, Número de documento)');
      return;
    }
    const datos = this.registerForm.getRawValue();
    const formData = new FormData();
    formData.append('name',datos.name);
    formData.append('email',datos.email);
    formData.append('password',datos.password);
    formData.append('idCard',datos.idCard);
    formData.append('telefono',datos.telefono);
    if(datos.rol){
      formData.append('rol',datos.rol);
    }
    const file = this.selectedFile();
    if(file){
      formData.append('images',file);
    }
    console.log('Datos con FormBuilder:', datos, 'Archivo:',file);
    this.userSevice.regiterUser(formData)
    .subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        if (response.message && response.message.includes('Usuario creado exitosamente con el rol de')){
          alert('¡Usuarios registrado con exito!');
          this.router.navigate(['/login']);
        }else{
          alert('no se pudo registrar: ' + response.message);
        }
      },
      error: (err) => {
        console.error('Error de red o del servidor:', err);
        alert('Ocurrio un error en el servidor al intentar registrar el usuario.');
      }
    });
  }
}
