import Konva from "konva";
import {Connector} from "../ConcreteElements/Connector";
import {Update} from "../../Utilities/Update";

export class TextBuilder {
  buildText(tr: Konva.Transformer) {
    let arrow = <Konva.Arrow>(<Konva.Group>tr.nodes()[0]).children![0];

    let areaPosition = {
      x: 0,
      y: 0,
    };

    if (arrow.points().length == 6) {
      areaPosition.y = arrow.points()[3];
      areaPosition.x = arrow.points()[2];
    } else {
      areaPosition.y = (arrow.points()[1] + arrow.points()[3]) / 2;
      areaPosition.x = (arrow.points()[0] + arrow.points()[2]) / 2;
    }

    let text = document.createElement("input");
    text.id = "input";
    text.style.position = 'absolute';
    text.style.top = areaPosition.y + 'px';
    text.style.left = areaPosition.x + 'px';
    text.style.width = "80px";
    text.style.height = "40px";
    text.style.opacity = "0.2";
    text.style.fontSize = "20px";
    text.style.color = "#070101";
    text.style.textAlign = "center";
    document.body.appendChild(text);
    return text;
  }

  read(tr: Konva.Transformer, arrowGroup: Konva.Group, connectors: Map<string, Connector>) {
    tr.nodes([arrowGroup]);
    let textBox = this.buildText(tr);
    tr.nodes([arrowGroup]);

    textBox.addEventListener('keypress', (ev => {
      if (ev.key !== 'Enter')
        return;

      this.constructText(tr, arrowGroup, textBox, connectors);
      textBox.remove();
    }));
  }

  constructText(tr: Konva.Transformer, arrowGroup: Konva.Group,
                textBox: HTMLInputElement, connectors: Map<string, Connector>) {
    let arrow = <Konva.Arrow>arrowGroup.children![0];

    let TextPoints = new Update().getTextPoint(arrow.points());
    let textX = TextPoints[0];
    let textY = TextPoints[1];

    textBox.style.visibility = 'hidden';
    let arrowText = new Konva.Text({
      text: textBox.value,
      fontSize: 18,
      fontFamily: 'Calibri',
      fontStyle: 'bold',
      x: textX,
      y: textY,
      fill: '#fff',
      align: 'center'
    });

    arrowGroup.add(arrowText);
    if (arrowText.text() == "")
      arrowText.text("1")
    connectors.get(arrowGroup.id())!.weight = (arrowText.text() == "") ? "1" : arrowText.text();
  }
}
