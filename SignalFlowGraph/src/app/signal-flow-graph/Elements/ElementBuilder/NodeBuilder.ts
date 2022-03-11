import {DefaultDirector} from "../../ShapeCreator/Director/DefaultDirector";
import Konva from "konva";

export class NodeBuilder {
  DefaultDirector: DefaultDirector = new DefaultDirector();

  public buildNode(machineID: number) {
    this.DefaultDirector.constructCircle();

    let machine = new Konva.Group({
      id: "y" + '_' + (machineID + 1),
      x: 200,
      y: 200,
      draggable: true,
      name: "node"
    });

    let konvaShape = <Konva.Circle>this.DefaultDirector.GetKonva();

    machine.add(konvaShape);

    machine.add(new Konva.Text({
      text: "Y" + (machineID + 1),
      fontSize: 18,
      fontFamily: 'Calibri',
      fontStyle: 'bold',
      fill: '#fff',
      offsetX: 10,
      offsetY: 10,
      align: 'center'
    }));

    return machine;
  }
}
