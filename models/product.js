import {db} from '../Database/db.js';

export async function GetProducts (){
  try{
    const productColl = db.collection('products'); // ==> collection object 

    //options 
    
      const sort = {'stock' : 1};
      const projection ={'_id':0};
    
    const resultAll =await productColl.find().sort(sort).project(projection)
    for await(const result of resultAll){
      console.log(result)
    }
    
  
  }
  catch(error){
    console.log(`error is : ${error.message}`)
  }
  
}
