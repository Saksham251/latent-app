export function getRandomNumber(length:number){
    let result="";
    const number = "0123456789";
    for(let i=0;i<length;i++){
        result+=number.charAt(Math.floor(Math.random()*10));
    }
    return result;
}