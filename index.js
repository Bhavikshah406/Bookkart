//Includes
const dotenv = require("dotenv")
const dbhandler = require("./handlers/db-handler")
const mediator = require("./helpers/mediator")
const server = require("./server")

dotenv.config({path:"./config/config.env"})

mediator.once("db.ready",(data)=>{
    console.log(data)
    server
    .then((app)=>{
        app.listen(process.env.PORT||5000, (err)=>{
            if(err){
                Promise.reject("Error in starting server at "+ process.env.PORT||5000,err)
            } else {
                console.log("Server listening on "+ process.env.PORT||5000)
            }  
        })
    })
    .catch((err)=>{
        console.log(err);
        console.log("Program exiting");
        process.exit(1);
    })
})
mediator.on("db.error",(data)=>{
    console.log(data);
    console.log("Program exiting");
    process.exit(1);
})

dbhandler(mediator)