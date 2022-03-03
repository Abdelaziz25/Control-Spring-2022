import Konva from "konva";
import Shape = Konva.Shape;

export class SelectorTools {
  x1: number = 0;
  x2: number = 0;
  y1: number = 0;
  y2: number = 0;

  selectionShape: Shape = new Konva.Rect({
    fill: 'rgba(255, 255, 255, 0.5)',
    visible: false,
    globalCompositeOperation: "source-over",
  });

  clickSelect(stage: Konva.Stage, tr: Konva.Transformer) {
    stage.on('click', (e) => {
      // if we are selecting with rect, do nothing
      if (this.selectionShape.visible()) return;


      // if click on empty area - remove all selections
      if (e.target === stage) {
        tr.nodes([]);
        return;
      }

      if (e.target.hasName('connector')) {
        // do we pressed shift or ctrl?
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(e.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          tr.nodes([e.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = tr.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(e.target), 1);
          tr.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = tr.nodes().concat([e.target]);
          tr.nodes(nodes);
        }
      }

      // do nothing if clicked NOT on our rectangles
      if (!e.target.parent!.hasName('machine') && !e.target.parent!.hasName('queue')) {
        return;
      }

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = tr.nodes().indexOf(e.target.parent!) >= 0;

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        tr.nodes([e.target.parent!]);
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const nodes = tr.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        nodes.splice(nodes.indexOf(e.target.parent!), 1);
        tr.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = tr.nodes().concat([e.target.parent!]);
        tr.nodes(nodes);
      }
    });
  }

  boxSelect(stage: Konva.Stage, tr: Konva.Transformer, layer: Konva.Layer) {
    layer.add(this.selectionShape);
    stage.on('mousedown', (e) => {
      if (e.target !== stage) return;
      e.evt.preventDefault();

      this.x1 = stage.getPointerPosition()!.x;
      this.y1 = stage.getPointerPosition()!.y;
      this.x2 = stage.getPointerPosition()!.x;
      this.y2 = stage.getPointerPosition()!.y;

      this.selectionShape.visible(true);
      this.selectionShape.width(0);
      this.selectionShape.height(0);
    });

    stage.on('mousemove', (e) => {
      if (!this.selectionShape.visible()) return;
      e.evt.preventDefault();

      this.x2 = stage.getPointerPosition()!.x;
      this.y2 = stage.getPointerPosition()!.y;

      this.selectionShape.setAttrs({
        x: Math.min(this.x1, this.x2),
        y: Math.min(this.y1, this.y2),
        width: Math.abs(this.x2 - this.x1),
        height: Math.abs(this.y2 - this.y1),
      });
    });

    stage.on('mouseup', (e) => {
      if (!this.selectionShape.visible()) return;
      e.evt.preventDefault();

      setTimeout(() => {
        this.selectionShape.visible(false);
      });

      let shapes = [];
      for (let findElement of stage.find(".machine")) {
        shapes.push(findElement);
      }
      for (let findElement of stage.find(".queue")) {
        shapes.push(findElement);
      }
      let selectionArea = this.selectionShape.getClientRect();
      let selectedShapes = shapes.filter((shape) =>
        Konva.Util.haveIntersection(selectionArea, shape.getClientRect())
      );
      tr.nodes(selectedShapes);
      this.selectionShape.remove();
    });
  }

  iterate(targets: Map<string, any>, selectedShape: Konva.Node) {
    let target = targets.get(selectedShape.id());
    if (Math.abs(target.x - Math.round(selectedShape.x())) > 0.1 ||
      Math.abs(target.y - Math.round(selectedShape.y())) > 0.1) {
    } else return;
    target.x = Math.round(selectedShape.x());
    target.y = Math.round(selectedShape.y());
  }
}
