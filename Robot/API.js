import dotenv from 'dotenv'
dotenv.config()
const TOKEN=process.env.TOKEN;
const address=`https://tapi.bale.ai/bot${TOKEN}`;

//_______________base function for methods____________

export async function API (method , body ={}){
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