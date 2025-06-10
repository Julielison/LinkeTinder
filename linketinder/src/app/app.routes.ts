import { Routes } from '@angular/router';


export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'cadastro', 
    loadComponent: () => import('./pages/cadastro/cadastro.component').then(m => m.CadastroComponent) 
  },
  { path: '**', redirectTo: '/home' }
];