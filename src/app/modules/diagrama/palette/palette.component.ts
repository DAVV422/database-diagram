import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs'
import { PaletteComponent as Palette } from '../../gojs/palette/palette.component';

@Component({
  selector: 'app-diagrama-palette',
  templateUrl: './palette.component.html',
  styleUrl: './palette.component.css',
  encapsulation: ViewEncapsulation.ShadowDom
})
export class PaletteComponent {
  @ViewChild('myPalette', { static: true }) myPaletteDiv!: Palette;

  public state = {
    // Palette state props
    paletteNodeData: [
      { name: "Table_Name" }
    ],
    paletteModelData: { prop: 'val' }
  };

  public paletteDivClassName = 'myPaletteDiv';

  public initPalette(): go.Palette {
    const palette = new go.Palette;

    palette.nodeTemplate =
      new go.Node("Auto")
        .add(
          new go.Shape({ fill: "lightyellow" })
        )
        .add(
          new go. Panel("Table",
            { defaultRowSeparatorStroke: "black" }
          )
          .add(
            new go.TextBlock(
              {
                row: 0, columnSpan: 2, margin: 5, alignment: go.Spot.Center,
                font: "bold 8pt sans-serif",
                isMultiline: false, editable: true
              }
            )
            .bindTwoWay("text", "name")
          )

        )
      ;

    return palette;
  }
}
