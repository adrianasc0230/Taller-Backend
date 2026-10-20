import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
/* 
@Service()
export class CartService {
    vecesClick = signal<number>(0);
    constructor(){
        if(typeof localStorage !== 'undefined'){
            const guardado = Number(localStorage.getItem('contadorShop'))||0;
            this.vecesClick.set(guardado);
        };

        }
    sumarClick(){
        const nuevoValor = this.vecesClick()+1;
        localStorage.setItem('contadorShop', nuevoValor.toString());
        this.vecesClick.set(nuevoValor);
        if(typeof localStorage !== 'undefined'){
            localStorage.setItem('contadorShop',nuevoValor.toString());
        }
    }
} */


@Injectable({ providedIn: 'root' })
export class CartService {
  private esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  count = signal(this.leer());

  add() {
    const nuevo = this.count() + 1;
    this.count.set(nuevo);
    if (this.esNavegador) {
      localStorage.setItem('contadorShop', nuevo.toString());
    }
  }

  reset() {
    this.count.set(0);
    if (this.esNavegador) {
      localStorage.removeItem('contadorShop');
    }
  }

  private leer(): number {
    if (!this.esNavegador) return 0;
    return Number(localStorage.getItem('contadorShop')) || 0;
  }
}