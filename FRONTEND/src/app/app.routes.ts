import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Products } from './components/products/products';
import { NotFound } from './components/not-found/not-found';
import { Footer } from './components/footer/footer';
import { Contacto } from './components/contacto/contacto';

export const routes: Routes = [
    {path: 'home', title: 'Home', component: Home},
    {path: 'login', title: 'Login', component: Login},
    {path: 'products', title: 'Products', component: Products},
    {path: 'footer', title: 'Footer', component: Footer},
    {path: 'contacto', title: 'Contacto', component: Contacto},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', title: 'notFound', component: NotFound}
];
