import {DefaultDirector} from "../../ShapeCreator/Director/DefaultDirector";
import Konva from "konva";

export class NodeBuilder {
  DefaultDirector: DefaultDirector = new DefaultDirector();

  public buildNode(machineID: number, name: string = "y", x: number = 200, y: number = 200) {
    this.DefaultDirector.constructCircle();

    let machine = new Konva.Group({
      id: (name == "y") ? name + '_' + (machineID + 1) : name,
      x: x,
      y: y,
      draggable: (name == "y"),
      name: "node"
    });

    let konvaShape = <Konva.Circle>this.DefaultDirector.GetKonva();

    machine.add(konvaShape);

    machine.add(new Konva.Text({
      text: (name == "y") ? name.toUpperCase() + (machineID + 1) : name.toUpperCase(),
      fontSize: 18,
      fontFamily: 'Calibri',
      fontStyle: 'bold',
      fill: '#fff',
      offsetX: (name == "out") ? 17 : 10,
      offsetY: 10,
      align: 'center'
    }));

    return machine;
  }
}
