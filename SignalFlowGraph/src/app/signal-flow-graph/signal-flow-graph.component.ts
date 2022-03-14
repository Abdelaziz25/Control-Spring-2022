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
    if (from === to) {
      return;
    }
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
      this.input = this.connectors.get(connector.id()).weight;

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

  buildMachine() {
    let IDsString = this.machines.keys();
    let IDs = [];

    for (let string of IDsString) {
      IDs.push(parseInt(string.split("_")[1]));
    }
    if (IDs.length != 0) this.machineID = Math.max(...IDs);

    let machine = this.NodeBuilder.buildNode(this.machineID);
    this.machines.set("y_" + (this.machineID + 1), machine);

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

    let first, second, points;
    let machines = this.tr.nodes().filter((machine) => machine.name() === "node");

    if (machines.length > 2) return;

    first = machines[0];
    second = machines[1];

    points = this.Update.getConnectorPointsOG(<Konva.Group>first, <Konva.Group>second, this.layer);

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
    console.log(ob.convert(this.connectors));
  }

  calc() {
    this.convert();
  }
}
