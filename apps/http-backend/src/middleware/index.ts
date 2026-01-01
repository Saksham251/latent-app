import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";

export const middleware = (...secrets:string[])=>(req: Request, res: Response, next: NextFunction)=>{
    for(const secret of secrets){
        if(req.headers.authorization){
            const tokenVerified = verifyToken(req,res,secret);
            if(tokenVerified){
                next();
                return;
            }
        }
    }
    res.status(401).json({
        message: "Unauthorized"
    });
}

export function verifyToken(req:Request,res:Response,secret:string):boolean{
    const token = req.headers.authorization;
    if(!token){
        return false;
    }
    try{
        const decoded = jwt.verify(token,secret);
        if(typeof decoded ==='string'){
            return false;
        }
    }
    catch(error){
        return false;
    }
    return true;
}