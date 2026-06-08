import { Routes } from '@angular/router';
import { Home } from './app/views/public/home/home';
import { BuscaImoveis } from './app/views/public/busca-imoveis/busca-imoveis';
import { Login } from './app/auth/login/login';
import { RegisterCliente } from './app/auth/register-cliente/register-cliente';
import { MeusInteresses } from './app/views/cliente/meus-interesses/meus-interesses';
import { DashboardImoveis } from './app/views/corretor/dashboard-imoveis/dashboard-imoveis';
import { Perfil } from './app/views/perfil/perfil';
import { CardImovel } from './app/templates/components/card-imovel/card-imovel';
import { authGuard } from './app/core/guards/auth-guard';

export const routes: Routes = [
  { path: '',                component: Home },
  { path: 'busca',           component: BuscaImoveis },
  { path: 'login',           component: Login },
  { path: 'registrar',       component: RegisterCliente },
  { path: 'perfil',          component: Perfil,          canActivate: [authGuard] },
  { path: 'meus-interesses', component: MeusInteresses,  canActivate: [authGuard] },
  { path: 'dashboard',       component: DashboardImoveis, canActivate: [authGuard] },
  { path: 'imovel/:id',      component: CardImovel },
  { path: '**',              redirectTo: '' }
];
