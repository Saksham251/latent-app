import twilio from "twilio"

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export async function sendMessage(body:string,to:string) {
  try{
    const message = await client.messages.create({
      body,
      from: "+17014092792",
      to,
    });
    console.log(message.body);
  }
  catch(error){
    console.log(error);
    throw new Error("error whlie sending otp")
  }
  
}