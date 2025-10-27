import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Imovel } from '../models/imovel.model';

@Injectable({
  providedIn: 'root'
})
export class Imoveis {
  private apiUrl = 'http://localhost:3002/imoveis';

  constructor(private http: HttpClient) { }

  getImoveis(): Observable<Imovel[]> {
    return this.http.get<Imovel[]>(this.apiUrl);
  }

  getImovelById(id: string): Observable<Imovel> {
    return this.http.get<Imovel>(`${this.apiUrl}/${id}`);
  }


  createImovel(imovel: any): Observable<Imovel> {
    return this.http.post<Imovel>(this.apiUrl, imovel);
  }

  updateImovel(id: string, imovel: Imovel): Observable<Imovel> {
    return this.http.put<Imovel>(`${this.apiUrl}/${id}`, imovel);
  }

  deleteImovel(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
