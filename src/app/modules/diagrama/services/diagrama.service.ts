import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IDiagrama, IDiagramaDB } from '../../dashboard/interfaces/diagrama.interface';

@Injectable({
  providedIn: 'root'
})
export class DiagramaService {
    private baseUrl: string = environment.baseUrl;    

    constructor(
      private http: HttpClient
    ) { }
  
    saveDiagram(name: string, nodos: string, links: string): Observable<IDiagramaDB> {
        const fecha = new Date(Date.now());
        console.log(fecha);
        const user = JSON.parse(localStorage.getItem("user")!);
        const userId = user.id;
        return this.http.post<IDiagramaDB>(`${this.baseUrl}/diagrama/${ userId }`, { nombre: name, fecha, nodos, links });
    }

    updateDiagram(idDiagrama: string, name: string, nodos: string, links: string): Observable<IDiagramaDB> {
      return this.http.patch<IDiagramaDB>(`${this.baseUrl}/diagrama/${idDiagrama}`, { nombre: name, nodos, links });
    }

    getDiagram(idDiagrama: string): Observable<IDiagramaDB> {
      return this.http.get<IDiagramaDB>(`${this.baseUrl}/diagrama/${idDiagrama}`);
    }

}
