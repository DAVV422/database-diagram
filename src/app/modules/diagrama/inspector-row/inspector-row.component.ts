import { Input, OnInit } from "@angular/core";
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-diagram-inspector-row',
  templateUrl: './inspector-row.component.html',
  styleUrls: ['./inspector-row.component.css']
})
export class InspectorRowComponent implements OnInit {
  titulo!: string;

  @Input()
  public id!: string

  @Input()
  public value!: string

  @Output()
  public onInputChangeEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
    console.log(this.id);
    if(this.id === "name") {
      this.titulo = "Nombre";
    } else {
      this.titulo = "Atributos";
    }
  }

  public onInputChange(e: any) {
    // when <input> is changed, emit an Object up, with what property changed, and to what new value
    this.onInputChangeEmitter.emit({prop: this.id, newVal: e.target.value});
  }

}