import { dbConnect } from "@/lib/dbConnect"
import User from "@/models/User"
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import tokenVerify from "@/utils/token";

export async function POST(req : Request){
 try {
    await dbConnect()
     const {fullName , userName , email , password} = await req.json()
  if(!fullName || !userName || !email || !password){
  return  NextResponse.json({message : 'All field are required '})
  }
  if(password.length < 8){
    return  NextResponse.json({message : 'password must be altleast 8 letters'})
  } 

const Uname = await User.findOne({ userName });
if(Uname){
      return NextResponse.json({ error: "UserName already exists" }, { status: 400 });
}

const Uemail = await User.findOne({ email });
if (Uemail) {
  return NextResponse.json({ error: "Email already exists" }, { status: 400 });
}
 
const hashPasword = await bcrypt.hash(password  , 10)

const userData = await User.create({
    fullName,
    userName,
    email,
    password : hashPasword
})

const token =  tokenVerify(userData._id.toString());

const { password: _, ...userWithoutPassword } = userData.toObject();
const response = NextResponse.json({
  status: 201,
  message: "User registered successfully",
  data: userWithoutPassword
});

response.cookies.set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60,
  path: "/",
});
return response;


 } catch (error) {
    NextResponse.json({status : 404 , message : error},)
 }


}
