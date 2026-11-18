import axios from 'axios';

// В зависимости от настройки, если запросы идут из браузера, бэкенд доступен на порту 5000
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Student {
  id: number;
  name: string;
  email: string;
}

export interface Subject {
  id: number;
  name: string;
  credits: number;
}

export interface Assignment {
  id: number;
  title: string;
  subjectId: number;
  dueDate: string;
  estimatedHours: number;
}

export interface WorkloadForecast {
  studentId: number;
  studentName: string;
  totalEstimatedHours: number;
  isOverloaded: boolean;
}

// Методы API
export const getStudents = () => api.get<Student[]>('/students');
export const createStudent = (data: Omit<Student, 'id'>) => api.post<Student>('/students', data);

export const getSubjects = () => api.get<Subject[]>('/subjects');
export const createSubject = (data: Omit<Subject, 'id'>) => api.post<Subject>('/subjects', data);

export const getAssignments = () => api.get<Assignment[]>('/assignments');
export const createAssignment = (data: Omit<Assignment, 'id'>) => api.post<Assignment>('/assignments', data);

export const getWorkloadSummary = () => api.get<WorkloadForecast[]>('/workload');

export default api;