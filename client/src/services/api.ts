import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Student {
  id: number;
  fullName: string;
  email: string;
  academicGroup: string;
}

export interface CreateStudentDto {
  fullName: string;
  email: string;
  academicGroup: string;
}

export interface Subject {
  id: number;
  name: string;
  credits?: number;
  lecturer?: string;
}

export interface Assignment {
  id: number;
  title: string;
  subjectId: number;
  dueDate: string;
  estimatedHours: number;
  description?: string;
}

export interface WorkloadForecast {
  studentId?: number;
  studentName?: string;
  totalEstimatedHours?: number;
  isOverloaded?: boolean;
  [key: string]: unknown;
}

export const getStudents = () => api.get<Student[]>('/Students');
export const createStudent = (data: CreateStudentDto) => api.post<Student>('/Students', data);

export const getSubjects = () => api.get<Subject[]>('/Subjects');
export const createSubject = (data: Omit<Subject, 'id'>) => api.post<Subject>('/Subjects', data);

export const getAssignments = () => api.get<Assignment[]>('/Assignments');
export const createAssignment = (data: Omit<Assignment, 'id'>) => api.post<Assignment>('/Assignments', data);

export const getWorkloadSummary = () => api.get<WorkloadForecast[]>('/Workload');

export default api;