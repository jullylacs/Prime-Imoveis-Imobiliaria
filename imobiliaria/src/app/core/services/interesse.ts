import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteresseService {
  private apiUrl = 'http://localhost:3002/interesses';

  constructor(private http: HttpClient) {}

  createInteresse(clienteId: number, imovelId: string): Observable<any> {
    return this.http.post(this.apiUrl, { clienteId, imovelId });
  }

  getInteressesByCliente(clienteId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?clienteId=${clienteId}`);
  }
  
  deleteInteresse(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
