import Konva from "konva";

export class Update {
  updateObjects(layer: Konva.Layer, machineTargets: Map<string, any>,
                queueTargets: Map<string, any>, connectors: Map<string, any>) {
    machineTargets.forEach((machineTarget: any) => {
      let node = layer.findOne('#' + machineTarget.id);
      node.x(machineTarget.x);
      node.y(machineTarget.y);
    });
    queueTargets.forEach((queueTarget: any) => {
      if (queueTarget.id != "queue_0" && queueTarget.id != "queue_-1") {
        let node = layer.findOne('#' + queueTarget.id);
        node.x(queueTarget.x);
        node.y(queueTarget.y);
      }
    });
    connectors.forEach((connector: any) => {
      let line = <Konva.Arrow>layer.findOne('#' + connector.id);
      let fromNode = <Konva.Group>layer.findOne('#' + connector.from);
      let toNode = <Konva.Group>layer.findOne('#' + connector.to);

      const points = this.getConnectorPointsOG(
        fromNode,
        toNode,
      );
      if (line != null)
        line.points(points);
    });
  }

  getConnectorPointsOG(from: Konva.Group, to: Konva.Group) {
    const dx = to.x() - from.x();
    const dy = to.y() - from.y();
    let angle = Math.atan2(-dy, dx);

    const radius = 70;

    return [
      from.x() + -radius * Math.cos(angle + Math.PI),
      from.y() + radius * Math.sin(angle + Math.PI),
      to.x() + -radius * Math.cos(angle),
      to.y() + radius * Math.sin(angle),
    ];
  }
}
