import { Component, signal, inject} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-recover',
  styleUrl: './recover.css',
  templateUrl: './recover.html',
})
export class Recover {
  private http = inject(HttpClient);
  recoverForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  mensaje = signal <string>('');
  handleRecover(){
    if(this.recoverForm.valid){
      const email =this.recoverForm.value.email;
      this.http.post<any>('http://localhost:3002/user/forgotPassword', {email}).subscribe({
        next:(res)=>{
          this.mensaje.set(res.message || 'revisa tu correo para ver la nueva contraseña');
        },
        error:(err)=>{
          this.mensaje.set('ocurrio un error al enviar el correo');
          console.log(err);
        }
      });
    }else{
      this.mensaje.set('por favor ingrese un correo electronico valido');
    }
  }

}
