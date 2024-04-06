const { verifyToken } = require("../services/Auth");

function checkEntry(cookieName){
  return(req,res,next)=>{
    const tokenCookieValue= req.cookies[cookieName];
    if(!tokenCookieValue){
        return next();
    }

   try {
    const userValidate= verifyToken(tokenCookieValue);
   req.user = userValidate;
   
   } catch (error) {}
   return next();
    
  };
}

module.exports={
    checkEntry,
};