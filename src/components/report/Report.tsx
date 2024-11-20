import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface AttendanceData {
  date: string;
  present: number;
  absent: number;
}

const Reports = () => {
  const [dateRange, setDateRange] = useState('week');
  const [data] = useState<AttendanceData[]>([
    { date: 'Mon', present: 24, absent: 4 },
    { date: 'Tue', present: 22, absent: 6 },
    { date: 'Wed', present: 25, absent: 3 },
    { date: 'Thu', present: 23, absent: 5 },
    { date: 'Fri', present: 21, absent: 7 },
  ]);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Attendance Reports</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="border rounded-md p-2"
          aria-label="Select date range"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="semester">This Semester</option>
        </select>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="present" fill="#4CAF50" />
            <Bar dataKey="absent" fill="#f44336" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Average Attendance</h3>
          <p className="text-2xl font-bold text-green-900">85%</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Average Absences</h3>
          <p className="text-2xl font-bold text-red-900">15%</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Classes</h3>
          <p className="text-2xl font-bold text-blue-900">25</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;