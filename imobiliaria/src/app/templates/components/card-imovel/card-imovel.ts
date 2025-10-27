import { Component, OnInit } from '@angular/core';
import { Imovel } from '../../../core/models/imovel.model';
import { Imoveis } from '../../../core/services/imoveis';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { InteresseService } from '../../../core/services/interesse';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-card-imovel',
  imports: [CommonModule],
  templateUrl: './card-imovel.html',
  styleUrl: './card-imovel.css'
})

export class CardImovel implements OnInit {
  imovel?: Imovel;

  constructor(private imovelService: Imoveis, private route: ActivatedRoute, private interesseService: InteresseService, private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.imovelService.getImovelById(id).subscribe({
        next: (dados) => (this.imovel = dados),
        error: (err) => console.error('Erro ao buscar imóvel:', err),
      });
    }
  }

  registrarInteresse(imovelId?: string) {
  if (!imovelId) return;
  const usuario = this.auth.usuarioAtual();
  if (usuario && usuario.tipo === 'cliente') {
    this.interesseService.createInteresse(usuario.id, imovelId).subscribe(() => {
      alert('Interesse registrado com sucesso!');
      this.router.navigate(['/meus-interesses']); 
    });
  } else {
    alert('Apenas clientes podem marcar interesse.');
  }
}
}

