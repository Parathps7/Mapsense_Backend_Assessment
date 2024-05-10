const asyncHandler = require("express-async-handler")
require('dotenv').config();
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const jwt =  require('jsonwebtoken')
const User = require('../models/userModel')
const {authRSchema,authLSchema,fpassword,rpassword} = require('../models/validateSchema');
const { details } = require("@hapi/joi/lib/errors");
const randomstring = require('randomstring');



//send email function
const sendresetemail = async(name,email,token) => {
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
             user: process.env.EMAIL_USER,
             pass: process.env.EMAIL_PASSWORD,
            },
            from: process.env.EMAIL_USER
           });

        const mailOptions = {
            from : process.env.EMAIL_USER,
            to: email,
            subject: "For Reset Password",
            html: `<p>Hi ${name}, Please copy the <a href="http://localhost:${process.env.PORT}/api/users/reset-password/${token}">link</a> to reset your password</p>`
        }

        transporter.sendMail(mailOptions,function(error,infor){
            if(error){
                // console.log(error)
            }
            else{
                console.log("Message has been sent!",info.response);
            }
        })
    }
    catch(e){
        res.status(400).send({success: false,msg: e.message});
    }
}


//@desc register a user
//@route POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req,res)=>{
    try
    {
        const result = await authRSchema.validateAsync(req.body);
        const userAvailable = await User.findOne({email: result.email});
        if(userAvailable){
            res.status(400).send({success:false,"message":"user already registered"});
            return new Error({details:[{"message":"user already registered"}]})
        }
        //hash password
        const hashedPassword = await bcrypt.hash((result.password),10)
        const user = await User.create({
            username: result.username,
            email: result.email,
            password: hashedPassword
        });
        if(user){
            res.status(201).json({_id: user.id,email:user.email});
        }else{
            res.status(400);
            throw new Error("User data not valid")
        }
    }
    catch(error)
    {
        res.status(422).send({success:false,"message":error.details[0].message});
    }
});


//@desc login a user
//@route POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req,res)=>{
    try
    {
        const result = await authLSchema.validateAsync(req.body);
        const user = await User.findOne({email:result.email});
        //compare password with hashed passowrd
        if(user!==null){
            const verify_password = await bcrypt.compare(result.password,user.password);
            if(verify_password){
                const accessToken = jwt.sign({
                user:{
                    username: user.username,
                    email:user.email,
                    id: user.id
                }
            },process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '15m'});
            res.status(200).json({success:true,"accesstoken":accessToken})
            }
            else
            {
                res.status(401).send({"success":false,"message":"Password invalid"});
            }
        }
        else{
            res.status(401).send({"success":false,"message":"user not found,please register"});
        }
    }
    catch(error)
    {
        res.status(400).send(error.details);
    }
    // res.json({message: "login user"})
});


//@desc current user info
//@route GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user);
});


//@desc forget password
//@route POST /api/users/forget-password
//@access private
const forgetpassword = asyncHandler(async(req,res) => {
    try
    {
        const result = await fpassword.validateAsync(req.body);
        const userData = await User.findOne({email:result.email});
        if( !userData )
        {
            res.status(404);
            throw new Error("No given email found!");
        }
        const Token = jwt.sign({id: userData._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn: "1d"});
        const data = await User.updateOne({email:result.email},{$set:{token: Token}});
        sendresetemail(userData.name,userData.email,Token);
        // We are sending token in response here only for testing pupose ,in real world scenerio tokend is sent via email only
        res.status(200).send({token:Token,success:true,msg:`Reset email sent to ${result.email}.Please check Inbox!.Make POST request with "password"=<new_password> in body`})
    }
    catch(error)
    {
        res.status(400).send(error.details);
    }
});


//@desc reset password
//@route POST /api/users/forget-password/:token
//@access private
const resetpassword = asyncHandler(async(req,res) => {
    try
    {
        const result = await rpassword.validateAsync(req.body);
        const token = req.params.token;
        // console.log(result.password)
        const userData =await User.findOne({token});
        if(!userData){
            res.status(401).send({msg:"Link expired!"})
            throw new Error("Link expired")
        }
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,async (err,decoded) => {
            if( err )res.status(401).send({msg:"Error with token!"})
            else{
                const hashedPassword = await bcrypt.hash(result.password,10);
                const data = await User.updateOne({token:token},{$set:{password: hashedPassword}});
                if( !data ){
                    res.status(400).send({msg:"Not updated!!Try again!"})
                }
                else{
                    res.status(200).send({msg:"Password was successfully updated!"})
                    // To change token in database so that someone can't reuse jwt token to reset password again before it expires 
                    const randToken = randomstring.generate();
                    await User.updateOne({password:hashedPassword},{$set:{token: randToken}});
                }
            }
        })
    }
    catch(error)
    {
        res.status(400).send(error.details);
    }
});

module.exports = {registerUser,loginUser,currentUser,forgetpassword,resetpassword};