import { IDiagrama, IInvitacion } from "../../dashboard/interfaces/diagrama.interface";

export interface IUser {
    nombre: string;
    apellido: string;
    email: string;    
    password: string;
    role: string;
    isDeleted?: boolean;
    invitaciones?: IInvitacion;
    diagramas?: IDiagrama;
  }

  export interface IUserCreate {
    nombre: string;
    apellido: string;
    email: string;    
    password: string;
    role: string;
    isDeleted?: boolean;
  }