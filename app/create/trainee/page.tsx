'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, Pencil, Trash2 } from 'lucide-react';

// Define the shape of a trainee
type Trainee = {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  membership: string;
  expiryDate: string;
  status: 'Active' | 'Inactive';
};

// Validation schema
const traineeSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(5),
  category: z.string(),
  membership: z.string(),
  expiryDate: z.string(),
  status: z.enum(['Active', 'Inactive']),
});

type TraineeFormData = z.infer<typeof traineeSchema>;

export default function TraineePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainees, setTrainees] = useState<Trainee[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TraineeFormData>({
    resolver: zodResolver(traineeSchema),
  });

  useEffect(() => {
    // Fetch trainees from your API
    fetch('/api/trainee')
      .then(res => res.json())
      .then(data => setTrainees(data));
  }, []);

  const onSubmit = async (data: TraineeFormData) => {
    const res = await fetch('/api/trainee', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const newTrainee = await res.json();
      console.log(res)
      setTrainees(prev => [...prev, newTrainee]);
      reset();
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Trainees</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Trainee
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse bg-white text-sm shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Membership</th>
              <th className="px-4 py-3">Expiry Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainees.map((trainee) => (
              <tr key={trainee.id} className="border-t">
                <td className="px-4 py-3 font-medium">{trainee.name}</td>
                <td className="px-4 py-3">{trainee.email}</td>
                <td className="px-4 py-3">{trainee.phone}</td>
                <td className="px-4 py-3">{trainee.category}</td>
                <td className="px-4 py-3">{trainee.membership}</td>
                <td className="px-4 py-3">{trainee.expiryDate}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded ${trainee.status === 'Active' ? 'bg-green-500' : 'bg-gray-400'}`}>{trainee.status}</span>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="text-blue-600 hover:underline"><Eye size={16} /></button>
                  <button className="text-yellow-500 hover:underline"><Pencil size={16} /></button>
                  <button className="text-red-600 hover:underline"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Create New Trainee</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="text" placeholder="Name" {...register('name')} className="w-full border p-2 rounded" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

              <input type="email" placeholder="Email" {...register('email')} className="w-full border p-2 rounded" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              <input type="text" placeholder="Phone" {...register('phone')} className="w-full border p-2 rounded" />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}

              <input type="text" placeholder="Category" {...register('category')} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Membership" {...register('membership')} className="w-full border p-2 rounded" />
              <input type="text" placeholder="Expiry Date" {...register('expiryDate')} className="w-full border p-2 rounded" />

              <select {...register('status')} className="w-full border p-2 rounded">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
