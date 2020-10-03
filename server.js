const server = new Promise((res,rej)=>{
    try {
        //imports
        const express = require("express")
        const morgan = require("morgan")
        const helmet = require("helmet")
        const authMiddleware = require("./middlewares/auth-middleware")
        const mongoSanitize = require('express-mongo-sanitize');
        const xss = require('xss-clean');
        const rateLimit = require('express-rate-limit');
        const hpp = require('hpp');
        const cors = require('cors');
        const path = require('path');
        
        //Calling express app
        const app = express()

        //routes
        const bookroutes = require("./routes/book")
        const userroutes = require("./routes/users")
        
        //repo
        const bookrepo = require("./repo/book")
        const userrepo = require("./repo/users")

        //middlewares
        // Dev logging middleware
        if (process.env.NODE_ENV === 'development') {
            app.use(morgan('dev'));
        }
        app.use(helmet())
        // Sanitize data
        app.use(mongoSanitize());
        // Prevent XSS attacks
        app.use(xss());
        // Rate limiting
        const limiter = rateLimit({
        windowMs: 10 * 60 * 1000, // 10 mins
        max: 100
        });
        app.use(limiter);
        // Prevent http param pollution
        app.use(hpp());
        // Enable CORS
        app.use(cors());
        // Set static folder
        app.use(express.static(path.join(__dirname, 'public')));

        app.use(express.json())
        app.use(authMiddleware)
        
        //calling repo
        bookroutes(app,bookrepo)
        userroutes(app,userrepo)

        res(app)
    }catch(error){
        rej(error)
    }
})

module.exports = server