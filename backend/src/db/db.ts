import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const mongoseURI:string=process.env.MONGOURI || 'mongodb://localhost:27017/Todo'

const connect=(()=>{
    mongoose.connect(mongoseURI)
    .then(()=> console.log('mongoDb Connected'))
    .catch((err)=> console.log(`Error:${err}`))
})