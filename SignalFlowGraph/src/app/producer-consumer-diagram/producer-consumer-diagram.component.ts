import {Component, HostListener, OnInit} from '@angular/core';
import {
  faFileUpload,
  faRedoAlt,
  faMousePointer,
  faPlay,
  faCogs,
  faListOl,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import Konva from "konva";
import {DefaultDirector} from './ShapeCreator/Director/DefaultDirector';
import {Target} from "./Elements/Target";
import {Connector} from "./Elements/Connector";
import {SelectorTools} from "./SelectorTools";
import {Update} from "./Update";

@Component({
  selector: 'app-producer-consumer-diagram',
  templateUrl: './producer-consumer-diagram.component.html',
  styleUrls: ['./producer-consumer-diagram.component.css']
})
export class ProducerConsumerDiagramComponent implements OnInit {
  SelectorTools: SelectorTools = new SelectorTools();
  Update: Update = new Update();
  DefaultDirector: DefaultDirector = new DefaultDirector();
  input: number = 0;
  productsNum: number = 0;
  order: number = 0;
  products: any = [];

  faPlay = faPlay;
  faLink = faLink;
  faCogs = faCogs;
  faListOl = faListOl;
  faUpload = faFileUpload;
  faRedoAlt = faRedoAlt;
  faMousePointer = faMousePointer;

  stage!: Konva.Stage;
  layer!: Konva.Layer;
  tr!: Konva.Transformer;

  machineTargets: any = new Map<string, any>();
  queueTargets: any = new Map<string, any>();
  queues: any = new Map<string, any>();
  machines: any = new Map<string, any>();
  connectors: any = new Map<string, any>();

  machineID: number = 0;
  queueID: number = 0;
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

  updateInput() {
    this.productsNum = this.input;
  }

  generateTargets(shape: Konva.Group, name: string, ID: number, targets: Map<string, any>) {
    targets.set(
      name + '_' + (ID + 1),
      new Target(name, name + '_' + (ID + 1), shape.x(), shape.y())
    );
  }

  generateConnectors(arrow: Konva.Arrow, fromShape: Konva.Group, toShape: Konva.Group) {
    let from = fromShape.id();
    let to = toShape.id();
    if (from === to) {
      return;
    }
    this.connectors.set(
      'connector_' + (this.connectorID + 1),
      new Connector('connector_' + (this.connectorID + 1), from, to, arrow.points(),)
    );
  }

  updateObjects() {
    this.Update.updateObjects(this.layer, this.machineTargets, this.queueTargets, this.connectors);
  }

  delete() {
    let selectedShapes = this.tr.nodes();
    for (let selectedShape of selectedShapes) {
      if (selectedShape.id() == "queue_0" || selectedShape.id() == "queue_-1") return;
      if (this.queues.has(selectedShape.id())) {
        this.queues.delete(selectedShape.id());
        this.queueTargets.delete(selectedShape.id());
      } else if (this.machines.has(selectedShape.id())) {
        this.machines.delete(selectedShape.id());
        this.machineTargets.delete(selectedShape.id());
      } else if (this.connectors.has(selectedShape.id())) {
        this.connectors.delete(selectedShape.id());
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
        if (this.queueTargets.has(selectedShape.id())) this.SelectorTools.iterate(this.queueTargets, selectedShape);
      }
      this.updateObjects();
    });
    this.SelectorTools.boxSelect(this.stage, this.tr, this.layer);
    this.SelectorTools.clickSelect(this.stage, this.tr);
  }

  addShape(konvaShape: Konva.Group) {
    this.layer.add(konvaShape);
    this.stage.add(this.layer);
  }

  buildMachine() {
    let IDsString = this.machines.keys();
    let IDs = [];

    this.DefaultDirector.constructCircle();

    for (let string of IDsString) {
      IDs.push(parseInt(string.split("_")[1]));
    }
    if (IDs.length != 0) this.machineID = Math.max(...IDs);

    let machine = new Konva.Group({
      id: "machine" + '_' + (this.machineID + 1),
      x: 200,
      y: 200,
      draggable: true,
      name: "machine"
    });

    let konvaShape = <Konva.Circle>this.DefaultDirector.GetKonva();

    machine.add(konvaShape);

    machine.add(new Konva.Text({
      text: "M" + (this.machineID + 1) + "\n" + "Available",
      fontSize: 18,
      fontFamily: 'Calibri',
      fontStyle: 'bold',
      fill: '#fff',
      offsetX: 33,
      offsetY: 20,
      align: 'center'
    }));

    this.machines.set("machine_" + (this.machineID + 1), machine);

    this.addShape(machine);
    this.generateTargets(machine, "machine", this.machineID, this.machineTargets);
  }

  connect() {
    let IDsString = this.connectors.keys();
    let IDs = [];

    for (let string of IDsString) {
      IDs.push(parseInt(string.split("_")[1]));
    }
    if (IDs.length != 0) this.connectorID = Math.max(...IDs);

    let first, second, points;
    let machines = this.tr.nodes().filter((machine) => machine.name() === "machine");

    if (machines.length > 2) return;

    first = machines[0];
    second = machines[1];

    points = this.Update.getConnectorPointsOG(<Konva.Group>first, <Konva.Group>second);

    let arrow = new Konva.Arrow({
      points: points,
      pointerLength: 10,
      pointerWidth: 10,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4,
      name: "connector",
    });
    this.layer.add(arrow);
    this.stage.add(this.layer);
    arrow.id('connector_' + (this.connectorID + 1));
    this.generateConnectors(arrow, <Konva.Group>first, <Konva.Group>second);
    this.updateObjects();
  }
}
