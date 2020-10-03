const model = require("../models/users")
const {generateToken} = require("../utils/token")
const randToken = require("rand-token")

const login = async (email,password)=>{
    try {
        if(!email || !password){
            throw "Please provide email and password"
        }
        const query = await model.findOne({email})
        if(query===null){
            throw "Email doesn't exist ,Please register first"
        }
        // Check if password matches
        const isMatch = await query.matchPassword(password);

        if (!isMatch) {
            throw "Invalid credentials";
        }
        const token = await generateToken(query.id)
        const refreshToken = randToken.uid(256);
        await model.findOneAndUpdate(
            {email},
            {refreshToken : refreshToken}
        )
        return Promise.resolve({accessToken : token ,refreshToken:refreshToken})
    } catch(error) {
        console.log("Error while login ",error)
        return Promise.reject(error);
    }
}

const register = async (email,password)=>{
    try {
        let query = await model.findOne({email})
        if(query!==null){
            throw "Email already exists ,Proceed with login"
        }
        query = await model.create({email,password})
        return Promise.resolve("You have succesfully Registered")
    } catch(error) {
        console.log("Error while Registering ",error)
        return Promise.reject(error);
    }
}

const newToken = async (email,refreshToken) => {
    try {
        if(!email && !refreshToken){
            throw "please enter email and refreshToken"
        }
        const query = await model.findOne({email})
        if(query.refreshToken !== refreshToken){
            console.log(query.refreshToken,refreshToken)
            throw "Invalid refreshToken"
        }
        const token = await generateToken(query.id)
        const newrefreshToken = randToken.uid(256);
        await model.findOneAndUpdate(
            {email},
            {refreshToken : newrefreshToken}
        )
        return Promise.resolve({accessToken : token ,refreshToken:newrefreshToken})
    } catch(error) {
        console.log("Error while generating newToken ",error)
        return Promise.reject(error);
    }
}

const getMe = async (email,password)=>{
    try {
        let query = await model.findOne({email})
        if(query!==null){
            throw "Email already exists ,Proceed with login"
        }
        query = await model.create({email,password})
        return Promise.resolve("You have succesfully Registered")
    } catch(error) {
        console.log("Error while Registering ",error)
        return Promise.reject(error);
    }
}

module.exports = {login,register,newToken}
