import appointmentRouter from './appointment';
import express from 'express';
import request from 'supertest';
import { getAppointmentRepository } from '../datasource';
jest.mock('../datasource', () => ({
  getAppointmentRepository: jest.fn(),
}));
const mockFind = jest.fn();
const mockCreate = jest.fn();
const mockSave = jest.fn();
const mockFindOne = jest.fn();
(getAppointmentRepository as jest.Mock).mockResolvedValue({
  find: mockFind,
  findOne: mockFindOne,
  create: mockCreate,
  save: mockSave,
});
describe('Appointments Router', () => {
  const app = express();
  app.use(express.json());
  app.use('/api/appointments', appointmentRouter);
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('GET /appointments', () => {
    it('should return a list of appointments', async () => {
      const mockAppointments = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }];
      mockFind.mockResolvedValue(mockAppointments);
      const res = await request(app).get('/api/appointments');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockAppointments);
      expect(mockFind).toHaveBeenCalledTimes(1);
    });
    it('should return an empty array if no appointments are found', async () => {
      mockFind.mockResolvedValue([]);
      const res = await request(app).get('/api/appointments');
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([]);
      expect(mockFind).toHaveBeenCalledTimes(1);
    });
    it('should return a 500 error if an exception occurs', async () => {
      mockFind.mockRejectedValue(new Error('Database error'));
      const res = await request(app).get('/api/appointments');
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to fetch appointments' });
      expect(mockFind).toHaveBeenCalledTimes(1);
    });
  });
  describe('POST /appointments', () => {
    it('should create and return a new appointment if it does not exist', async () => {
      const newAppointment = { date: '2025-01-01', time: '10:00', name: 'John Doe', phone: '1234567890' };
      mockFindOne.mockResolvedValue(null);
      mockCreate.mockReturnValue(newAppointment);
      mockSave.mockResolvedValue(newAppointment);
      const res = await request(app).post('/api/appointments').send(newAppointment);
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(newAppointment);
      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
    it('should return a status 200 if the appointment already exists', async () => {
      const existingAppointment = { date: '2025-01-01', time: '10:00', name: 'John Doe', phone: '1234567890' };
      mockFindOne.mockResolvedValue(existingAppointment);
      const res = await request(app).post('/api/appointments').send(existingAppointment);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ error: 'Appointment already exists' });
      expect(mockFindOne).toHaveBeenCalledTimes(1);
    });
    it('should return a 400 error if the request body is invalid', async () => {
      const invalidAppointment = {};
      const res = await request(app).post('/api/appointments').send(invalidAppointment);
      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Missing required fields' });
      expect(mockFindOne).not.toHaveBeenCalled();
      expect(mockCreate).not.toHaveBeenCalled();
      expect(mockSave).not.toHaveBeenCalled();
    });
    it('should return a 500 error if saving the appointment fails', async () => {
      const newAppointment = { date: '2025-01-01', time: '10:00', name: 'John Doe', phone: '1234567890' };
      mockFindOne.mockResolvedValue(null);
      mockCreate.mockReturnValue(newAppointment);
      mockSave.mockRejectedValue(new Error('Database error'));
      const res = await request(app).post('/api/appointments').send(newAppointment);
      expect(res.statusCode).toBe(500);
      expect(res.body).toEqual({ error: 'Failed to create appointment' });
      expect(mockFindOne).toHaveBeenCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledTimes(1);
      expect(mockSave).toHaveBeenCalledTimes(1);
    });
  });
});
