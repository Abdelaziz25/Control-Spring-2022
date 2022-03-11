import Konva from "konva";

export class Update {
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

      const points = this.getConnectorPointsOG(
        fromNode,
        toNode,
      );
      if (arrow != null)
        arrow.points(points);
      if (text != null) {
        text.x(arrow!.getSelfRect().x + arrow!.width() / 2);
        text.y(arrow!.getSelfRect().y + arrow!.height() / 2);
      }
    });
  }

  getConnectorPointsOG(from: Konva.Group, to: Konva.Group) {
    const dx = to.x() - from.x();
    const dy = to.y() - from.y();
    let angle = Math.atan2(-dy, dx);

    const radius = 30;

    return [
      from.x() + -radius * Math.cos(angle + Math.PI),
      from.y() + radius * Math.sin(angle + Math.PI),
      to.x() + -radius * Math.cos(angle),
      to.y() + radius * Math.sin(angle),
    ];
  }
}
