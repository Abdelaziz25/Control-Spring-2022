import Konva from "konva";
import {Connector} from "../Elements/ConcreteElements/Connector";
import {Convert} from "./Convert";

export class Update {
  connectors: any = new Map<string, Connector>();
  updateObjects(layer: Konva.Layer, machineTargets: Map<string, any>, connectors: Map<string, any>) {
    machineTargets.forEach((machineTarget: any) => {
      let node = layer.findOne('#' + machineTarget.id);
      node.x(machineTarget.x);
      node.y(machineTarget.y);
    });
    connectors.forEach((connector: any) => {
      let line = <Konva.Group>layer.findOne('#' + connector.id);
      let arrow = <Konva.Arrow>line.children![0];
      let text = <Konva.Text>line.children![1];
      let fromNode = <Konva.Group>layer.findOne('#' + connector.from);
      let toNode = <Konva.Group>layer.findOne('#' + connector.to);

      let textX = arrow!.getSelfRect().x + arrow!.width() / 2
      let textY = arrow!.getSelfRect().y + arrow!.height() / 2;

      if (arrow.points().length == 6 && arrow.fill() == "black")
        textY -= 120;
      else if (arrow.points().length == 6 && arrow.fill() == "#7C1D1DFF")
        textY += 120;

      const points = this.getConnectorPointsOG(
        fromNode,
        toNode,
        layer,
        connectors,
      );

      if (arrow != null)
        arrow.points(points.slice(0, 6));
      if (text != null) {
        text.x(textX);
        text.y(textY);
      }
    });
  }

  getConnectorPointsOG(from: Konva.Group, to: Konva.Group, layer: Konva.Layer, connectors: Map<string, Connector>) {
    const dx = to.x() - from.x();
    const dy = to.y() - from.y();
    let angle = Math.atan2(-dy, dx);
    const radius = 25;

    let adjacencyList = new Convert().convert(connectors);

    let nodes = layer.find(".node");

    if (from === to) {
      let color = 0;
      return [
        from.x() + -radius * Math.cos(angle + Math.PI),
        from.y() + radius * Math.sin(angle + Math.PI),
        (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
        ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) - 70,
        to.x() + -radius * Math.cos(angle),
        to.y() + radius * Math.sin(angle),
        color
      ];
    }

    let node: number[] = [];
    for (let i = 0; i < nodes.length; i++)
      node[i] = nodes[i].getAttr('x');

    console.log(from.x())
    console.log(node)
    for (let j = 0; j < node.length; j++) {
      if (node[j] > from.x() && node[j] < to.x()) {
        let color = 0;
        return [
          from.x() + -radius * Math.cos(angle + Math.PI),
          from.y() + radius * Math.sin(angle + Math.PI),
          (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
          ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) - 120,
          to.x() + -radius * Math.cos(angle),
          to.y() + radius * Math.sin(angle),
          color
        ];
      }

      else if (node[j] < from.x() && node[j] > to.x()) {
        let color = 1;
        return [
          from.x() + -radius * Math.cos(angle + Math.PI),
          from.y() + radius * Math.sin(angle + Math.PI),
          (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
          ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) + 120,
          to.x() + -radius * Math.cos(angle),
          to.y() + radius * Math.sin(angle),
          color
        ];
      }
    }

    return [
      from.x() + -radius * Math.cos(angle + Math.PI),
      from.y() + radius * Math.sin(angle + Math.PI),
      to.x() + -radius * Math.cos(angle),
      to.y() + radius * Math.sin(angle),
    ];
  }
}
