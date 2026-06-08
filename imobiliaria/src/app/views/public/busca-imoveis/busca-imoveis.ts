import { Component, OnInit } from '@angular/core';
import { Imovel } from '../../../core/models/imovel.model';
import { Imoveis } from '../../../core/services/imoveis';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-busca-imoveis',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './busca-imoveis.html',
  styleUrl: './busca-imoveis.css'
})
export class BuscaImoveis implements OnInit {
  imoveis: Imovel[] = [];
  termoBusca = '';
  tipoFiltro = '';
  carregando = true;

  constructor(private imoveisService: Imoveis) {}

  ngOnInit(): void {
    this.imoveisService.getImoveis().subscribe({
      next: (dados) => { this.imoveis = dados; this.carregando = false; },
      error: () => { this.carregando = false; }
    });
  }

  get tipos(): string[] {
    return [...new Set(this.imoveis.map(i => i.tipo))].filter(Boolean);
  }

  get imoveisFiltrados(): Imovel[] {
    return this.imoveis.filter(i => {
      const matchTermo = !this.termoBusca ||
        i.titulo.toLowerCase().includes(this.termoBusca.toLowerCase()) ||
        i.cidade.toLowerCase().includes(this.termoBusca.toLowerCase());
      const matchTipo = !this.tipoFiltro || i.tipo === this.tipoFiltro;
      return matchTermo && matchTipo;
    });
  }

  limparFiltros() {
    this.termoBusca = '';
    this.tipoFiltro = '';
  }
}
