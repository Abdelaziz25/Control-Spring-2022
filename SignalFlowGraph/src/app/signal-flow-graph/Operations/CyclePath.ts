import {Node} from "../Elements/ConcreteElements/Node"
import { ForwardPath } from './ForwardPath';

export class CyclePath{
    private adjacencyList = new Map<string, Node[] | undefined>();
    private cyclesList:String[][];
    constructor(adjacencyList : Map<string, Node[] | undefined>){
        this.adjacencyList=adjacencyList;
        this.cyclesList=[];
    }
    getAllCyclePaths():String[][]{
        this.adjacencyList.forEach((value:Node[]|undefined,key :string)=>{
            
            var neighbourList =value as Node[];
            for(var i=0;i<neighbourList.length;i++){
                if(key===neighbourList[i].name){ //self loop
                    var cycleList = [];
                    cycleList.push(key);
                    cycleList.push(neighbourList[i].name);
                    this.cyclesList.push(cycleList);
                }else{
                    var FrwdPath=new ForwardPath(this.adjacencyList);
                    var temp:String[][];
                    temp=FrwdPath.getAllFrwdPaths(neighbourList[i].name,key); //can reach this node from its neighbour
                    for(var j=0;j<temp.length;j++){
                        var cycleList = [];
                        cycleList.push(key);
                        for(var k=0;k<temp[j].length;k++)
                            cycleList.push(temp[j][k]);
                        this.cyclesList.push(cycleList);
                    }
                }
            }
            this.adjacencyList.delete(key); //remove this key so we don't get same cycle multiple times

        });
        
        return this.cyclesList;
    }
    

}