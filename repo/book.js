const model = require("../models/book")
const usermodel = require("../models/users")

const addbook = async (bookdata) => {
    try {
        console.log(bookdata)
        let query = await model.findOne({name:bookdata.name})
        if(query){
            throw "Book already exists , Can't add new book with same name"
        }
        query = await model.create(bookdata)
        return Promise.resolve(bookdata)
    } catch(error) {
        console.log("Error while adding book ",error)
        return Promise.reject(error)
    }
}

const updatebook = async (id,bookdata) => {
    try {
        console.log(id,bookdata)
        let query = await model.findOne({_id:id})
        if(query===null){
            throw "Book with id "+ id+ " not found"
        }
        if(query.name !== bookdata.name){
            throw "You can't change the name of the book"
        }
        query = await model.findOneAndUpdate({_id:id} ,bookdata, {
            runValidators: true,
            new: true,
          })
          return Promise.resolve(query)
    } catch(error) {
        console.log("Error while updating book details",error)
        return Promise.reject(error)
    }
}

const getbook = async (id) => {
    try {
        console.log(id)
        const query = await model.findOne({_id:id})
        if(query===null){
            throw "Book with id "+ id+ " not found"
        }
        return Promise.resolve(query)
    } catch(error) {
        console.log("Error while getting book ",error)
        return Promise.reject(error)
    }
}

const getmybooks = async (userid) => {
    try {
        console.log(userid)
        const query = await usermodel.findOne({_id:userid})
        console.log("getmybooks",query)
        if(query===null){
            throw "User with id "+ id+ " not found"
        }
        var list = []
        var i;
        for (i of query.books) {
            var x = await model.findById(i)
            list.push(x.name)
        }
        return Promise.resolve(list)
    } catch(error) {
        console.log("Error while getting user booklist ",error)
        return Promise.reject(error)
    }
}

const borrowbook = async (userid, id) => {
    try {
        console.log("User Id : ",userid)
        let userquery = await usermodel.findById({_id:userid})
        if(userquery===null){
            throw "User with id "+ userid+ " not found"
        }
        console.log(id)
        let bookquery = await model.findOne({_id:id})
        if(bookquery===null){
            throw "Book with id "+ id+ " not found"
        }
        if(userquery.books.includes(id)){
            throw "User with id "+userid+" already has the book with id "+id+" ,can't borrow again"
        }
        if(bookquery.quantity==0){
            throw bookquery.name + " is not available now ,come back later"
        }
        bookquery = await model.findOneAndUpdate({_id:id} ,{quantity:bookquery.quantity-1,name:bookquery.name}, {
            runValidators: true,
            new: true,
          })
        userquery = await usermodel.findByIdAndUpdate({_id:userid},
            {
                $push: {
                    books: id
                  }
            })
        return Promise.resolve(bookquery)
    } catch(error) {
        console.log("Error while Borrowing book ",error)
        return Promise.reject(error)
    }
}

const returnbook = async (userid, id) => {
    try {
        console.log("User Id : ",userid)
        let userquery = await usermodel.findById({_id:userid})
        if(userquery===null){
            throw "User with id "+ userid+ " not found"
        }
        console.log(id)
        let bookquery = await model.findOne({_id:id})
        if(bookquery===null){
            throw "Book with id "+ id+ " not found"
        }
        if(!userquery.books.includes(id)){
            throw "User with id "+userid+" does not have the book with id "+id+" to return"
        }
        bookquery = await model.findOneAndUpdate({_id:id} ,{quantity:bookquery.quantity+1,name:bookquery.name}, {
            runValidators: true,
            new: true,
          })
        userquery = await usermodel.findByIdAndUpdate({_id:userid},
            {
                $pull: {
                    books: id
                  }
            })
        return Promise.resolve(bookquery)
    } catch(error) {
        console.log("Error while Borrowing book ",error)
        return Promise.reject(error)
    }
}

const getallbook = async () => {
    try {
        const query = await model.find()
        if(query===null){
            throw "No Books in database"
        }
        return Promise.resolve(query)
    } catch(error) {
        console.log("Error while getting books ",error)
        return Promise.reject(error)
    }
}

const deletebook = async (id) => {
    try {
        const query = await model.findOneAndDelete({_id:id})
        if(query===null){
            throw "Book with id "+ id+ " not found"
        }
    } catch(error) {
        console.log("Error while deleting book",error)
        return Promise.reject(error)
    }
}

module.exports = {deletebook,updatebook,addbook,getallbook,getbook,borrowbook,returnbook,getmybooks}