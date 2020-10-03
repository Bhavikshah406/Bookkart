const {verifyToken} = require("../utils/token")
const usermodel = require("../models/users")

module.exports = async(req, res, next) => {
    if (req.url.includes("users")) {
      next();
    } else {
      if (req.headers.authorization) {
        let token = req.headers.authorization.split(" ")[1]; // Bearer Token
        try {
          const data = verifyToken(token);
          console.log("DECODED", data);
          if (data === null) {
            res.status(401).json({ message: "UNAUTHORIZED_REQUEST" });
          } else {
            req.user = await usermodel.findById(data)
            next();
          }
        } catch(err){
          res.status(401).json({ success:false,error:err });
        }
      } else {
        res.status(401).json({ message: "UNAUTHORIZED_REQUEST" });
      }
    }
  };