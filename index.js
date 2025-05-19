const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/usersRoutes');
const athleteRoutes = require('./routes/athletesRoutes');
const championshipRoutes = require('./routes/championshipRoutes');
const poomsaeRoutes = require('./routes/poomsaeRoutes');
const poomsaeEntryRoutes = require('./routes/poomsaeEntryRoutes');
const tatamiRoutes = require('./routes/tatamiRoutes');

dotenv.config();

const app = express();

app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ limit: '1000mb', extended: true }));
app.use(cors());

// Configuração do Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Taekwondo Management API',
            version: '1.0.0',
            description: 'API Documentation for Taekwondo Management System',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', athleteRoutes);
app.use('/api', championshipRoutes);
app.use('/api', poomsaeRoutes);
app.use('/api', poomsaeEntryRoutes);
app.use('/api', tatamiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));