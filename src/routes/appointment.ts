import { Router } from 'express';
import { getAppointmentRepository } from '../datasource';
const router = Router();
router.get('/', async (req, res) => {
    try {
        const appointmentRepository = await getAppointmentRepository();
        const appointments = await appointmentRepository.find();
        res.json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});
router.get('/date/:date', async (req, res) => {
    try {
        const { date: dateParam } = req.params;
        const dateParts = dateParam.split('-'); 
        const dateObject = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
        const appointmentRepository = await getAppointmentRepository();
        const appointments = await appointmentRepository.find({ where: { date: dateObject } });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments by date' });
    }
});
router.post('/', async (req: any, res: any) => {
    try {
        const { date, time, name, phone } = req.body;
        if (!date || !time || !name || !phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const appointmentRepository = await getAppointmentRepository();
        const existingAppointment = await appointmentRepository.findOne({
            where: { date, time },
        });
        if (existingAppointment) {
            return res.status(200).json({ error: 'Appointment already exists' })
        }
        const appointment = appointmentRepository.create(req.body);
        await appointmentRepository.save(appointment);
       return  res.status(201).json(appointment);
    }
    catch (error:any) {
        return res.status(500).json({ error: 'Failed to create appointment' })
    }
});
export default router;
