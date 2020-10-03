const {Schema,model,SchemaTypes} = require("mongoose")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10;

const schema = new Schema({
    email:{
        type:SchemaTypes.String,
        required:[true,"please enter your email"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique:true
    },
    password:{
        type: SchemaTypes.String,
        required:[true,"please enter the password"]
    },
    role:{
        type:SchemaTypes.String,
        default:"user"
    },
    books:{
        type: [mongoose.Schema.ObjectId],
        ref: 'books'
    },
    refreshToken: {
        type: SchemaTypes.String,
      },
})

schema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

// Match user entered password to hashed password in database
schema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

module.exports = model("users",schema)