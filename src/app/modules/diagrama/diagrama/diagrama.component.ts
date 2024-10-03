import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { produce } from "immer";
import * as go from 'gojs'

import { DataSyncService } from '../../gojs/service/data-sync.service';
import { DiagramComponent } from '../../gojs/diagram/diagram.component';
import { DiagramaService } from '../services/diagrama.service';
import { IDiagrama, IDiagramaDB } from '../../dashboard/interfaces/diagrama.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-diagram-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrl: './diagrama.component.css',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class DiagramaComponent implements AfterViewInit, OnInit {
  @ViewChild('myDiagram', { static: true }) public myDiagramComponent!: DiagramComponent;
  @ViewChild('currentFile') currentFile: ElementRef<HTMLDivElement> | undefined;

  idDiagrama!: string;

  UnsavedFileName: string = 'unsaved';
  diagramaDB?: IDiagramaDB;

  public state = {
    // Diagram state props
    diagramNodeData: [ ],
    diagramLinkData: [ ],
    diagramModelData: { prop: 'value' },
    skipsDiagramUpdate: false,
    selectedNodeData: null, // used by InspectorComponent
  };

  public diagramDivClassName = 'myDiagramDiv';

  // initialize diagram / templates
  public initDiagram(): go.Diagram {
    const diagram =
      new go.Diagram ({
        'undoManager.isEnabled': true,        
        allowMove: true,
        model: new go.GraphLinksModel(
          {
            nodeKeyProperty: 'key',
            linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
            copiesArrays: true,
            copiesArrayObjects: true,
            linkCategoryProperty: "relationship",
          }
        )
      });

      // show visibility or access as a single character at the beginning of each property or method
      const convertVisibility = (v: any) => {
        return "+";
      }

      // the item template for properties
    let propertyTemplate =
      new go.Panel ('Horizontal')
      // property visibility/access
      .add(
        new go.TextBlock (
          { isMultiline: false, editable: false, width: 12 }
        )
        .bind("text", "visibility", convertVisibility)
      )
      // property name, underlined if scope=="class" to indicate static property
      .add(
        new go.TextBlock(
          { isMultiline: false, editable: true },
        )
        .bindTwoWay('text', 'name')
        .bind("isUnderline", "scope", s => s[0] === 'c')
      )
      // property type, if known
      .add(
        new go.TextBlock("")
        .bind("text", "type", t => t ? ": " : "")
      )
      .add(
        new go.TextBlock({ isMultiline: false, editable: true })
        .bindTwoWay("text", "type")
      );

    // define the Node template
    diagram.nodeTemplate =
      new go.Node(go.Panel.Auto, // the whole node panel
        {
          locationSpot: go.Spot.Center,       
          // fromSpot: go.Spot.AllSides,
        }
      )        
        .add(          
          new go.Shape(
            { 
              fill: "lightyellow",              
              cursor: "pointer",
              portId: "",
              fromLinkable: true,
              toLinkable: true,
              fromSpot: go.Spot.AllSides,
              toSpot: go.Spot.AllSides, 
           }
          ),
          new go.Panel('Table',
            {
              defaultRowSeparatorStroke: "black",
            }
          )
          // the table header
          .add(
            new go.TextBlock(
              {
                row: 0, columnSpan: 2, margin: 3,
                alignment: go.Spot.Center,
                font: "bold 12pt sans-serif",
                isMultiline: true,
                editable: true
              }
            )
              .bindTwoWay("text", "name"),
            // properties
            new go.TextBlock("Attributes",
              { row: 1, font: "italic 10pt sans-serif" }
            )
              .bindObject(
                new go.Binding("visible", "visible", v => !v).ofObject("ATTRIBUTES")
              ),
            new go.Panel("Vertical",
              {
                name: "ATTRIBUTES",
                row: 1, margin: 3,
                stretch: go.Stretch.Horizontal,
                defaultAlignment: go.Spot.Left,
                background: "lightyellow",
                itemTemplate: propertyTemplate
              })
              .bind("itemArray", "attributes"),
            //PanelExpanderButton
            go.GraphObject.build("PanelExpanderButton",
              {
                row: 1, column: 1,
                alignment: go.Spot.TopRight,
                visible: false
              },
              "ATTRIBUTES"
            )
            .bind("visible", "attributes", arr => arr.length > 0),
            // methods
            new go.Panel("Vertical")
            .setProperties(
              {
                name: "METHODS",
                row: 2, margin: 5,
                stretch: go.Stretch.Horizontal,
                defaultAlignment: go.Spot.Left,
                background: "lightyellow",
              }
            )
          )
        )
        .bindTwoWay("location", "loc", go.Point.parse, go.Point.stringifyFixed(1));

        const linkStyle = () => {
          return {
            isTreeLink: false,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            fromEndSegmentLength: 0,
            toEndSegmentLength: 0            
          };
        }

    diagram.linkTemplate =
        // by default, "Inheritance" or "Generalization"
        new go.Link(
          linkStyle()
        )
        .setProperties(
          { isTreeLink: true }
        )
        .add(
          new go.Shape()
        )
        .add(
          //the link shape
          new go.Shape({ toArrow: "Triangle", fill: "white" })
        );

        diagram.linkTemplateMap.add("Association",
          new go.Link(linkStyle())
          .add(
            new go.Shape()
          )
          .add(
            new go.Panel("Auto",
              {
                segmentIndex: 0,
                segmentOffset: new go.Point(13,0)
              }
            )
            .add(
              new go.Shape("RoundedRectangle", { fill: "#f7f9fc" })
              .setProperties({ stroke: "#eeeeee" })
            )
            //the "from" label
            .add(
              new go.TextBlock(
                {
                  textAlign: "center",
                  font: "bold 12px sans-serif",                  
                  background: "#f7f9fc",
                  segmentOffset: new go.Point(NaN, NaN),
                  segmentOrientation: go.Link.OrientUpright
                }
              )
              .bind("text", "text")
            )
          )
          .add(
            new go.Panel("Auto",
              {
                segmentIndex: -1,
                segmentOffset: new go.Point(-13,0)
              }
            )
            .add(
              new go.Shape("RoundedRectangle",
                {
                  fill: "#edf6fc"
                }
              )
              .setProperties({stroke: "#eeeeee"})
            )
            // the "to" label
            .add(
              new go.TextBlock(
                {
                  textAlign: "center",
                  font: "bold 12px sans-serif",
                  // stroke: "black",
                  segmentIndex: -1,
                  segmentOffset: new go.Point(NaN, NaN),
                  segmentOrientation: go.Link.OrientUpright,
                }
              )
              .bind("text", "toText")
            )
          )
        );

        diagram.linkTemplateMap.add("Realization",
          new go.Link( linkStyle())
          .add(
            new go.Shape({ strokeDashArray: [3, 2] })
          )
        );

        diagram.linkTemplateMap.add("Dependency",
          new go.Link( linkStyle())
          .add(
            new go.Shape({ strokeDashArray: [3, 2] })
          )
          .add(
            new go.Shape({ toArrow: "OpenTriangle" })
          )
        );

        diagram.linkTemplateMap.add("Composition",
          new go.Link( linkStyle())
          .add(
            new go.Shape()
          )
          .add(
            new go.Shape({ fromArrow: "StretchedDiamond", scale: 1.3 })
          )
        );

        diagram.linkTemplateMap.add("Aggregation",
          new go.Link( linkStyle())
          .add(
            new go.Shape()
          )
          .add(
            new go.Shape({ fromArrow: "StretchedDiamond", fill: "white", scale: 1.3 })
          )
        )

    return diagram;
  }

  // When the diagram model changes, update app data to reflect those changes. Be sure to use immer's "produce" function to preserve immutability
  public diagramModelChange = (changes: go.IncrementalData) => {    
    if (!(changes) || (this.state.skipsDiagramUpdate)) return;
    const appComp: DiagramaComponent = this;
    this.state = produce(this.state, draft => {
      draft.skipsDiagramUpdate = true;
      const nodeData: any = DataSyncService.syncNodeData(changes, draft.diagramNodeData);
      const linkData: any = DataSyncService.syncLinkData(changes, draft.diagramLinkData);
      const modelData: any = DataSyncService.syncModelData(changes, draft.diagramModelData);
      console.log(nodeData);
      draft.diagramNodeData = nodeData;
      draft.diagramLinkData = linkData;
      draft.diagramModelData = modelData;
      // If one of the modified nodes was the selected node used by the inspector, update the inspector selectedNodeData object
      const modifiedNodeDatas = changes.modifiedNodeData;
      if (modifiedNodeDatas && draft.selectedNodeData) {
        for (let i = 0; i < modifiedNodeDatas.length; i++) {
          const mn: any = modifiedNodeDatas[i];
          const nodeKeyProperty: any = appComp.myDiagramComponent.diagram!.model.nodeKeyProperty as string;
          if (mn[nodeKeyProperty] === draft.selectedNodeData![nodeKeyProperty]) {
            draft.selectedNodeData = mn;
            console.log(draft.selectedNodeData);
          }
        }
      }
    });
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute, 
    private socketService: SocketService,
    private router: Router,
    private diagramaService: DiagramaService
  ) { }

  ngOnInit(): void {    
    this.idDiagrama = this.route.snapshot.params['id'];
    // this.socketService.joinDiagram(this.idDiagrama);
      this.diagramaService.getDiagram(this.idDiagrama).
        subscribe(
          (resp: any) => {
            this.diagramaDB = resp.data;
            (this.state.diagramNodeData as any) = this.diagramaDB!.nodos != "[]" ? JSON.parse(this.diagramaDB!.nodos as string) : [];
            (this.state.diagramLinkData as any) = this.diagramaDB!.links != "[]" ? JSON.parse(this.diagramaDB!.links as string) : [];          
            (this.currentFile!.nativeElement.textContent as any) = this.diagramaDB?.nombre;
          }
        );    
  }

  // Overview Component testing
  public oDivClassName = 'myOverviewDiv';
  public initOverview(): go.Overview {
    return new go.Overview();
  }
  public observedDiagram: go.Diagram | null = null;

  // currently selected node; for inspector
  public selectedNodeData: go.ObjectData | null = null;

  public ngAfterViewInit() {
    if (this.observedDiagram) return;
    (this.observedDiagram as any) = this.myDiagramComponent.diagram;
    this.cdr.detectChanges(); // IMPORTANT: without this, Angular will throw ExpressionChangedAfterItHasBeenCheckedError (dev mode only)

    const appComp: DiagramaComponent = this;
    // listener for inspector
    this.myDiagramComponent.diagram!.addDiagramListener('ChangedSelection', (e) => {
      if (e.diagram.selection.count === 0) {
        appComp.selectedNodeData = null;
      }
      const node = e.diagram.selection.first();
      appComp.state = produce(appComp.state, (draft: any) => {
        if (node instanceof go.Node) {
          draft.selectedNodeData = node;
        } else if (node instanceof go.Link) {          
          draft.selectedNodeData = node;
        } else {
          draft.selectedNodeData = null;
        }
      });
    });
  } // end ngAfterViewInit


  /**
   * Update a node's data based on some change to an inspector row's input
   * @param changedPropAndVal An object with 2 entries: "prop" (the node data prop changed), and "newVal" (the value the user entered in the inspector <input>)
   */
  public handleInspectorChange(changedPropAndVal: any) {
    const path = changedPropAndVal.prop;
    const value = changedPropAndVal.newVal;

    this.state = produce(this.state, (draft:any) => {
      let data: any = draft.selectedNodeData!;
      console.log(draft.selectedNodeData);      
      data[path] = value;
      const key = data!.id;
      const idx = draft.diagramNodeData.findIndex((nd: any) => nd.key == key);
      if (idx >= 0) {
        draft.diagramNodeData[idx] = data;
        draft.skipsDiagramUpdate = false; // we need to sync GoJS data with this new app state, so do not skips Diagram update
      }
    });
  }

  public toggleDarkMode() {
    const myDiagramDiv = document.getElementById('myDiagramDiv');
    const button = document.getElementById('darkMode');
    myDiagramDiv!.style.backgroundColor = (button!.innerHTML === 'Dark Mode') ? '#242424' : '#ffffff';
    button!.innerHTML = (button!.innerHTML === 'Dark Mode') ? 'Light Mode' : 'Dark Mode';
    this.colorSwitch();
  }

  public colorSwitch() {
    this.myDiagramComponent.diagram!.model.commit(m => {
      m.set(m.modelData, "darkMode", !(m.modelData as any).darkMode);
    }, null);
  }

  public getCurrentFileName(): string {
    const currentFile = this.currentFile?.nativeElement;
    const name = currentFile?.textContent || '';
    if (name && name[name.length - 1] === '*') return name.slice(0, -1);
    return name;
  }

  public setCurrentFileName(name: string) {
    // const currentFile = document.getElementById('currentFile') as HTMLDivElement;
    if (this.myDiagramComponent.diagram!.isModified) {
      name += '*';
    }
    this.currentFile!.nativeElement.textContent = name;
  }

  public checkLocalStorage() {
    return (typeof (Storage) !== 'undefined') && (window.localStorage !== undefined);
  }

  // saves the current floor plan to local storage
  public saveDocument() {    
      const saveName = this.diagramaDB?.nombre;
      if (saveName === this.UnsavedFileName) {
        this.saveDocumentAs();
      } else {
        // saveDiagramProperties();
        const diagramaSTRING = this.myDiagramComponent.diagram!.model.toJson();
        const diagramaJSON = JSON.parse(diagramaSTRING);
        console.log(diagramaJSON);
        const nodos = JSON.stringify(diagramaJSON.nodeDataArray);
        const links = JSON.stringify(diagramaJSON.linkDataArray);         
          this.diagramaService.updateDiagram(this.idDiagrama, saveName!, nodos, links).
          subscribe(
            (resp : any) => {
              console.log(resp);
              this.diagramaDB = resp.data;
              confirm("Diagrama Guardado");
            }
          );              
    }
  }

  // saves floor plan to local storage with a new name
  public saveDocumentAs() {
    if (this.checkLocalStorage()) {
      const saveName = prompt('Save file as...') || this.getCurrentFileName();
      if (saveName && saveName !== this.UnsavedFileName) {
        this.setCurrentFileName(saveName);
        // saveDiagramProperties();
        const diagramaSTRING = this.myDiagramComponent.diagram!.model.toJson();
        const diagramaJSON = JSON.parse(diagramaSTRING);
        const nodos = JSON.stringify(diagramaJSON.nodeDataArray);
        const links = JSON.stringify(diagramaJSON.linkDataArray);        
        this.myDiagramComponent.diagram!.isModified = false;
        this.diagramaService.updateDiagram(this.idDiagrama, saveName!, nodos, links).
          subscribe(
            (resp : any) => {
              console.log(resp);
              this.diagramaDB = resp.data;
              confirm("Diagrama Guardado");
            }
          );
      }
    }
  }

public undo() { this.myDiagramComponent.diagram!.commandHandler.undo(); }
public redo() { this.myDiagramComponent.diagram!.commandHandler.redo(); }
public cutSelection() { this.myDiagramComponent.diagram!.commandHandler.cutSelection(); }
public copySelection() { this.myDiagramComponent.diagram!.commandHandler.copySelection(); }
public pasteSelection() { this.myDiagramComponent.diagram!.commandHandler.pasteSelection(); }
public deleteSelection() { this.myDiagramComponent.diagram!.commandHandler.deleteSelection(); }
public selectAll() { this.myDiagramComponent.diagram!.commandHandler.selectAll(); }

  salir(){
    this.socketService.disconnect();
    this.router.navigate(['dashboard/diagramas']);
  }

  exportToXMI() {
    // diagram: go.Diagram
    const diagram: go.Diagram = this.myDiagramComponent.diagram!;
    // Empezar la estructura básica de un archivo XMI
    let xmi = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xmi += '<XMI xmi.version="2.1" xmlns:uml="http://schema.omg.org/spec/UML/2.0">\n';
    xmi += '  <uml:Model xmi:type="uml:Model" name="GoJS Diagram">\n';
  
    // Exportar los nodos como clases UML
    diagram.model.nodeDataArray.forEach((node: any) => {
      xmi += `    <uml:Class xmi:type="uml:Class" name="${node.name || node.key}">\n`;
  
      if (node.attributes) {
        node.attributes.forEach((attr: any) => {
          xmi += `      <uml:Property name="${attr.name}" type="${attr.type}" visibility="${attr.visibility}" />\n`;
        });
      }
  
      xmi += '    </uml:Class>\n';
    });
  
    // Exportar los enlaces (relaciones) entre nodos
    (diagram.model as any).linkDataArray.forEach((link: any) => {
      const fromNode = diagram.findNodeForKey(link.from);
      const toNode = diagram.findNodeForKey(link.to);
  
      if (fromNode && toNode) {
        xmi += `    <uml:Association memberEnd="${fromNode.data.key} ${toNode.data.key}" />\n`;
      }
    });
  
    // Cerrar las etiquetas de UML y XMI
    xmi += '  </uml:Model>\n';
    xmi += '</XMI>';
  
    // Descargar el archivo generado
    this.downloadXMI(xmi);
  }
  
  // Función para descargar el archivo XMI
  downloadXMI(xmiContent: string) {
    const blob = new Blob([xmiContent], { type: 'text/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.xmi';
    a.click();
    window.URL.revokeObjectURL(url);
  }


  exportToImage() {
    const diagram = this.myDiagramComponent.diagram!;
    // Generar la imagen del diagrama
    const imgData = diagram.makeImageData({
      background: "white", // Color de fondo para la imagen
      type: "image/png",    // Tipo de imagen (puede ser 'image/jpeg' también)
      // scale: 1,             // Escala de la imagen
      // maxSize: new go.Size(Infinity, Infinity), // Generar imagen completa
    });
  
    // Crear un enlace para descargar la imagen
    this.downloadImage((imgData as any));
  }
  
  // Función para descargar la imagen
  downloadImage(imageData: string) {
    const a = document.createElement('a');
    a.href = imageData;          // URL de la imagen (en formato base64)
    a.download = 'diagram.png';  // Nombre del archivo a descargar
    a.click();
  }

  invitar(tipo: string) {
    if (tipo === "correo"){
      const correo = prompt('Ingrese el correo del usurio a invitar...') || "";
      this.diagramaService.invitarByCorreo(correo, this.idDiagrama)
        .subscribe(
          (resp: any) => {
            console.log(resp);
          }
        );
      confirm("Usuario Invitado");
    } else {
      this.diagramaService.invitarQR(this.idDiagrama)
        .subscribe(
          (resp: any) => {
            console.log(resp);
            // const img = new Image();
            // img.src = resp.data;
            // document.body.appendChild(img);
            const link = document.createElement("a");
  
            // Asignar la cadena base64 como la fuente del enlace
            link.href = resp.data;

            // Definir el nombre del archivo que se descargará
            link.download = "imagen-qr.png";

            // Simular un clic en el enlace para iniciar la descarga
            link.click();
          }
        );
    }
  }
  
  generarModelo() {
    const inicio = `import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id; 
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
                
@Data
@AllArgsConstructor
@NoArgsConstructor`;

  const fin = `}`;

  const nodos = this.state.diagramNodeData;
    nodos.forEach(tabla => {
      //
    });
    const databasename = `@Entity(name = "detalles_entrada") // Nombre de la tabla en la base de datos`;

    const data3 = `public class DetalleEntrada {`;
            
    const id = `  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY) // Autoincremental para la columna id
  private Long id;`;
            
    const atributos = `  @Column(nullable = false)
  private Integer cantidad;`;
            
    const relaciones = `  @Column(nullable = false)
  private String productoId;`;
                

    const fileContent = inicio + '\n\n' +
                      databasename + '\n\n' +
                      data3 + '\n\n' +
                      id + '\n\n' +
                      atributos + '\n\n' +
                      relaciones + '\n\n' +
                      fin;

  
  }

  descargarJava(fileContent: string, name: string) {
    // Paso 3: Crear un archivo Blob
  const blob = new Blob([fileContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);

  // Paso 4: Crear un enlace para la descarga
  const link = document.createElement('a');
  link.href = url;
  link.download = name; //'DetalleEntrada.java'; // Nombre del archivo
  link.click();

  // Limpiar la URL del blob después de la descarga
  window.URL.revokeObjectURL(url);
  }

}

