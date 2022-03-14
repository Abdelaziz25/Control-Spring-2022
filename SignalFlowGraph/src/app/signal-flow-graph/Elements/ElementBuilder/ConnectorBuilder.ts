import Konva from "konva";

export class ConnectorBuilder {
  buildConnector(points: number[], connectorID: number) {
    let arrow = new Konva.Arrow({
      id: 'connector_' + (connectorID + 1),
      points: points,
      pointerLength: 10,
      tension:0.7,
      pointerWidth: 10,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4,
      name: "connector",
    });

    let arrowGroup = new Konva.Group({
      id: 'connector_' + (connectorID + 1),
      name: "connectorGroup",
    });
    arrowGroup.add(arrow);
    return arrowGroup;
  }
}
