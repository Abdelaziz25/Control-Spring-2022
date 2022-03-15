import {Connector} from "../Elements/ConcreteElements/Connector";
import {Node} from "../Elements/ConcreteElements/Node"

export class Convert {
  convert(graph: Map<string, Connector>) {
    let adjacencyList = new Map<string, Node[] | undefined>();

    graph.forEach((connector: Connector) => {
      let from = connector.from;
      let to = connector.to;
      let weight = connector.weight;
      let nodes : Node[] | undefined = [];
      if (adjacencyList.get(from) != undefined) {
        nodes = adjacencyList.get(from);
      }

      let node = new Node(to, weight);
      nodes!.push(node);
      adjacencyList.set(from, nodes);
    });

    return adjacencyList;
  }
}
