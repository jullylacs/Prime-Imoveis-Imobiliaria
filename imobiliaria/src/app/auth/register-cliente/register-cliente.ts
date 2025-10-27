import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { Cliente } from '../../core/models/cliente.model';
import { identity, Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-cliente',
  imports: [FormsModule, RouterLink],
  templateUrl: './register-cliente.html',
  styleUrl: './register-cliente.css'
})

export class RegisterCliente {
  nome = "";
  email = "";
  senha = "";
  erro = '';

  constructor(private auth: AuthService, private router: Router){}

  onSubmit() {
    this.erro = '';
    this.auth.registrarCliente({ 
      nome: this.nome,
      email: this.email,
      senha: this.senha
    }).subscribe({
      next: (user) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.message === 'Usuário já existe') {
          this.erro = 'Este email já está cadastrado';
        } else {
          this.erro = 'Erro ao registrar. Tente novamente';
        }
      }
    });
  }
}