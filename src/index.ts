import express from 'express';
import appointmentRoutes from './routes/appointment';
import "reflect-metadata";
import cors from 'cors';
import { AppDataSource } from './datasource';

const PORT = process.env.PORT || 3000;
const app = express();
const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
    credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json());

AppDataSource.initialize().then(() => {
    console.log("Database connected");
}).catch((error: any) => console.log("Database connection error: ", error));

app.use('/api/appointments', appointmentRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the Appointment Booking API!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});