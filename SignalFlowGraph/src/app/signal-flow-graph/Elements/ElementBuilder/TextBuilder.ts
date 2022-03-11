import Konva from "konva";
import {Connector} from "../ConcreteElements/Connector";

export class TextBuilder {
  buildText(tr: Konva.Transformer) {
    let areaPosition = {
      x: tr.x() + tr.width() / 3,
      y: tr.y() - tr.height() / 4,
    };

    let text = document.createElement("input");
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

    textBox.addEventListener('keypress', (ev => {
      let enter = true;
      let arrow = arrowGroup.children![0];
      tr.nodes([arrowGroup]);

      if (ev.key !== 'Enter' || !enter)
        return;

      textBox.style.visibility = 'hidden';
      let arrowText = new Konva.Text({
        text: textBox.value,
        fontSize: 18,
        fontFamily: 'Calibri',
        fontStyle: 'bold',
        x: tr.x() + arrow.width() / 2,
        y: tr.y() + arrow.height() / 2,
        fill: '#fff',
        align: 'center'
      });

      arrowGroup.add(arrowText);
      connectors.get(arrowGroup.id())!.weight = arrowText.text();
    }));
  }
}
