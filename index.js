const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const athleteRoutes = require('./routes/athletesRoutes');
const championshipRoutes = require('./routes/championshipRoutes');
const poomsaeRoutes = require('./routes/poomsaeRoutes');
const poomsaeEntryRoutes = require('./routes/poomsaeEntryRoutes');
const tatamiRoutes = require('./routes/tatamiRoutes');


const db = require('./config/db'); // Ensure this file is properly set up

dotenv.config(); // Load environment variables

const app = express();


// Aumentar o limite do tamanho do corpo da requisição
app.use(express.json({ limit: '1000mb' })); // Ajuste o limite conforme necessário
app.use(express.urlencoded({ limit: '1000mb', extended: true }));

app.use(express.json()); // Enables JSON request body parsing
app.use(cors()); // Enables cross-origin requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', athleteRoutes);
app.use('/api', championshipRoutes);
app.use('/api', poomsaeRoutes);
app.use('/api', poomsaeEntryRoutes);
app.use('/api', tatamiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/*RUN*/
//node index.js
