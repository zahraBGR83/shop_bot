import {db} from '../Database/db.js';




export async function GetProducts (){
  const productColl = db.collection('products'); // ==> collection object
  try{
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


export async function InsertProduct (product)
{
  const productColl = db.collection('products'); // ==> collection object
  const doc = 
  {
    name : product.name,
    price : product.price ,
    categories : product.categories,
    photo : product.photo ?? null,
    createTime : new Date()
  }

  const inserted_data = await productColl.insertOne(doc)
  console.log(inserted_data.insertedId)
  return inserted_data

}