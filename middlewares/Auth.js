
// import { findUserByID } from "../models/userModel.js";
import { findUserByID } from "../models/userModel.js";
import CustomError from "../utils/CustomError.js";
import jwt from "jsonwebtoken";
export const Auth = async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new CustomError("Unauthorized access", 401);
      }
  
      const jwtSecret = process.env.JWT_SECRET;
      let decodedToken;
  
      try {
        decodedToken = jwt.verify(token, jwtSecret);
      } catch (err) {
        if (err.name === "TokenExpiredError") {
          throw new CustomError("Token expired", 401);
        } else {
          throw new CustomError("Invalid token", 401);
        }
      }
  
      if (!decodedToken) {
        throw new CustomError("Unauthorized access", 401);
      }
  
      const isUser = await findUserByID(decodedToken.id);
      if (!isUser) {
        throw new CustomError("Unauthorized access", 401);
      }
  
      req.user = isUser;
      req.token = token
      return next();
    } catch (error) {
      next(error);
    }
  };