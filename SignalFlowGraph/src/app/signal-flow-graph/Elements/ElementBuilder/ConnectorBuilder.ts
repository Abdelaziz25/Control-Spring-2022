import Konva from "konva";

export class ConnectorBuilder {
  buildConnector(points: number[], connectorID: number) {
    let color = "black";
    if (points.length == 7) {
      color = (points[6] == 1) ? '#7C1D1DFF' : 'black';
      points = points.slice(0, 6);
      console.log(color);
    }

    let arrow = new Konva.Arrow({
      id: 'connector_' + (connectorID + 1),
      points: points,
      pointerLength: 10,
      pointerWidth: 10,
      tension: 0.7,
      fill: color,
      stroke: color,
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
