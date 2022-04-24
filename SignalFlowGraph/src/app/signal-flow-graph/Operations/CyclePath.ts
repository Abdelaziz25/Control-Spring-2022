import {Node} from "../Elements/ConcreteElements/Node"
import { ForwardPath } from './ForwardPath';

export class CyclePath{
    private adjacencyList = new Map<string, Node[] | undefined>();
    private cyclesList:String[][];
    private gainsList:String[][];

    constructor(adjacencyList : Map<string, Node[] | undefined>){
        this.adjacencyList=adjacencyList;
        this.cyclesList=[];
        this.gainsList=[];

    }
    getAllCyclePaths():String[][]{
        this.adjacencyList.forEach((value:Node[]|undefined,key :string)=>{

            var neighbourList =value as Node[];
            for(var i=0;i<neighbourList.length;i++){
                if(key===neighbourList[i].name){ //self loop
                    var cycleList = [];
                    var gainList=[];
                    cycleList.push(key);
                    cycleList.push(neighbourList[i].name);
                    gainList.push(neighbourList[i].weight);
                    this.cyclesList.push(cycleList);
                    this.gainsList.push(gainList);
                }else{
                    var FrwdPath=new ForwardPath(this.adjacencyList);
                    var tempCycleList:String[][];
                    tempCycleList=FrwdPath.getAllFrwdPaths(neighbourList[i].name,key); //can reach this node from its neighbour
                    for(var j=0;j<tempCycleList.length;j++){
                        var cycleList = [];
                        cycleList.push(key); // add the neglected node (curr)
                        for(var k=0;k<tempCycleList[j].length;k++)
                            cycleList.push(tempCycleList[j][k]);
                        this.cyclesList.push(cycleList);
                    }
                    var tempGainList:String[][];
                    tempGainList=FrwdPath.getAllFrwdPathsGain();
                    for(var j=0;j<tempGainList.length;j++){
                        var gainList = [];
                        gainList.push(neighbourList[i].weight); // add weight of the neglected edge
                        for(var k=0;k<tempGainList[j].length;k++)
                            gainList.push(tempGainList[j][k]);
                        this.gainsList.push(gainList);
                    }
                }
            }
            this.adjacencyList.delete(key); //remove this key so we don't get same cycle multiple times

        });

        return this.cyclesList;
    }
    getAllCyclePathsGain(){
        return this.gainsList;
    }
}
