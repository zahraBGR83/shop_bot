

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

    }
    
    
  
}
