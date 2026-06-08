import { Component, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import { Imovel } from '../../../core/models/imovel.model';
import { Imoveis } from '../../../core/services/imoveis';
import { AuthService } from '../../../core/services/auth';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard-imoveis',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-imoveis.html',
  styleUrl: './dashboard-imoveis.css'
})
export class DashboardImoveis implements OnInit {
  imoveis = signal<Imovel[]>([]);
  carregando = signal(true);
  mostrarFormulario = false;
  modoEdicao = false;
  novoImovel: Imovel = new Imovel('', '', 0, '', '', 0, '', '');
  imagemSelecionada: File | null = null;
  previewUrl = signal('');

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private imoveisService: Imoveis, private auth: AuthService) {}

  ngOnInit(): void {
    this.listarImoveis();
  }

  listarImoveis(): void {
    this.imoveisService.getImoveis().subscribe({
      next: (dados) => { this.imoveis.set(dados); this.carregando.set(false); },
      error: (err) => { console.error('Erro ao buscar imóveis:', err); this.carregando.set(false); }
    });
  }

  abrirNovoImovel(): void {
    const abrindo = !this.mostrarFormulario;
    this.mostrarFormulario = abrindo;
    if (abrindo) {
      this.modoEdicao = false;
      this.resetForm();
    }
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  onImagemSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.imagemSelecionada = file;
    const reader = new FileReader();
    reader.onload = (e) => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  removerImagem(): void {
    this.imagemSelecionada = null;
    this.previewUrl.set('');
    this.novoImovel.imagemUrl = '';
    if (this.fileInput) this.fileInput.nativeElement.value = '';
  }

  cadastrarImovel(): void {
    const usuario = this.auth.usuarioAtual();
    const { id, ...dados } = this.novoImovel;

    const upload$ = this.imagemSelecionada
      ? this.imoveisService.uploadImagem(this.imagemSelecionada)
      : of({ url: '' });

    upload$.pipe(
      switchMap(({ url }) =>
        this.imoveisService.createImovel({ ...dados, corretorId: usuario.id, imagemUrl: url })
      )
    ).subscribe(() => {
      this.listarImoveis();
      this.mostrarFormulario = false;
      this.resetForm();
    });
  }

  editarImovel(imovel: Imovel): void {
    this.modoEdicao = true;
    this.mostrarFormulario = true;
    this.novoImovel = { ...imovel };
    this.previewUrl.set(imovel.imagemUrl);
    this.imagemSelecionada = null;
  }

  AtualizarImovel(id: any): void {
    const upload$ = this.imagemSelecionada
      ? this.imoveisService.uploadImagem(this.imagemSelecionada)
      : of({ url: this.novoImovel.imagemUrl });

    upload$.pipe(
      switchMap(({ url }) =>
        this.imoveisService.updateImovel(id, { ...this.novoImovel, imagemUrl: url })
      )
    ).subscribe({
      next: () => { this.cancelar(); this.listarImoveis(); },
      error: (err) => console.error('Erro ao atualizar imóvel:', err)
    });
  }

  excluirImovel(id: any): void {
    if (confirm('Tem certeza que deseja deletar este imóvel?')) {
      this.imoveisService.deleteImovel(id).subscribe({
        next: () => { this.resetForm(); this.listarImoveis(); },
        error: (err) => console.error('Erro ao deletar imóvel:', err)
      });
    }
  }

  cancelar(): void {
    this.mostrarFormulario = false;
    this.modoEdicao = false;
    this.resetForm();
  }

  private resetForm(): void {
    this.novoImovel = new Imovel('', '', 0, '', '', 0, '', '');
    this.imagemSelecionada = null;
    this.previewUrl.set('');
  }
}
