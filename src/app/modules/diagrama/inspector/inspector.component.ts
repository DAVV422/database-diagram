import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as go from 'gojs';


@Component({
  selector: 'app-diagram-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.css'],
})
export class InspectorComponent{

  @Input() selectedNode: go.Node | go.Link | null = null;

  // relaciones: string[] = ['Generalization', 'Realization', 'Association', 'Composition', 'Aggregation'];
  relaciones: string[] = ['Herencia', 'Asociacion', 'Asociacion class', 'Composicion', 'Agregacion'];

  toLink: string = "";
  fromLink: string = "";
  relacion!: string;
  multiplicidad: boolean = false;

  @Output()
  public onInputChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  isNode(){
    if(this.selectedNode instanceof go.Node){
      return true;
    }
    return false;
  }

  isLink(){    
    if(this.selectedNode instanceof go.Link){          
      if(!this.selectedNode.data.relationship){
        this.relacion = this.relaciones[0];
      } else {
        console.log(this.selectedNode.data.relationship);
        if(this.selectedNode.data.relationship === ""){
          this.relacion = this.relaciones[0];          
          this.multiplicidad = false;
        }
        if(this.selectedNode.data.relationship === "Association"){
          this.relacion = this.relaciones[1];
          this.fromLink = this.selectedNode.data.text;
          this.toLink = this.selectedNode.data.toText;
          this.multiplicidad = true;
        }
        if(this.selectedNode.data.relationship === "Realization"){
          this.relacion = this.relaciones[2];
          this.multiplicidad = false;
        }
        if(this.selectedNode.data.relationship === "Composition"){
          this.relacion = this.relaciones[3];
          this.multiplicidad = false;
        }
        if(this.selectedNode.data.relationship === "Aggregation"){
          this.relacion = this.relaciones[4];
          this.multiplicidad = false;
        }
      }
      return true;
    }
    return false;
  }

  public onInputChange(e: any) {
    // when <input> is changed, emit an Object up, with what property changed, and to what new value
    this.onInputChangeEmitter.emit();
  }

  // Cambiar el nombre del nodo
  onNodeNameChange(newName: string) {
    if (this.selectedNode) {      
      const model = this.selectedNode.diagram!.model;
      const data = this.selectedNode.data;
      model.startTransaction('modify node name');
      model.setDataProperty(data, 'name', newName);
      model.commitTransaction('modify node name');
    }
  }

  // Cambiar el nombre del nodo
  onLinkChange(newName: string) {
    if (this.selectedNode) {
      this.multiplicidad = false;
      const model = this.selectedNode.diagram!.model;
      const data = this.selectedNode.data;
      model.startTransaction('modify node name');
      // 'Generalization', 'Realization', 'Dependency', 'Composition', 'Aggregation'
      if(newName === "Asociacion"){
        model.setDataProperty(data, 'relationship', 'Association');
        this.multiplicidad = true;
      }
      if(newName === "Asociacion class"){
        model.setDataProperty(data, 'relationship', 'Realization');        
      }
      if(newName === "Composicion"){
        model.setDataProperty(data, 'relationship', 'Composition');
      }
      if(newName === "Agregacion"){
        model.setDataProperty(data, 'relationship', 'Aggregation');
      }
      if(newName === "Herencia"){
        model.setDataProperty(data, 'relationship', '');
      }
      model.commitTransaction('modify node name');
    }
  }

  // Cambiar el nombre del nodo
  onLinkTextChange(newName: string) {
    if (this.selectedNode) {
      const model = this.selectedNode.diagram!.model;
      const data = this.selectedNode.data;
      model.startTransaction('modify node name');
      model.setDataProperty(data, 'text', newName);
      model.commitTransaction('modify node name');
    }
  }

  // Cambiar el nombre del nodo
  onLinkToTextChange(newName: string) {
    if (this.selectedNode) {
      const model = this.selectedNode.diagram!.model;
      const data = this.selectedNode.data;
      model.startTransaction('modify node name');
      model.setDataProperty(data, 'toText', newName);
      model.commitTransaction('modify node name');
    }
  }

  // Eliminar un atributo del nodo seleccionado
  removeAttribute(index: number) {
    if (this.selectedNode && this.selectedNode.diagram) {
      const model = this.selectedNode.diagram.model;
      const data = this.selectedNode.data;

      model.startTransaction('remove attribute');
      model.removeArrayItem(data.attributes, index); // Eliminar el atributo en la posición 'index'
      model.commitTransaction('remove attribute');
    }
  }

  inspeccionar(key: string){
    console.log(this.selectedNode!.data.name);
    if(key === "name" || key == "attributes") {
      return true;
    }
    return false;
  }
  
   // Añadir un nuevo atributo al nodo seleccionado
   addAttribute() {
    if (this.selectedNode) {      
      const model = this.selectedNode.diagram!.model;
      const data = this.selectedNode.data;

      model.startTransaction('add attribute');
      const newAttribute = { name: "newAttribute", type: "String", visibility: "public" };
      if (!data.attributes) {
        model.setDataProperty(data, 'attributes', []);
      }
      model.insertArrayItem(data.attributes, -1, newAttribute);
      model.commitTransaction('add attribute');
    }
  }
}