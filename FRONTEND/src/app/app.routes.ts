import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Products } from './components/products/products';
import { Usaurios } from './components/usaurios/usaurios';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
    {path: 'home', title: 'Home', component: Home},
    {path: 'login', title: 'Login', component: Login},
    {path: 'products', title: 'Products', component: Products},
    {path: 'usaurios', title: 'Usaurios', component: Usaurios},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', title: 'notFound', component: NotFound}
];
