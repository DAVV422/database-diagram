import { IUser } from "../../auth/interfaces/user.interface";

export interface NodoAtributo {
    name: string;
    type: string;
    visibility: string;
}

export interface NodoDiagrama {
    key: number;
    name: string;
    attributes: Array<NodoAtributo>;
}

export enum ESTADO {
    PENDIENTE = "pendiente",
    ACEPTADO = "aceptado"
}

export interface IInvitacion {
    id?: string; 
    fecha: Date;
    estado: ESTADO;
    usuario?: IUser;
    diagrama?: IDiagramaDB;
}

export interface IInvitacionCreate {
    fecha: Date;
    estado: ESTADO;
    usuario: string;
    invitacion: string;
}

export interface IDiagrama {
    id: string
    nombre: string;
    fecha: Date;
    nodos: NodoDiagrama;
    attributes: NodoAtributo;
    isDeleted?: boolean;
    usuario?: IUser;
    invitaciones?: IInvitacion[];
}

export interface IDiagramaDB {
    id: string
    nombre: string;
    fecha: Date;
    nodos: string;
    links: string;
    isDeleted?: boolean;
    usuario?: IUser;
    invitaciones?: IInvitacion[];
}

export interface IDiagramaCreate {
    nombre: string;
    fecha: Date;
    nodos: NodoDiagrama;
    attributes: NodoAtributo;
    isDeleted?: boolean;
    usuario: string;
}