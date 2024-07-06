import { createUser, findUserByEmail, findUserByUsername } from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import CustomError from '../utilites/CustomError.js';

// auth controller function


const generateToken = (user) => {
  return jwt.sign(
    { id: user.userID, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

};

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!(username && email && password)) {
      throw new CustomError("Please fill all the fields", 422);
    }

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      throw new CustomError("Email already exists", 400);
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      throw new CustomError("Username already exists", 400);
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ username, email, password: encryptedPassword });
    const token = generateToken(newUser);
    newUser.token = token;
    res.status(201).json({ status: true, message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    next(error); // Pass the error to the error handler middleware
  }
};



const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      throw new CustomError("Please fill all fields", 422);
    }
    const user = await findUserByEmail(email);
    if (!user) {
      throw new CustomError("User Not Found", 401);
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError("Invalid username or password", 401);
    }
    const token = generateToken(user);
    user.password = undefined;
    user.token = token;
    res.status(200).json({ status: true, message: "Login successful", user });
  } catch (error) {
    next(error);
  }
};


const logout = async (req,res,next)=>{
  try {
    res.status(200).json({status:true,message:"Logout Success"})
  } catch (error) {
    next(error)
  }
}


export { register, login, logout };
