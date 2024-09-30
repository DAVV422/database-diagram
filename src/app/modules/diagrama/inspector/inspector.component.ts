import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as go from 'gojs';


@Component({
  selector: 'app-diagram-inspector',
  templateUrl: './inspector.component.html',
  styleUrls: ['./inspector.component.css'],
})
export class InspectorComponent {

  @Input()
  public nodeData?: go.ObjectData | null;

  @Output()
  public onInspectorChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public onInputChange(propAndValObj: any) {
    console.log("Input")
    this.onInspectorChange.emit(propAndValObj);
  }

  public isNotAttribute(id: any){
    console.log(this.nodeData);
    if(id !== "attributes"){
      console.log("no atributo",id)
      return true;
    }
    console.log(id)
    return false;
  }

}