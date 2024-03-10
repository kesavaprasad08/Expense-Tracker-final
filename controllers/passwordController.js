const SibApiV3Sdk = require("sib-api-v3-sdk");
require("dotenv").config();
const uuid = require('uuid');
const User = require('../models/user');
const bcrypt= require('bcrypt');
const ForgotPassword = require('../models/forgotPasswordRequests');

exports.forgotPassword = async (req, res, next) => {
  try {
    const reqEmail = req.body.email;
    const user = await User.find({email:reqEmail})

    if(user){
        const id = uuid.v4();
        const forgotPassword = new ForgotPassword({
          userId:user[0]._id,
          isActive:true,
          secret:id
        })
        const newReq = await forgotPassword.save();
        // console.log()
    let defaultClient = SibApiV3Sdk.ApiClient.instance;
    let apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey =process.env.API_KEY;

    const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = {
      email: "kesav2661998@gmail.com",
    };
    const receivers = [
      {
        email: reqEmail,
      },
    ];

    const response = tranEmailApi.sendTransacEmail({
      subject: "Reset Password Link From Expense Tracker",
      sender,
      to: receivers,

      textContent: `
    This is a text message to check the mail service`,
    htmlContent:`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
    <html lang="en">
    
      <head></head>
      <body>
      <h1>Password Reset Link</h1>
      <a href="http://localhost:3000/password/reset-password/${id}"?><button>Reset Password</button></a>      </body>
      </html>`
    });

    res.status(200).json({ message: "Reset password link is sent to your mail."});
}else{
    throw new Error("User doesn't exist.");
}
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message});
  }
};

exports.resetPassword = async(req,res,next)=>{
    try{
        const reqId = req.params.id;
        console.log(req.params.id)
        const request = await ForgotPassword.find({secret:reqId})
        console.log(request,'requset')
        if(request[0].secret===reqId){
          request[0].isActive=false;
          await request[0].save();
            res.send(`<!DOCTYPE html>
            <html lang="en">
              <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Expense Tracker</title>
                <link
                  href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
                  rel="stylesheet"
                />
              </head>
              <body>
                <header class="flex bg-teal-600 text-white h-16 items-center p-5">
                  <p class="text-lg font-semibold">Expense Tracker</p>
                </header>
                <div class="flex p-5 content-center justify-center">
                  <div class="flex flex-col lg:w-4/12 p-8 shadow-lg">
                    <form class="flex flex-col p-8" id="reset-password-form">
                      <p class="text-center text-teal-600 mb-5 text-lg font-semibold">
                        Update New Password
                      </p>
                      <label></label>
                      <input
                        type="password"
                        class="mb-5 border p-2"
                        placeholder="Enter New Password"
                        required
                        id="password"
                        name="password"
                      />
                      
                      <button
                        type="submit"
                        class="text-white bg-teal-600 p-2"
                        id="SubmitButton"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js"></script>
                <script>
                  document.getElementById('reset-password-form').addEventListener('submit',async(e) =>{
                    try{
                    e.preventDefault();
                    const password = document.getElementById('password').value;
            const obj ={
            password
            };
                        const response = await axios.post('http://localhost:3000/password/update-password/${reqId}',obj)
                        window.alert('Password has been reset please login with new Password to continue')
                        window.location.href = "/user/login";
                    }catch(e){
                        console.log(e)
                    }
                    
                  })
                </script>
              </body>
            </html>`)
        }else{
            throw new Error('Something went wrong while updating the password')
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err.message})
    }
}
exports.updatePassword = async(req,res,next)=>{
    try{
        const {password} =req.body;
        const reqId= req.params.id;

        const request = await ForgotPassword.find({secret:reqId});

        if(!request){
            throw new Error('Invalid Request');
        }
        const user = await User.findById(request[0].userId)
        if(!password){
            throw new Error('Invalid Password')
        }
        if(user){
            const saltRounds=10;
            bcrypt.hash(password,saltRounds,async(err,hash)=>{
                if(err){
                    throw new Error('Something Went wrong')
                }
                 user.password=hash;
                 user.save();
                res.status(201).json({message:'New Password Updated Successfully'})
            })
        }else{
            res.status(404).json({message:'User Not Found'})
        }
    }catch(err){
        console.log(err);
        res.status(500).json({message:err.message})
    }
}


exports.getForgotPasswordPage = async (req, res, next) => {
  try {
    res.sendFile("forgotPassword.html", { root: "views" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
