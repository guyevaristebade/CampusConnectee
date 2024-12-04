// hooks/useFetchData.ts

import { useState, useEffect } from 'react';
import { fetchAllStudent, fetchDailyAttendance, fetchStatistics, fetchTotalSTudentHoursPerWeek } from '../api';

export const useFetchData = () => {
  const [dailyAttendance, setDailyAttendance] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any | null>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendancePerWeek, setAttendancePerWeek] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [attendance, allStudents, stat, totalHours] = await Promise.all([
            fetchDailyAttendance(),
            fetchAllStudent(),
            fetchStatistics(),
            fetchTotalSTudentHoursPerWeek(),
        ]);

        if (attendance.success) setDailyAttendance(attendance.data);
        if (allStudents.success) setStudents(allStudents.data);
        if (stat.success) setStatistics(stat.data);
        if (totalHours.success) setAttendancePerWeek(totalHours.data);
      } catch (error) {
        setError('Erreur lors de la récupération des données');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { dailyAttendance, statistics, students, attendancePerWeek, loading, error };
};
