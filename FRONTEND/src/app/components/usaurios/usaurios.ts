import { Component, inject,signal } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-usaurios',
  styleUrl: './usaurios.css',
  templateUrl: './usaurios.html',
})
export class Usaurios {
  router = inject(Router);
  private fb = inject(FormBuilder);
  selectedFile = signal<File | null>(null);
  imagePreview = signal<string | null>(null);
  registerForm = this.fb.nonNullable.group({
    name:['',[Validators.required]],
    email:['',[Validators.required,Validators.email]],
    password:['',[Validators.required,]],
    idCard:['',[Validators.required]],
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
  inSubmit(): void{
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
    if(datos.rol){
      formData.append('rol',datos.rol);
    }
    const file = this.selectedFile();
    if(file){
      formData.append('images',file);
    }
    console.log('Datos con FormBuilder:', datos, 'Archivo:',file);
  }
}
