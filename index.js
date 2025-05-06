const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const db = require('./config/db'); // Ensure this file is properly set up

dotenv.config(); // Load environment variables

const app = express();

app.use(express.json()); // Enables JSON request body parsing
app.use(cors()); // Enables cross-origin requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/*RUN*/
//node index.js
