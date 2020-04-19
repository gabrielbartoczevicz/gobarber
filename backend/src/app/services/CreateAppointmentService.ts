import { startOfHour } from 'date-fns';
import { getCustomRepository, getRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import User from '../models/User';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ provider_id, date }: Request): Promise<Appointment> {
    const appointmentsRepostiory = getCustomRepository(AppointmentsRepository);
    const usersRepository = getRepository(User);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepostiory.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    const findAppointmentUser = await usersRepository.findOne({
      where: { id: provider_id },
    });

    if (!findAppointmentUser) {
      throw Error('User not found');
    }

    const appointment = appointmentsRepostiory.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepostiory.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
