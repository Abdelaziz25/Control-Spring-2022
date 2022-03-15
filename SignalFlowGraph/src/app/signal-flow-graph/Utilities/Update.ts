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

      let TextPoints = this.getTextPoint(arrow.points());
      let textX = TextPoints[0];
      let textY = TextPoints[1];

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

    let flag: boolean = false;
    let flag2: boolean = false;

    let adjacencyList = new Convert().convert(connectors);

    if (adjacencyList.has(from.id()) && adjacencyList.has(to.id())) {
      if (from.x() > to.x()) {
        return [
          from.x() + -radius * Math.cos(angle + Math.PI),
          from.y() + radius * Math.sin(angle + Math.PI),
          (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
          ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) + 120,
          to.x() + -radius * Math.cos(angle),
          to.y() + radius * Math.sin(angle),
          1
        ];
      }
    }

    connectors.forEach((connector: any) => {
      if (connector.from == from.id() && connector.to == to.id()) {
        if (connector.points.length == 4) {
          flag = true
        }
        if (connector.points.length == 6) {
          flag2 = true
        }
      }
    })

    if (flag) {
      return [
        from.x() + -radius * Math.cos(angle + Math.PI),
        from.y() + radius * Math.sin(angle + Math.PI),
        to.x() + -radius * Math.cos(angle),
        to.y() + radius * Math.sin(angle),
      ];
    }

    if (flag2) {
      if (from.x() < to.x()) {
        return [
          from.x() + -radius * Math.cos(angle + Math.PI),
          from.y() + radius * Math.sin(angle + Math.PI),
          (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
          ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) - 120,
          to.x() + -radius * Math.cos(angle),
          to.y() + radius * Math.sin(angle),
          0
        ];
      } else if (from.x() > to.x()) {
        return [
          from.x() + -radius * Math.cos(angle + Math.PI),
          from.y() + radius * Math.sin(angle + Math.PI),
          (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
          ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) + 120,
          to.x() + -radius * Math.cos(angle),
          to.y() + radius * Math.sin(angle),
          1
        ];
      }
    }

    if (adjacencyList.has(to.id()) && !adjacencyList.has(from.id())) {
      if (adjacencyList.get(to.id())?.filter((c) => c.name == from.id())[0] != null) {
        if (from.x() < to.x()) {
          return [
            from.x() + -radius * Math.cos(angle + Math.PI),
            from.y() + radius * Math.sin(angle + Math.PI),
            (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
            ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) - 120,
            to.x() + -radius * Math.cos(angle),
            to.y() + radius * Math.sin(angle),
            0
          ];
        } else if (from.x() > to.x()) {
          return [
            from.x() + -radius * Math.cos(angle + Math.PI),
            from.y() + radius * Math.sin(angle + Math.PI),
            (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
            ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) + 120,
            to.x() + -radius * Math.cos(angle),
            to.y() + radius * Math.sin(angle),
            1
          ];
        }
      }
    }

    let nodes = layer.find(".node");
    if (from === to) {
      return [
        from.x() + -radius * Math.cos(angle + Math.PI),
        from.y() + radius * Math.sin(angle + Math.PI),
        (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
        ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) - 70,
        to.x() + -radius * Math.cos(angle),
        to.y() + radius * Math.sin(angle),
        0
      ];
    }

    let node: number[] = [];
    let node2: number[] = [];

    for (let i = 0; i < nodes.length; i++) {
      node[i] = nodes[i].getAttr('x');
      node2[i] = nodes[i].getAttr('y');
    }

    for (let j = 0; j < node.length; j++) {
      if (node[j] > from.x() && node[j] < to.x()) {
        if (Math.abs(node2[j] - from.y()) < 20 && Math.abs(node2[j] - to.y()) < 20) {
          return [
            from.x() + -radius * Math.cos(angle + Math.PI),
            from.y() + radius * Math.sin(angle + Math.PI),
            (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
            ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) - 120,
            to.x() + -radius * Math.cos(angle),
            to.y() + radius * Math.sin(angle),
            0
          ];
        }
      } else if (node[j] < from.x() && node[j] > to.x() || (adjacencyList.has(to.id()) && !adjacencyList.has(from.id())
        && adjacencyList.get(to.id())?.filter((c) => c.name == from.id())[0] != null)) {
        return [
          from.x() + -radius * Math.cos(angle + Math.PI),
          from.y() + radius * Math.sin(angle + Math.PI),
          (from.x() + -radius * Math.cos(angle + Math.PI) + to.x() + -radius * Math.cos(angle)) / 2,
          ((from.y() + radius * Math.sin(angle + Math.PI) + to.y() + radius * Math.sin(angle)) / 2) + 120,
          to.x() + -radius * Math.cos(angle),
          to.y() + radius * Math.sin(angle),
          1
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

  getTextPoint(points: number[]): number[] {
    let textY = (points[1] + points[3]) / 2;
    let textX = (points[0] + points[2]) / 2;

    if (points.length == 6) {
      textY = points[3];
      textX = points[2];
    }

    return [textX, textY];
  }
}
