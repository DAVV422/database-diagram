import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { produce } from "immer";
import * as go from 'gojs'

import { DataSyncService } from '../../gojs/service/data-sync.service';
import { DiagramComponent } from '../../gojs/diagram/diagram.component';

@Component({
  selector: 'app-diagram-diagrama',
  templateUrl: './diagrama.component.html',
  styleUrl: './diagrama.component.css',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class DiagramaComponent implements AfterViewInit {
  @ViewChild('myDiagram', { static: true }) public myDiagramComponent!: DiagramComponent;
  public state = {
    // Diagram state props
    diagramNodeData: [
      {
        key: 1,
        name: "BankAccount",
        attributes: [
          { name: "owner", type: "String", visibility: "public" },
          { name: "balance", type: "Currency", visibility: "public", default: "0" }
        ]
      },
      {
        key: 11,
        name: "Person",
        attributes: [
          { name: "name", type: "String", visibility: "public" },
          { name: "birth", type: "Date", visibility: "protected" }
        ]
      },
      {
        key: 12,
        name: "Student",
        attributes: [
          { name: "classes", type: "List<Course>", visibility: "public" }
        ]
      },
      {
        key: 13,
        name: "Professor",
        attributes: [
          { name: "classes", type: "List<Course>", visibility: "public" }
        ]
      },
      {
        key: 14,
        name: "Course",
        attributes: [
          { name: "name", type: "String", visibility: "public" },
          { name: "description", type: "String", visibility: "public" },
          { name: "professor", type: "Professor", visibility: "public" },
          { name: "location", type: "String", visibility: "public" },
          { name: "times", type: "List<Time>", visibility: "public" },
          { name: "prerequisites", type: "List<Course>", visibility: "public" },
          { name: "students", type: "List<Student>", visibility: "public" }
        ]
      }
    ],
    diagramLinkData: [
      { from: 12, to: 11, text: "", toText: "" },
      { from: 13, to: 11, text: "", toText: "" },
      { from: 14, to: 13, relationship: "Association", text: "0..N", toText: "1" }
    ],
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
        layout: new go.TreeLayout(
          {
            // this only lays out in trees nodes connected by "generalization" links
            angle: 90,
            path: go.TreeLayout.PathSource,  // links go from child to parent
            setsPortSpot: false,  // keep Spot.AllSides for link connection spot
            setsChildPortSpot: false,  // keep Spot.AllSides
            // nodes not connected by "generalization" links are laid out horizontally
            arrangement: go.TreeLayout.ArrangementHorizontal
          }
        ),

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
      )
      // property default value, if any
      .add(
        new go.TextBlock({ isMultiline: false, editable: true })
        .bind("text", "type", s => s ? " = " + s : "")
      );

    // define the Node template
    diagram.nodeTemplate =
      new go.Node('Auto', // the whole node panel
        {
          // fromLinkable: true,
          // toLinkable: true,
          locationSpot: go.Spot.Center,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides
        })
        .add(
          new go.Shape({ fill: "lightyellow" }),
          new go.Panel('Table',
            {
              defaultRowSeparatorStroke: "black"
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
        );

        const linkStyle = () => {
          return {
            isTreeLink: false,
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
              new go.Shape("RoundedRectangle", {fill: "#f7f9fc"})
              .setProperties({stroke: "#eeeeee"})
            )
            //the "from" label
            .add(
              new go.TextBlock(
                {
                  textAlign: "center",
                  font: "bold 12px sans-serif",
                  // stroke: "black",
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
          .add(
            new go.Shape({ toArrow: "Triangle", fill: "white" })
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
          .add(
            new go.Shape({ toArrow: "OpenTriangle" })
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
          .add(
            new go.Shape({ toArrow: "OpenTriangle" })
          )
        )

    return diagram;
  }

  // When the diagram model changes, update app data to reflect those changes. Be sure to use immer's "produce" function to preserve immutability
  public diagramModelChange = (changes: go.IncrementalData) => {
    console.log("modelChange")
    if (!(changes) || (this.state.skipsDiagramUpdate)) return;
    const appComp: DiagramaComponent = this;
    this.state = produce(this.state, draft => {
      draft.skipsDiagramUpdate = true;
      (draft.diagramNodeData as any) = DataSyncService.syncNodeData(changes, draft.diagramNodeData, appComp.observedDiagram?.model);
      (draft.diagramLinkData as any) = DataSyncService.syncLinkData(changes, draft.diagramLinkData, (appComp.observedDiagram as any).model);
      (draft.diagramModelData as any) = DataSyncService.syncModelData(changes, draft.diagramModelData);
      // If one of the modified nodes was the selected node used by the inspector, update the inspector selectedNodeData object
      const modifiedNodeDatas = changes.modifiedNodeData;
      if (modifiedNodeDatas && draft.selectedNodeData && modifiedNodeDatas === draft.selectedNodeData ) {
        for (let i = 0; i < modifiedNodeDatas.length; i++) {
          const mn = modifiedNodeDatas[i];
          const nodeKeyProperty = appComp.myDiagramComponent.diagram!.model.nodeKeyProperty as string;
          if (mn[nodeKeyProperty] === (draft.selectedNodeData as go.ObjectData)[nodeKeyProperty]) {
            (draft.selectedNodeData as any) = mn;
          }
        }
      }
    });
  };

  constructor(private cdr: ChangeDetectorRef) { }

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
      if( this.state.skipsDiagramUpdate ){
        console.log(this.state.skipsDiagramUpdate)
        this.state = produce(this.state, draft => {
          draft.skipsDiagramUpdate = false;
        });
        console.log(this.state.skipsDiagramUpdate)
        return;
      }
      if (e.diagram.selection.count === 0) {
        appComp.selectedNodeData = null;
      }
      const node = e.diagram.selection.first();
      appComp.state = produce(appComp.state, (draft: any) => {        
        if (node instanceof go.Node) {
          var idx = draft.diagramNodeData.findIndex((nd: any) => nd.key == node.data.key);
          var nd = draft.diagramNodeData[idx];
          draft.selectedNodeData = nd;
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
      let data = draft.selectedNodeData;
      data[path] = value;
      const key = data.key;
      const idx = draft.diagramNodeData.findIndex((nd: any) => nd.key == key);
      if (idx >= 0) {
        draft.diagramNodeData[idx] = data;
        draft.skipsDiagramUpdate = false; // we need to sync GoJS data with this new app state, so do not skips Diagram update
      }
    });
  }

  // Guarda el estado del diagrama en un archivo JSON
  saveStateToFile(): void {
    // this.jsonFileService.saveToFile(this.state, 'diagramState.json');
  }

  loadJson(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          this.state = JSON.parse(result);
          // Aquí puedes realizar acciones adicionales, como actualizar el diagrama con el nuevo estado
        }
      };

      fileReader.readAsText(file);
    }
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

  public undo() {
    console.log("Undo")
    this.myDiagramComponent.diagram!.commandHandler.undo();
  }
}

// const UnsavedFileName = '(Unsaved File)';

// export function getCurrentFileName(): string {
//   const currentFile = document.getElementById('currentFile') as HTMLDivElement;
//   const name = currentFile.textContent || '';
//   if (name && name[name.length - 1] === '*') return name.slice(0, -1);
//   return name;
// }

// export function setCurrentFileName(name: string) {
//   const currentFile = document.getElementById('currentFile') as HTMLDivElement;
//   if (diagram.isModified) {
//     name += '*';
//   }
//   currentFile.textContent = name;
// }

// export function newDocument() {
//   // checks to see if all changes have been saved
//   if (diagram.isModified) {
//     const save = confirm('Would you like to save changes to ' + getCurrentFileName() + '?');
//     if (save) {
//       saveDocument();
//     }
//   }
//   setCurrentFileName(UnsavedFileName);
//   // loads an empty diagram
//   diagram.model = new go.GraphLinksModel();
//   resetModel();
// }

// export function resetModel() {
//   diagram.model.undoManager.isEnabled = true;
//   (diagram.model as go.GraphLinksModel).linkFromPortIdProperty = 'fromPort';
//   (diagram.model as go.GraphLinksModel).linkToPortIdProperty = 'toPort';

//   diagram.model.copiesArrays = true;
//   diagram.model.copiesArrayObjects = true;
//   diagram.isModified = false;
// }

// export function checkLocalStorage() {
//   return (typeof (Storage) !== 'undefined') && (window.localStorage !== undefined);
// }

// // saves the current floor plan to local storage
// export function saveDocument() {
//   if (checkLocalStorage()) {
//     const saveName = getCurrentFileName();
//     if (saveName === UnsavedFileName) {
//       saveDocumentAs();
//     } else {
//       // saveDiagramProperties();
//       window.localStorage.setItem(saveName, diagram.model.toJson());
//       diagram.isModified = false;
//     }
//   }
// }

// // saves floor plan to local storage with a new name
// export function saveDocumentAs() {
//   if (checkLocalStorage()) {
//     const saveName = prompt('Save file as...') || getCurrentFileName();
//     if (saveName && saveName !== UnsavedFileName) {
//       setCurrentFileName(saveName);
//       // saveDiagramProperties();
//       window.localStorage.setItem(saveName, diagram.model.toJson());
//       diagram.isModified = false;
//     }
//   }
// }

// // checks to see if all changes have been saved -> shows the open HTML element
// export function openDocument() {
//   if (checkLocalStorage()) {
//     if (diagram.isModified) {
//       const save = confirm('Would you like to save changes to ' + getCurrentFileName() + '?');
//       if (save) {
//         saveDocument();
//       }
//     }
//     openElement('openDocument', 'mySavedFiles');
//   }
// }

// // shows the remove HTML element
// export function removeDocument() {
//   if (checkLocalStorage()) {
//     openElement('removeDocument', 'mySavedFiles2');
//   }
// }

// // these functions are called when panel buttons are clicked

// export function loadFile() {
//   const listbox = document.getElementById('mySavedFiles') as any;
//   // get selected filename
//   let fileName;
//   for (let i = 0; i < listbox.options.length; i++) {
//     if (listbox.options[i].selected) fileName = listbox.options[i].text; // selected file
//   }
//   if (fileName !== undefined) {
//     // changes the text of "currentFile" to be the same as the floor plan now loaded
//     setCurrentFileName(fileName);
//     // actually load the model from the JSON format string
//     const savedFile = window.localStorage.getItem(fileName) || '';
//     diagram.model = go.Model.fromJson(savedFile);
//     // loadDiagramProperties();
//     diagram.model.undoManager.isEnabled = true;
//     diagram.isModified = false;
//     // eventually loadDiagramProperties will be called to finish
//     // restoring shared saved model/diagram properties
//   }
//   closeElement('openDocument');
// }

// // export function loadJSON(file: string) {
// //   jQuery.getJSON(file, function (jsondata: string) {
// //     // set these kinds of Diagram properties after initialization, not now
// //     diagram.addDiagramListener('InitialLayoutCompleted', loadDiagramProperties);  // defined below
// //     // create the model from the data in the JavaScript object parsed from JSON text
// //     // myDiagram.model = new go.GraphLinksModel(jsondata["nodes"], jsondata["links"]);
// //     diagram.model = go.Model.fromJson(jsondata);
// //     loadDiagramProperties();
// //     diagram.model.undoManager.isEnabled = true;
// //     diagram.isModified = false;
// //   });
// // }

// // Store shared model state in the Model.modelData property
// // (will be loaded by loadDiagramProperties)
// // export function saveDiagramProperties() {
// //   diagram.model.modelData.position = go.Point.stringify(diagram.position);
// // }

// // Called by loadFile and loadJSON.
// // export function loadDiagramProperties(e?: go.DiagramEvent) {
// //   // set Diagram.initialPosition, not Diagram.position, to handle initialization side-effects
// //   const pos = diagram.model.modelData.position;
// //   if (pos) diagram.initialPosition = go.Point.parse(pos);
// // }


// // deletes the selected file from local storage
// export function removeFile() {
//   const listbox = document.getElementById('mySavedFiles2') as any;
//   if (listbox === null) return;
//   // get selected filename
//   let fileName;
//   for (let i = 0; i < listbox.options.length; i++) {
//     if (listbox.options[i].selected) fileName = listbox.options[i].text; // selected file
//   }
//   if (fileName !== undefined) {
//     // removes file from local storage
//     window.localStorage.removeItem(fileName);
//     // the current document remains open, even if its storage was deleted
//   }
//   closeElement('removeDocument');
// }

// export function updateFileList(id: string) {
//   // displays cached floor plan files in the listboxes
//   const listbox = document.getElementById(id) as any;
//   if (listbox === null) return;
//   // remove any old listing of files
//   let last;
//   while (last = listbox.lastChild) listbox.removeChild(last);
//   // now add all saved files to the listbox
//   for (const key in window.localStorage) {
//     const storedFile = window.localStorage.getItem(key);
//     if (!storedFile) continue;
//     const option = document.createElement('option');
//     option.value = key;
//     option.text = key;
//     listbox.add(option, null);
//   }
// }

// export function openElement(id: string, listid: string) {
//   const panel = document.getElementById(id);
//   if (panel !== null && panel.style.visibility === 'hidden') {
//     updateFileList(listid);
//     panel.style.visibility = 'visible';
//   }
// }

// // hides the open/remove elements when the "cancel" button is pressed
// export function closeElement(id: string) {
//   const panel = document.getElementById(id);
//   if (panel !== null && panel.style.visibility === 'visible') {
//     panel.style.visibility = 'hidden';
//   }
// }

// export function undo() { diagram.commandHandler.undo(); }
// export function redo() { diagram.commandHandler.redo(); }
// export function cutSelection() { diagram.commandHandler.cutSelection(); }
// export function copySelection() { diagram.commandHandler.copySelection(); }
// export function pasteSelection() { diagram.commandHandler.pasteSelection(); }
// export function deleteSelection() { diagram.commandHandler.deleteSelection(); }
// export function selectAll() { diagram.commandHandler.selectAll(); }
// // export function basicOrderProcess() { loadJSON('BPMNdata/BasicOrderProcess.json'); }
// export function cancel1() { closeElement('openDocument'); }
// export function cancel2() { closeElement('removeDocument'); }