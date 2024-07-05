import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import configCloudinary from './utils/Cloudinary.js'
import cors from "cors"
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import CustomError from './utils/CustomError.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
configCloudinary()
// i want to add cors
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/api', blogRoutes);
app.use('/api', commentRoutes);

// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   res.status(statusCode).json({
//       message: err.message,
//       statusCode
//   });
// });

app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
      statusCode: 500
    });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
