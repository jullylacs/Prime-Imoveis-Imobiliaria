import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { InteresseService } from '../../core/services/interesse';
import { Imoveis } from '../../core/services/imoveis';

@Component({
  selector: 'app-perfil',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  usuario: any = null;
  nomeEditado = '';
  salvando = false;
  sucesso = '';
  erro = '';
  statsCount = 0;

  constructor(
    public auth: AuthService,
    private interesseService: InteresseService,
    private imoveisService: Imoveis,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuario = this.auth.usuarioAtual();
    if (!this.usuario) {
      this.router.navigate(['/login']);
      return;
    }
    this.nomeEditado = this.usuario.nome;
    this.carregarStats();
  }

  carregarStats() {
    if (this.usuario.tipo === 'cliente') {
      this.interesseService.getInteressesByCliente(this.usuario.id).subscribe({
        next: (list) => this.statsCount = list.length,
        error: () => {}
      });
    } else {
      this.imoveisService.getImoveis().subscribe({
        next: (list) => this.statsCount = list.filter(
          (i: any) => String(i.corretorId) === String(this.usuario.id)
        ).length,
        error: () => {}
      });
    }
  }

  get iniciais(): string {
    if (!this.usuario?.nome) return '?';
    return this.usuario.nome
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  get labelTipo(): string {
    return this.usuario?.tipo === 'corretor' ? 'Corretor' : 'Cliente';
  }

  get labelStats(): string {
    return this.usuario?.tipo === 'corretor' ? 'Imóveis cadastrados' : 'Interesses salvos';
  }

  get iconStats(): string {
    return this.usuario?.tipo === 'corretor' ? 'home_work' : 'favorite';
  }

  get linkStats(): string {
    return this.usuario?.tipo === 'corretor' ? '/dashboard' : '/meus-interesses';
  }

  salvar() {
    if (!this.nomeEditado.trim() || this.salvando) return;
    this.sucesso = '';
    this.erro = '';
    this.salvando = true;

    this.auth.atualizarPerfil(this.usuario.id, { nome: this.nomeEditado.trim() }).subscribe({
      next: (u) => {
        this.usuario = u;
        this.salvando = false;
        this.sucesso = 'Nome atualizado com sucesso!';
        setTimeout(() => this.sucesso = '', 4000);
      },
      error: (err) => {
        this.salvando = false;
        this.erro = err.message || 'Erro ao atualizar perfil';
        setTimeout(() => this.erro = '', 4000);
      }
    });
  }
}
