

import {API} from './API.js'
export async function customerPannel(update){

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
      await custormer_callback(callback)
    }
    
    
  
}

async function custormer_callback (callback){
  await API('answerCallbackQuery',{callback_query_id : callback.id}); // answer to callback for inline keyboard

  switch (callback.data)
  {
    case 'products':
      {
      const products_answer= API('sendMessage' , { // return this to product callback data
        chat_id : callback.message.chat.id,
        text : 'لطفا دسته مورد نظر خود را انتخاب کنید',
        reply_markup:{inline_keyboard :[
          [{text : 'موبایل' , callback_data : 'mobile'}, {text : 'لپ تاپ' , callback_data : 'laptop'}],
          [{text : 'لوازم جانبی' , callback_data : 'extra'} , {text : 'هدفون' , callback_data : 'headphone'}]
        ]}
      })
      return products_answer
      break;
      }
    case 'orders':
      {
        break;
      }
    case 'search':
      {
        break;
      }
    case 'admin_call':
      {
        break;
      }
    case 'mobile':
      {
        break;
      }
    case 'laptop' :
      {
        break;
      }
    case 'extra' : 
      {
        break;
      }
    case 'headphone':
      {
        break;
      }
  }
}


