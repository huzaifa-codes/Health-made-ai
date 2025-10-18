import mongoose, { Model , Document } from "mongoose"

interface IUser extends Document {
  _id: string;   
  fullName: string;
  userName: string;
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema<IUser>({
fullName : {
    type : String,
    required : true,
},
userName : {
    type : String,
    required : true,
    unique : true
},
email : {
     type : String,
    required : true,
    unique : true
},
password : {
       type : String,
    required : true,
}
})

const User:Model<IUser> = mongoose.models.Users ||  mongoose.model<IUser>('Users' , userSchema )
export default User