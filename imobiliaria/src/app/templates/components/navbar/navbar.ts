import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../../core/services/auth'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  constructor(
    private router: Router,
    public auth: AuthService 
  ) {}

  get iniciais(): string {
    const nome = this.auth.usuarioAtual()?.nome;
    if (!nome) return '?';
    return nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  }
}
