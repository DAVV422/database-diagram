import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { IDiagrama, IDiagramaCreate, IDiagramaDB } from '../interfaces/diagrama.interface';

@Injectable({providedIn: 'root'})
export class DiagramaService {

    private baseUrl: string = environment.baseUrl + '/diagrama';

    constructor(
        private http: HttpClient
    ) { }
    
    crearDiagrama(diagrama: IDiagramaCreate): Observable<IDiagramaDB> {
        return this.http.post<IDiagramaDB>(`${ this.baseUrl }`, diagrama);
    }

    getDiagramasCreados(userId: string): Observable<IDiagramaDB[]> {
        return this.http.get<IDiagramaDB[]>(`${ this.baseUrl }/created/${ userId }`);
    }

    getDiagramasInvitados(userId: string): Observable<IDiagramaDB[]> {
        return this.http.get<IDiagramaDB[]>(`${ this.baseUrl }/byinvitacion/${ userId }`);
    }

    getInvitaciones(userId: string): Observable<IDiagramaDB[]> {
        return this.http.get<IDiagramaDB[]>(`${ this.baseUrl }/invitaciones/${ userId }`);
    }

    getDiagrama(diagramaId: string): Observable<IDiagramaDB | null> {
        return this.http.get<IDiagramaDB>(`${this.baseUrl}/${diagramaId}`).
        pipe(
            catchError(err => of(null))
          );
    }
}