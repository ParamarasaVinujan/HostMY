const sendToken = async(user,statusCode,res)=>{
  const token = await user.getJwtToken();

  const options = {
    expires:new Date(Date.now()+process.env.Cookie_Expire_Time*24*60*60*1000), // 7 days
    httpOnly:true
  }

  res.cookie('token',token,options).status(statusCode).json({
    success:true,
    user,
    token
  })
}

module.exports = sendToken;