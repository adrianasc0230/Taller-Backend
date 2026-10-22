import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Products } from './components/products/products';
import { NotFound } from './components/not-found/not-found';
import { Contacto } from './components/contacto/contacto';
import { Usaurios } from './components/usaurios/usaurios';
import { Shopping } from './components/shopping/shopping';
import {Cart} from './components/cart/cart';
import { AdminPanel } from './components/admin-panel/admin-panel';
import { authGuard } from './guards/auth-guard';
import { Recover } from './components/recover/recover';


export const routes: Routes = [
    {path: 'home', title: 'Home', component: Home},
    {path: 'login', title: 'Login', component: Login},
    {path: 'products', title: 'Products', component: Products},
    {path: 'contacto', title: 'Contacto', component: Contacto},
    {path: 'usaurios', title: 'Usaurios', component: Usaurios},
    {path: 'shopping', title: 'Shopping', component: Shopping, canActivate: [authGuard]},
    {path: 'cart', title:'Cart',component: Cart},
    {path: 'adminPanel', title: 'AdminPanel', component: AdminPanel, canActivate: [authGuard]},
    {path: 'recover', title: 'Recover', component: Recover},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', title: 'notFound', component: NotFound}
];
