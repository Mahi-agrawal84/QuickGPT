// import express from 'express';
// import 'dotenv/config';
// import cors from 'cors';
// import connectDB from './configs/db.js';
// import userRouter from './routes/userRoutes.js';
// import chatRouter from './routes/chatRoutes.js';
// import messageRouter from './routes/messageRoutes.js';

// const app = express();

// await connectDB()

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// app.get('/', (req, res) => res.send('Server is Live!'));
// app.use('/api/user', userRouter)
// app.use('/api/chat', chatRouter)
// app.use('/api/message', messageRouter)


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`)
// });

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import chatRouter from './routes/chatRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import creditRouter from './routes/creditRoutes.js';
import { stripeWebhooks } from './controllers/webhooks.js'

const app = express();

// Stripe Webhooks
app.post('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/user', userRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);
app.use('/api/credit', creditRouter); // Add this line to include the credit routes

const PORT = process.env.PORT || 3000;

// Database connect hone ke baad hi server pipeline trigger ho
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Database status error:", err.message);
});
