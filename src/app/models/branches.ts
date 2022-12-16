import { Branch } from './branch';
import { BranchData } from './branchData';
export class Branches{
   static readonly branches:BranchData[] = [
        {
            "type":"Clothes and Shoes",
            "id":1,
            "data":{
                "name":"Name",
                "model":"Model",
                "size":"Size",
                "color":"Color"
            }        
        },
        {
            "type":"Electronics",
            "id":2,
            "data":{
                "name":"New Name",
                "model":"New Model",
                "size":"New Size",
                "color":"New Color"
            }        
        }    

    ]


    static getBranchData(num:number):BranchData{
        console.log("num " ,num);
        var temp:BranchData;
        Branches.branches.forEach((ele)=>{
            console.log("ele : ",ele);
            console.log("ele : ",ele.id);
            if(ele.id===num){
                console.log("they are equal ",ele)
                temp = ele;
                // return ele;
            }
        })

        return temp;
    }
}