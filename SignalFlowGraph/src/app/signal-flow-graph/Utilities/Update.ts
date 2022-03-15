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
    var flag:boolean=false;
    var flag2:boolean=false;
    let adjacencyList = new Convert().convert(connectors);
     connectors.forEach((connector: any) => {
       if(connector.from==from.id()&&connector.to==to.id())
       {
          if(connector.points.length==4)
          {
            flag==true
          }
            if(connector.points.length==6)
            {
              flag2=true
            }
       }
     })
     if(flag)
     {
      return [ 
        from.x() + -radius * Math.cos(angle + Math.PI),
        from.y() + radius * Math.sin(angle + Math.PI),
        to.x() + -radius * Math.cos(angle),
        to.y() + radius * Math.sin(angle),
      ];
     }
     if(flag2)
     {
      if ( from.x() < to.x()) {
      
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
      else if ( from.x() > to.x() ) {
   
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
     if(adjacencyList.has(to.id()) && !adjacencyList.has(from.id()))
     {
      console.log("a7at") 
       if(adjacencyList.get(to.id())?.filter((c)=>c.name==from.id())[0]!=null)
       {
        
        if ( from.x() < to.x()) {
          console.log("a7at")
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
        else if ( from.x() > to.x() ) {
            console.log("a7a")
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
  }
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
    let node2: number[] = [];
    for (let i = 0; i < nodes.length; i++)
    {
      node[i] = nodes[i].getAttr('x');
      node2[i]=nodes[i].getAttr('y');
    }

    for (let j = 0; j < node.length; j++) {
      if (node[j] > from.x() && node[j] < to.x() ) {
        if(Math.abs(node2[j]-from.y())<20 && Math.abs(node2[j]-to.y())<20 )
        {
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
      }
      else if (node[j] < from.x() && node[j] > to.x() ||(adjacencyList.has(to.id()) && !adjacencyList.has(from.id()) &&adjacencyList.get(to.id())?.filter((c)=>c.name==from.id())[0]!=null )) {
        console.log("warena")
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
    console.log("lol")
    return [ 
      from.x() + -radius * Math.cos(angle + Math.PI),
      from.y() + radius * Math.sin(angle + Math.PI),
      to.x() + -radius * Math.cos(angle),
      to.y() + radius * Math.sin(angle),
    ];
  }
}
