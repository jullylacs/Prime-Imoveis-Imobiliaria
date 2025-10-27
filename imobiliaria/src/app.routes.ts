import { Routes, RouterModule } from '@angular/router';
import { Home } from './app/views/public/home/home';
import { BuscaImoveis } from './app/views/public/busca-imoveis/busca-imoveis';
import { Login } from './app/auth/login/login';
import { RegisterCliente } from './app/auth/register-cliente/register-cliente';
import { MeusInteresses } from './app/views/cliente/meus-interesses/meus-interesses';
import { DashboardImoveis } from './app/views/corretor/dashboard-imoveis/dashboard-imoveis';
import { authGuard } from './app/core/guards/auth-guard';
import { corretorGuard } from './app/core/guards/corretor-guard';
import { CardImovel } from './app/templates/components/card-imovel/card-imovel';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    {path: '', component: Home},
    {path: 'busca', component: BuscaImoveis},
    {path: 'login', component: Login},
    {path: 'registrar', component: RegisterCliente},
    {path: 'meus-interesses', component: MeusInteresses},
    {path: 'dashboard', component: DashboardImoveis},
    {path: 'imovel/:id', component: CardImovel}
];


