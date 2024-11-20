export interface User {
    id: string;
    name: string;
  }
  
  export interface Class {
    id: string;
    name: string;
    courseCode: string;
    instructor: string;
    schedule: {
      day: string;
      startTime: string;
      endTime: string;
    };
  }
  
  export interface AttendanceRecord {
    id: string;
    userId: string;
    classId: string;
    date: string;
    status: 'present' | 'late' | 'absent';
    verificationMethod: string;
  }