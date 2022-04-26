import {Component, HostListener, OnInit} from '@angular/core';
import {
  faPlay,
  faCogs,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import Konva from "konva";
import {NodeBuilder} from './Elements/ElementBuilder/NodeBuilder';
import {ConnectorBuilder} from './Elements/ElementBuilder/ConnectorBuilder';
import {Target} from "./Elements/ConcreteElements/Target";
import {Connector} from "./Elements/ConcreteElements/Connector";
import {SelectorTools} from "./Utilities/SelectorTools";
import {Update} from "./Utilities/Update";
import {Convert} from "./Utilities/Convert";
import {TextBuilder} from "./Elements/ElementBuilder/TextBuilder";
import {ForwardPath} from './Operations/ForwardPath';
import {CyclePath} from './Operations/CyclePath';
import {LoopsNonTouching} from "./Operations/LoopsNonTouching";
import {FinalExpression} from "./Operations/FinalExpression";


@Component({
  selector: 'app-signal-flow-graph',
  templateUrl: './signal-flow-graph.component.html',
  styleUrls: ['./signal-flow-graph.component.css']
})
export class SignalFlowGraphComponent implements OnInit {
  SelectorTools: SelectorTools = new SelectorTools();
  Update: Update = new Update();
  NodeBuilder: NodeBuilder = new NodeBuilder();
  ConnectorBuilder: ConnectorBuilder = new ConnectorBuilder();
  TextBuilder: TextBuilder = new TextBuilder();
  input: string = '1';
  result: string = "";

  faPlay = faPlay;
  faLink = faLink;
  faCogs = faCogs;

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  tr!: Konva.Transformer;

  machineTargets: any = new Map<string, any>();
  machines: any = new Map<string, any>();
  connectors: any = new Map<string, Connector>();

  machineID: number = 0;
  connectorID: number = 0;

  constructor() {
  }

  @HostListener('window:keydown.Delete', ['$event']) del() {
    this.delete();
  }

  @HostListener('window:keydown.m', ['$event']) m() {
    this.buildMachine();
  }

  @HostListener('window:keydown.c', ['$event']) c() {
    this.connect();
  }

  ngOnInit(): void {
    this.stage = new Konva.Stage({
      container: 'canvas',
      width: window.innerWidth,
      height: window.innerHeight
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
    this.tr = new Konva.Transformer({
      nodes: [],
      ignoreStroke: false,
      padding: 5,
      resizeEnabled: false,
      rotateEnabled: false,
      enabledAnchors: [],
    });
    this.layer.add(this.tr);
    this.loadLayout();
  }

  loadLayout() {
    this.buildMachine("in", window.screenLeft + 100, 400);
    this.buildMachine("out", window.screen.availWidth - 100, 400);
  }

  generateTargets(shape: Konva.Group, ID: number, targets: Map<string, any>) {
    targets.set(
      'y_' + (ID + 1),
      new Target("node", "y_" + (ID + 1), shape.x(), shape.y())
    );
  }

  generateConnectors(arrow: Konva.Arrow, fromShape: Konva.Group, toShape: Konva.Group, weight: string = "1") {
    let from = fromShape.id();
    let to = toShape.id();

    this.connectors.set(
      'connector_' + (this.connectorID + 1),
      new Connector('connector_' + (this.connectorID + 1), from, to, weight, arrow.points())
    );
  }

  updateGain(key: string = '') {
    if (this.tr.nodes().length != 1)
      return;

    let connector = <Konva.Group>this.tr.nodes()[0];

    if (this.tr.nodes()[0].name() == 'connector' && key == '')
      this.input = (this.connectors.get(connector.id()).weight != "") ?
        this.connectors.get(connector.id()).weight : "1";

    else if (this.tr.nodes()[0].name() == 'connector') {
      let connectorGroup = <Konva.Group>this.stage.find("#" + connector.id())[0];
      this.connectors.get(connector.id()).weight = this.input;
      let text = <Konva.Text>connectorGroup.children![1];

      text.text(this.input);
    }
  }

  updateObjects() {
    this.Update.updateObjects(this.layer, this.machineTargets, this.connectors);
  }

  delete() {
    let selectedShapes = this.tr.nodes();
    for (let selectedShape of selectedShapes) {
      if (this.machines.has(selectedShape.id())) {
        this.machines.delete(selectedShape.id());
        this.machineTargets.delete(selectedShape.id());
      } else if (this.connectors.has(selectedShape.id())) {
        this.connectors.delete(selectedShape.id());
        this.layer.findOne('#' + selectedShape.id()).destroy();
      }
      selectedShape.destroy();
    }
    this.tr.nodes([]);
  }

  SelectorType() {
    this.stage.on("click", () => {
      if (document.getElementById("input") == null)
        return;
      let arrowGroup = <Konva.Group>this.tr.nodes()[0];
      let textBox = <HTMLInputElement>document.getElementById("input");
      this.TextBuilder.constructText(this.tr, arrowGroup, textBox, this.connectors);

      textBox!.remove();
    });

    this.stage.on("dragend", () => {
      let selectedShapes = this.tr.nodes();
      for (let selectedShape of selectedShapes) {
        if (this.machineTargets.has(selectedShape.id())) this.SelectorTools.iterate(this.machineTargets, selectedShape);
      }
      this.updateObjects();
    });

    this.SelectorTools.boxSelect(this.stage, this.tr, this.layer);
    this.SelectorTools.clickSelect(this.stage, this.tr);
    this.updateGain();
  }

  addShape(konvaShape: Konva.Group) {
    this.layer.add(konvaShape);
    this.stage.add(this.layer);
  }

  buildMachine(name: string = "", x: number = 0, y: number = 0) {
    let IDsString = this.machines.keys();
    console.log(this.machines);
    let IDs = [];

    for (let string of IDsString) {
      if (!string.includes("_"))
        continue;
      IDs.push(parseInt(string.split("_")[1]));
    }
    if (IDs.length != 0) this.machineID = Math.max(...IDs);
    if (!this.machineID) this.machineID = 0;
    console.log(this.machineID);

    let machine;
    if (name == "") {
      machine = this.NodeBuilder.buildNode(this.machineID);
      this.machines.set("y_" + (this.machineID + 1), machine);
    } else {
      machine = this.NodeBuilder.buildNode(this.machineID, name, x, y);
      this.machines.set(name, machine);
    }

    this.addShape(machine);
    this.generateTargets(machine, this.machineID, this.machineTargets);
  }

  connect() {
    let IDsString = this.connectors.keys();
    let IDs = [];

    for (let string of IDsString) {
      IDs.push(parseInt(string.split("_")[1]));
    }
    if (IDs.length != 0) this.connectorID = Math.max(...IDs);

    let first: Konva.Group, second: Konva.Group, points, connectorFound = false;
    let machines = this.tr.nodes().filter((machine) => machine.name() === "node");

    if (machines.length > 2) return;

    first = <Konva.Group>machines[0];
    second = <Konva.Group>machines[1];
    if (machines.length == 1)
      second = <Konva.Group>machines[0];

    this.connectors.forEach((connector: any) => {
      if (connector.from == first.id() && connector.to == second.id())
        connectorFound = true;
    })
    if (connectorFound) return;

    points = this.Update.getConnectorPointsOG(<Konva.Group>first, <Konva.Group>second, this.layer, this.connectors);

    let arrowGroup = this.ConnectorBuilder.buildConnector(points, this.connectorID);

    this.layer.add(arrowGroup);
    this.stage.add(this.layer);

    this.generateConnectors(<Konva.Arrow>arrowGroup.children![0], <Konva.Group>first, <Konva.Group>second);
    this.updateObjects();
    this.readGain(arrowGroup);
  }

  readGain(arrowGroup: Konva.Group) {
    this.TextBuilder.read(this.tr, arrowGroup, this.connectors);
  }

  convert() {
    let ob = new Convert();
    let forwardPath = new ForwardPath(ob.convert(this.connectors));
    let cyclePath = new CyclePath(ob.convert(this.connectors));
    console.log(ob.convert(this.connectors));

    let forwardPaths = forwardPath.getAllFrwdPaths('in', 'out');
    let forwardPathsGain = forwardPath.getAllFrwdPathsGain();
    let cyclePaths = cyclePath.getAllCyclePaths();
    let cyclePathsGain = cyclePath.getAllCyclePathsGain();

    this.result += "Forward paths\n";
    let i = 1;
    forwardPaths.forEach((forwardPath) => {
      this.result += "\tP" + i++ + ": ";
      forwardPath.forEach((node) => {
        this.result += node;
        if (forwardPath[forwardPath.length - 1] != node)
          this.result += " --> ";
      });
      this.result += "\n";
    });
    console.log(this.result);

    this.result += "Forward paths gain\n";

    i = 1;
    forwardPathsGain.forEach((forwardPathGain) => {
      this.result += "\tP" + i++ + " Gain: ";
      forwardPathGain.forEach((gain) => {
        this.result += gain;
      });
      this.result += "\n";
    });

    this.result += "Cycles\n";
    i = 1;
    cyclePaths.forEach((cyclePath) => {
      this.result += "\t\u0394" + i++ + ": ";
      cyclePath.forEach((node, idx) => {
        this.result += node;
        if (cyclePath.length - 1 != idx)
          this.result += " --> ";
      });
      this.result += "\n";
    });

    this.result += "Cycles gain\n";

    i = 1;
    cyclePathsGain.forEach((cyclePathGain) => {
      this.result += "\t\u0394" + i++ + " Gain: ";
      cyclePathGain.forEach((gain) => {
        this.result += gain;
      });
      this.result += "\n";
    });

    let expression = new FinalExpression(forwardPaths, forwardPathsGain, cyclePaths, cyclePathsGain);

    console.log(expression.denominator);
    console.log(expression.numerator);
  }

  calc() {
    this.result = "";
    this.convert();
  }
}
