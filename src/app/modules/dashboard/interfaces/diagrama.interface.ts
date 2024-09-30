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
    fecha: Date;
    estado: ESTADO;
    usuario?: IUser;
    invitacion?: IInvitacion;
}

export interface IInvitacionCreate {
    fecha: Date;
    estado: ESTADO;
    usuario: string;
    invitacion: string;
}

export interface IDiagrama {
    nombre: string;
    fecha: Date;
    nodos: NodoDiagrama;
    attributes: NodoAtributo;
    isDeleted?: boolean;
    usuario?: IUser;
    invitaciones?: IInvitacion[];
}

export interface IDiagramaCreate {
    nodos: NodoDiagrama;
    attributes: NodoAtributo;
    isDeleted?: boolean;
    usuario: string;
}