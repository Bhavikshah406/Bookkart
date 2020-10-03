const jwt = require("jsonwebtoken")

const generateToken = (id)=>{
    return new Promise((res,rej)=>{
        jwt.sign({id:id}, process.env.SECRET_KEY, { expiresIn: 10*60 },
            function(err, token) {
                if(err){
                    console.log("Error in generating token",err)
                    rej(err)
                }else{
                    console.log(token);
                    res(token)
                }
            });
        })
}

const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return decoded.id;
    } catch (err) {
      return null;
    }
  };

module.exports = {generateToken,verifyToken}