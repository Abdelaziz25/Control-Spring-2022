import {Node} from "../Elements/ConcreteElements/Node"
export class ForwardPath{
    private adjacencyList = new Map<string, Node[] | undefined>();
    private pathsList:String[][];
    private gainsList:String[][];
    constructor(adjacencyList : Map<string, Node[] | undefined>){
        this.adjacencyList=adjacencyList;
        this.pathsList=[];
        this.gainsList=[];
    }

    getAllFrwdPaths(source : string ,Destination : string):String[][]{
        var visited=new Map<string,Boolean|undefined>();
        this.adjacencyList.forEach((value:Node[]|undefined,key :string)=>{
            visited.set(key,false);
        });
        var pathList=[];
        var gainList=Array<String>();
        pathList.push(source);

        this.getAllFrwdPathsRecursive(source,Destination,visited,pathList,gainList);
        return this.pathsList;
    }

    getAllFrwdPathsGain():String[][]{
        return this.gainsList
    }

    private getAllFrwdPathsRecursive(vertex:string,Destination:string,visited:Map<string,Boolean | undefined>,pathList:any[],gainList:any[]){
        if(vertex===Destination){  //found
            const pathFound=pathList.slice();
            const gainFound=gainList.slice();
            this.gainsList.push(gainFound);
            this.pathsList.push(pathFound);
            return;
        }
        visited.set(vertex,true);
        if(this.adjacencyList.get(vertex)!=undefined){
            for(let neighbour of this.adjacencyList.get(vertex) as Node[]){
                if(!visited.get(neighbour.name) && neighbour.name!== vertex){ //avoid visited and avoid self loops
                    pathList.push(neighbour.name);
                    gainList.push(neighbour.weight);
                    this.getAllFrwdPathsRecursive(neighbour.name,Destination,visited,pathList,gainList);
                    //remove neighbour from the path
                    pathList.pop();
                    gainList.pop();
                }
            }
        }

        visited.set(vertex,false);
    }
}
