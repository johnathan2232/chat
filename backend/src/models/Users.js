import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, 
        required: true,
        unique: true
    },
    fullName: {type: String, 
        required: true,
    },
    password: {type: String, 
        required: true,
        minLength: 5
    },
    profilePic: {type: String, 
        default: ""
    }
}, {timestamps: true}); //created at and updated at
const User = mongoose.model("User", userSchema);
//create a user model based off the schema and export it so we can use it in other parts of our application,
// such as in our controllers to create new users or find existing users in the database.

export default User;