import {connectDB} from './Database/db.js';
import { GetProducts } from './models/product.js';

async function main (){
  try
  {
    await connectDB();
    await GetProducts()
  }
  catch(error)
  {
    console.log(`error is ${error.message}`)
  }
}

main()