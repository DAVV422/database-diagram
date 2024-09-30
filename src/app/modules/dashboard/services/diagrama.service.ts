import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { IDiagrama, IDiagramaCreate } from '../interfaces/diagrama.interface';

@Injectable({providedIn: 'root'})
export class DiagramaService {

    private baseUrl: string = environment.baseUrl + '/diagrama';

    constructor(
        private http: HttpClient
    ) { }
    
    crearDiagrama(diagrama: IDiagramaCreate): Observable<IDiagrama> {
        return this.http.post<IDiagrama>(`${ this.baseUrl }`, diagrama);
    }

    getDiagramasCreados(userId: string): Observable<IDiagrama[]> {
        return this.http.get<IDiagrama[]>(`${this.baseUrl}/created/${userId}`);
    }

    getDiagramasInvitados(userId: string): Observable<IDiagrama[]> {
        return this.http.get<IDiagrama[]>(`${this.baseUrl}/byinvitacion/${userId}`);
    }

    getDiagrama(diagramaId: string): Observable<IDiagrama | null> {
        return this.http.get<IDiagrama>(`${this.baseUrl}/${diagramaId}`).
        pipe(
            catchError(err => of(null))
          );
    }
}