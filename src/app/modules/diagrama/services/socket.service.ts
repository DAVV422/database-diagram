// src/app/diagram.service.ts
import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private baseUrl: string = environment.baseSocket; 

  userId: string; // ID único de usuario, podría generarse al conectar

  constructor() {
    this.socket = io(this.baseUrl);
    this.userId = Math.random().toString(36).substring(7); // Generar un ID aleatorio para el usuario
  }

  joinDiagram(diagramId: string) {
    this.socket.emit('joinDiagram', { diagramId });
  }

  emit(event: string, data: any) {
    this.socket.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    this.socket.on(event, callback);
  }

  // constructor() {
  //   this.socket = io(this.baseUrl); // Cambia el puerto si es necesario
  // }

  // // Emitir evento para unirse a un diagrama
  // joinDiagram(idDiagrama: string) {
  //   this.socket.emit('join-diagram', idDiagrama);
  // }
  
  // // Emitir evento para seleccionar nodo
  // selectNode(idDiagrama: string, nodeId: string) {
  //   this.socket.emit('select-node', { idDiagrama, nodeId });
  // }

  // // Emitir evento para deseleccionar nodo
  // deselectNode(idDiagrama: string, nodeId: string) {
  //   this.socket.emit('deselect-node', { idDiagrama, nodeId });
  // }

  // // Emitir evento para actualizar el diagrama
  // updateDiagram(idDiagrama: string, nodes: any[], links: any[]) {
  //   this.socket.emit('update-diagram', { idDiagrama, nodes, links });
  // }

  // // Escuchar evento de carga del diagrama
  // onDiagramLoaded(): Observable<any> {
  //   return new Observable((observer) => {
  //     this.socket.on('diagram-data', (data) => observer.next(data));
  //   });
  // }

  // checkNodeSelection(idDiagrama: string, nodeId: string): Observable<any> {
  //   this.socket.emit('check-node-selection', { idDiagrama, nodeId });
    
  //   // Escuchar la respuesta del servidor y transformarla en un observable
  //   return new Observable(observer => {
  //     this.socket.on('node-selection-checked', (response) => {
  //       observer.next(response);
  //     });
  //   });
  // }

  // // Escuchar cuando un nodo ha sido seleccionado
  // onNodeSelected(): Observable<any> {
  //   return new Observable((observer) => {
  //     this.socket.on('node-selected', (data) => observer.next(data));
  //   });
  // }

  // // Escuchar cuando un nodo ha sido deseleccionado
  // onNodeDeselected(): Observable<any> {
  //   return new Observable((observer) => {
  //     this.socket.on('node-deselected', (data) => observer.next(data));
  //   });
  // }

  // // Escuchar las actualizaciones del diagrama
  // onDiagramUpdated(): Observable<any> {
  //   return new Observable((observer) => {
  //     this.socket.on('diagram-updated', (data) => observer.next(data));
  //   });
  // }

  //Desconectar del socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
