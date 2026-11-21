import {InsertProduct} from './models/product.js'
import {connectDB} from './Database/db.js'
import dotenv from 'dotenv'
dotenv.config()
const TOKEN=process.env.TOKEN;
const address=`https://tapi.bale.ai/bot${TOKEN}`;
let offset = 0;
const adminState = new Map();

//_______________base function for methods____________
async function API (method , body ={}){
  const response = await fetch (`${address}/${method}`,{
    method : "POST",
    headers : {'Content-Type':'application/json'},
    body : JSON.stringify(body)
  })
  if(!response.ok){
    throw new Error(`Http Error : ${response.status}`)
  }
  return response.json()
}

async function customerPannel(update){

    const msg = update.message;
    const callback = update.callback_query;

    if(msg)
    {
    if(typeof(msg.text) === 'string')
      {
        switch(msg.text)
        {
          case '/start':
          {
            const res_start = await API ('sendMessage',{
              chat_id : msg.chat.id,
              text : `سلام _${msg.from.first_name}_ ، به فروشگاه ما خوش آمدید`,
              reply_markup :{
                inline_keyboard :[
                  [{ text : 'سفارش های من' , callback_data : 'orders'},{text : 'مشاهده محصولات' , callback_data :'products'}],
                  [{ text : 'ارتباط با مدیر' , callback_data : 'admin_call'},{text : 'جست‌وجوی محصول' , callback_data : 'search'}]
                ]
              }
            })
            console.log(res_start)
            break;
          }
          case 'سلام':
            {
              const res_hi = await API ('sendMessage',{
                chat_id : msg.chat.id,
                text : `سلام *${msg.from.first_name}* `,
              })
              console.log(res_hi)
              break;
            }
        }
      }
    }
    if(callback)
    {

    }
    
    
  
}

async function adminPannel(update){

    const msg = update.message;
    const callback = update.callback_query;

    if(msg)
    {
      await adminMessage(msg)
    }
    else if (callback)
    {
      await adminCallback(callback)
    }
  }

  async function admin_photo (chat_id)
  {
    const result_photo = await API('sendMessage' , {
              chat_id : chat_id,
              text : 'تصویر محصول مورد نظر را وارد کنید ؟',
              reply_markup:{
                inline_keyboard:[[
                  {text : 'رد کردن' , callback_data : 'skip_photo'} 
                ]]
              }
            })
            return result_photo
  }

  async function admin_confirm (chat_id)
  {
    const result_map_confirm = adminState.get(chat_id)// => object
    const product = result_map_confirm.product;
    const text = `
    نام : ${product.name}\n
    قیمت : ${product.price}\n
    دسته : ${product.categories}\n
    آیا محصول اضافه شود ؟ 
    `;
    const keyboard= {inline_keyboard : 
      [[{text : 'بله' , callback_data : 'ok'} , {text : 'خیر', callback_data : 'no'}]]}
    
    if(product.photo)
    {
     const send_photo_confirm =await API('sendPhoto',
      {
        chat_id : chat_id,
        photo : product.photo,
        caption : text,
        reply_markup : keyboard
      }
     ) 
     return send_photo_confirm
    }
    else 
    {
      const send_message_confirm = await API('sendMessage',{
        chat_id : chat_id,
        text : text,
        reply_markup:keyboard
      })
      return send_message_confirm
    }
  }

  async function adminMessage (msg){ // => update.message
  const text = msg.text;
  const photo = msg.photo;
  const result_map = adminState.get(msg.chat.id); // object

  if (photo)
  {
    if(adminState.has(msg.chat.id) && result_map.step === 'awaiting_photo' )
      {
        const largest = msg.photo[msg.photo.length -1];
        result_map.product.photo = largest.file_id;
        result_map.step = 'awaiting_confirm'
        await admin_confirm(msg.chat.id)

            return;
      }
      if (adminState.has(msg.chat.id))
      {
        const result_error_sendphoto = await API('sendMessage' , {
          chat_id : msg.chat.id,
          text : 'لطفا طبق دستور العمل پیش بروید'
        })
        return;
      }

  }// end of photo 
  else if (text)
  {
    if(adminState.has(msg.chat.id))
    {
      
      switch(result_map.step)
      {
        case 'awaiting_name':
              {
                result_map.step = 'awaiting_price';
                result_map.product.name = `${msg.text}`
                const result_addPrice = await API('sendMessage',
                {
                 chat_id : msg.chat.id,
                 text :'لطفا قیمت محصول را وارد کنید'
                })
                console.log(result_addPrice);
                break;
              }

              case 'awaiting_price':
              {
                
                const price = Number(msg.text)
                if(!Number.isNaN(price) && price >= 0){
                  result_map.step = 'awaiting_categories'
                  result_map.product.price = price
                  const result_addctegories = await API('sendMessage',{
                  chat_id : msg.chat.id,
                  text : 'لطفا دسته بندی مورد نظر خود را وارد کنید',
                  reply_markup:{
                    inline_keyboard:[
                      [{text : 'موبایل', callback_data : 'phone'},{text : 'لپ تاپ', callback_data : 'laptop'}],
                      [{text : 'لوازم جانبی', callback_data : 'extra'},{text : 'هدفون', callback_data : 'headphone'}],
                    ]
                  }
                })
                console.log(result_addctegories)
                }
                else{
                  console.log('invalid pirce')
                  const result_error_price = await API('sendMessage' , {
                    chat_id : msg.chat.id,
                    text : 'لطفا قیمت صحیح را وارد کنید'
                  })
                }
                
                break;
                
              }
      }
    }
    else 
      {
       
        
        switch(msg.text)
        {
          case '/start':
          {
            const res_start = await API ('sendMessage',{
              chat_id : msg.chat.id,
              text:`مدیریت فروشگاه`,
              reply_markup:{
                inline_keyboard:[
                  [{text : 'افزودن محصول',callback_data:'add_product'}],
                  [{text : 'ویرایش محصولات',callback_data:'edit_product'}],
                  [{text : 'حذف محصول',callback_data:'delete_product'}],
                  [{text : 'مشاهده سفارش‌ها',callback_data:'orders'}],
                  [{text : 'تغییر وضعیت سفارش ‌ ',callback_data:'change_status_order'}],
                ]
              }
            })
            console.log(res_start)
            break;
          }

          case 'سلام':
          {
            const res_hi = await API('sendMessage',{
              chat_id: msg.chat.id,
              text :`سلام مدیر :${msg.from.first_name}`
            })
            console.log(res_hi)
            break;
          }
        }
      }

    
  }//end of text 
}
async function adminCallback (callback){
      await API('answerCallbackQuery' , {callback_query_id : callback.id})
      const chat_id = callback.message.chat.id;
      if(adminState.has(chat_id)) // Wizard
      {
        const result_map_callback = adminState.get(chat_id) // object
        switch(result_map_callback.step)
        {
          case 'awaiting_categories':
            {
          const valid = ['phone', 'laptop', 'extra', 'headphone']
          if (valid.includes(callback.data))
          {
          result_map_callback.product.categories = callback.data
          result_map_callback.step = 'awaiting_photo'
          await admin_photo(chat_id)
          }
          break;
            }
          case 'awaiting_confirm':
              {
                switch(callback.data)
                {
                  case 'ok':
                    {
                      
                      const save = await InsertProduct(result_map_callback.product)
                      console.log(`save product :`, result_map_callback.product)
                      await API('sendMessage',{
                        chat_id : chat_id,
                        text :`محصول${result_map_callback.product.name} با موفقیت در پایگاه داده ذخیره شد`
                      })
                      adminState.delete(chat_id)
                     break; 
                    }
                    case 'no':
                      {
                        await API('sendMessage',{
                        chat_id : chat_id,
                        text :'لغو شد !'
                      })
                      
                        break;
                      }
                    
                }
                adminState.delete(chat_id)
                break;
                
            }
          case 'awaiting_photo':
            {
              if(callback.data === 'skip_photo'){
              result_map_callback.step = 'awaiting_confirm';
              result_map_callback.product.photo = null
              await admin_confirm(chat_id)
              }
              

            break;
            }
        }
        
        
      }
  
  else
  {
          switch(callback.data)
      {
        case 'add_product':
          {
           adminState.set(chat_id , {
            step : 'awaiting_name',
            product:{}
           })
           const result_addProduct = await API('sendMessage', {
            chat_id : chat_id,
            text : 'لطفا نام محصول را وارد کنید'
           })
           console.log(result_addProduct)
           break;  
          }
        case 'edit_product':
          {
           break;  
          }
        case 'delete_product':
          {
           break;  
          }
        case 'orders':
          {
           break;  
          }
        case 'change_status_order':
          {
           break;  
          }
          
          
      }
  }

}




const admin = Number(process.env.ADMIN)
async function main (){


  while(true){
    try{
      await connectDB();
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