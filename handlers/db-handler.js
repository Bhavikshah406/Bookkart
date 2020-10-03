const dbhandler = (mediator) => {
const mongoose = require('mongoose');

const mgdb = mongoose.connect(process.env.MONGO_URI,
    {useFindAndModify : false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true})

const db = mongoose.connection
db.on("error",()=>{
    mediator.emit("db.error","Error while connecting to DB")
})
db.on("open",()=>{
    mediator.emit("db.ready","DB connected")
})

}

module.exports = dbhandler;