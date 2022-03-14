import Konva from "konva";
import {Connector} from "../ConcreteElements/Connector";

export class TextBuilder {
  buildText(tr: Konva.Transformer) {
    let areaPosition = {
      x: tr.x() + tr.width() / 3,
      y: tr.y() - tr.height() / 4,
    };

    let arrow = <Konva.Arrow>(<Konva.Group>tr.nodes()[0]).children![0];
    console.log(arrow);

    if (arrow.points().length == 6 && arrow.fill() == "black")
      areaPosition.y -= 120;
    else if (arrow.points().length == 6 && arrow.fill() == "#7C1D1DFF")
      areaPosition.y += 120;

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
    let textX = tr.x() + arrow.width() / 2;
    let textY = tr.y() + arrow.height() / 2;

    if (arrow.points().length == 6 && arrow.fill() == "black")
      textY -= 120;
    else if (arrow.points().length == 6 && arrow.fill() == "#7C1D1DFF")
      textY += 120;

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
    connectors.get(arrowGroup.id())!.weight = (arrowText.text() == "") ? "1" : arrowText.text();
  }
}
