import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

//Below there is no use of res so we can also write it as _ in production level these things are done like e.g below
//(req, _, next)
export const verifyJWT = asyncHandler(async (req, res, next)=>{
  try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
  
      if(!token){
          throw new ApiError(401, "Unauthorized Request");
      }
     
     const decodedToken = jwt.verify(token, process.env.AccessTokenSecret);
  
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
  
     if(!user){
      throw new ApiError(401, "Invalid Access Token");
     }
  
     req.user = user;
     next()
  } catch (error) {
     throw new ApiError(401, error?.message || "Invalid Access Token")
  }

})