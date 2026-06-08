import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3001';
  private readonly CHAVE_USUARIO = 'usuarioLogado';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<boolean> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/login`, { email, senha })
      .pipe(
        map((usuario) => {
          localStorage.setItem(this.CHAVE_USUARIO, JSON.stringify(usuario));
          return true;
        }),
        catchError((err) => {
          const msg = err.error?.message || 'Erro no servidor';
          return throwError(() => new Error(msg));
        })
      );
  }

  registrarCliente(cliente: Omit<Cliente, 'id'>): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/auth/register`, cliente)
      .pipe(
        catchError((err) => {
          const msg = err.error?.message || 'Erro ao registrar';
          return throwError(() => new Error(msg));
        })
      );
  }

  logout() {
    localStorage.removeItem(this.CHAVE_USUARIO);
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem(this.CHAVE_USUARIO);
  }

  usuarioAtual(): any {
    if (!this.isBrowser()) return null;
    return JSON.parse(localStorage.getItem(this.CHAVE_USUARIO) || 'null');
  }

  getPerfilUsuario(): 'cliente' | 'corretor' | null {
    const user = this.usuarioAtual();
    return user?.tipo || null;
  }

  atualizarPerfil(id: string, dados: { nome: string }): Observable<any> {
    return this.http
      .put<any>(`${this.apiUrl}/usuarios/${id}`, dados)
      .pipe(
        map((usuario) => {
          const atual = this.usuarioAtual();
          const atualizado = { ...atual, ...usuario };
          localStorage.setItem(this.CHAVE_USUARIO, JSON.stringify(atualizado));
          return atualizado;
        }),
        catchError((err) => {
          const msg = err.error?.message || 'Erro ao atualizar perfil';
          return throwError(() => new Error(msg));
        })
      );
  }
}
