import dotenv from 'dotenv'
import {connectDB} from '../Database/db.js'
import {API} from './API.js'
import { customerPannel } from './customer.js'
import {adminPannel} from '../bot_customer.js'
dotenv.config()
const TOKEN=process.env.TOKEN;
const address=`https://tapi.bale.ai/bot${TOKEN}`;
let offset = 0;
const admin = Number(process.env.ADMIN)
async function main (){

  await connectDB();
  while(true){
    try{
      
      const Updates = await API('getUpdates',{offset : offset , timeout :30})
      for(const update of Updates.result){
        offset = update.update_id + 1
        try
        {
          const chatId = update.message?.chat.id ?? update.callback_query?.message?.chat.id
        if(chatId === admin){
          await adminPannel(update);
        
          
        }
        else{
          await customerPannel(update);
        }
        }
        catch(error)
        {
          console.error(`Error processing update ${update.update_id} :` , error.message)
        }
      
        
      }
    }
    catch(error){
      console.log(error.message)
    }
  }
}

main()