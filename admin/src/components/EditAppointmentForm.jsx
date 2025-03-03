import React, { useEffect, useState } from 'react';
import Input from '../UI/Input';
import { status } from '../utils/constanst';
import Select from '../UI/Select';
const EditAppointmentForm = ({ OnCloseModel }) => {
  const [appointmentData, setAppointmentData] = useState({
    patientName: '',
    doctorName: '',
    status: '',
    appointmentTime: '',
    appointmentDate: '',
  });
  useEffect(() => {
    setAppointmentData({
      ...appointmentData,
      patientName: 'johnson',
      doctorName: 'ehmmad',
      status: 'pending',
      appointmentTime: '2:30 PM',
      appointmentDate: '2024-11-10',
    });
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAppointmentData({ ...appointmentData, [name]: value });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Update appointment data in database
    console.log('appointment updated');
    // Reset form
    OnCloseModel();
    console.log(appointmentData);
    setAppointmentData({
      patientName: '',
      doctorName: '',
      appointmentTime: '',
      appointmentDate: '',
    });
  };
  return (
    <div className='w-full md:min-w-[400px] p-6'>
      <div className='text-lg text-center uppercase font-medium  text-blue-600 leading-8'>
        Edit Appointment
      </div>
      <hr className='my-0.5  h-0.5 mb-5 ' />
      <form onSubmit={handleSubmit}>
        <Input
          label='patient name'
          name='name'
          type='text'
          value={appointmentData.patientName}
          placeholder='Enter patient name'
          disabled={true}
          readOnly={true}
          required={true}
        />
        <Input
          label='doctor name'
          name='name'
          type='text'
          value={appointmentData.doctorName}
          disabled={true}
          readOnly={true}
          required={true}
        />
        <Input
          label='appointmnt Time'
          name='appointmentTime'
          type='text'
          value={appointmentData.appointmentTime}
          disabled={false}
          required={true}
          onChange={handleInputChange}
        />
        <Input
          label='appointment date'
          name='appointmentDate'
          type='date'
          value={`${appointmentData.appointmentDate}`}
          disabled={false}
          required={true}
          onChange={handleInputChange}
        />
        <Select
          label='status'
          name='status'
          id='status'
          value={`${appointmentData.status}`}
          options={status}
          disabled={false}
          required={true}
          onChange={handleInputChange}
        />
        {/* <Input label='status' name='appointmentDate' type='text' /> */}
        <div className='mt-5 text-center w-full'>
          <button
            type='submit'
            className='px-3 py-2 text-white text-sm font-medium bg-primary w-44 rounded'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAppointmentForm;
