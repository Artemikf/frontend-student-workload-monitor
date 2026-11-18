import React, { useState, useEffect } from 'react';
import { Users, BookOpen, CheckSquare, BarChart2, ShieldAlert, Plus, Trash2 } from 'lucide-react';
import { 
  getStudents, createStudent, Student,
  getSubjects, createSubject, Subject,
  getAssignments, createAssignment, Assignment,
  getWorkloadSummary, WorkloadForecast
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'students' | 'subjects' | 'assignments' | 'workload'>('students');

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [workload, setWorkload] = useState<WorkloadForecast[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Формы
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCredits, setNewSubjectCredits] = useState(3);

  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentSubjectId, setNewAssignmentSubjectId] = useState(1);
  const [newAssignmentHours, setNewAssignmentHours] = useState(5);
  const [newAssignmentDate, setNewAssignmentDate] = useState('');

  // Загрузка данных при переключении вкладки
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'students') {
        const res = await getStudents();
        setStudents(res.data);
      } else if (activeTab === 'subjects') {
        const res = await getSubjects();
        setSubjects(res.data);
      } else if (activeTab === 'assignments') {
        const resAssign = await getAssignments();
        const resSubj = await getSubjects();
        setAssignments(resAssign.data);
        setSubjects(resSubj.data);
      } else if (activeTab === 'workload') {
        const res = await getWorkloadSummary();
        setWorkload(res.data);
      }
    } catch (err: any) {
      setError('Не удалось загрузить данные с бэкенда. Проверьте, запущен ли API на порту 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName) return;
    try {
      await createStudent({ name: newStudentName, email: newStudentEmail });
      setNewStudentName('');
      setNewStudentEmail('');
      fetchData();
    } catch (err) {
      alert('Ошибка при создании студента');
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName) return;
    try {
      await createSubject({ name: newSubjectName, credits: Number(newSubjectCredits) });
      setNewSubjectName('');
      setNewSubjectCredits(3);
      fetchData();
    } catch (err) {
      alert('Ошибка при создании предмета');
    }
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignmentTitle) return;
    try {
      await createAssignment({
        title: newAssignmentTitle,
        subjectId: Number(newAssignmentSubjectId),
        estimatedHours: Number(newAssignmentHours),
        dueDate: newAssignmentDate || new Date().toISOString()
      });
      setNewAssignmentTitle('');
      fetchData();
    } catch (err) {
      alert('Ошибка при создании задания');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Шапка */}
      <header className="bg-indigo-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold">Student Workload Monitor</span>
          </div>
          <span className="text-sm bg-indigo-800 px-3 py-1 rounded-full text-indigo-200">
            STEM-проєкт • Фронтенд (.NET + React)
          </span>
        </div>
      </header>

      {/* Навигация */}
      <nav className="bg-white shadow border-b">
        <div className="max-w-7xl mx-auto px-4 flex space-x-8">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-4 px-3 flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'students' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Студенти</span>
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`py-4 px-3 flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'subjects' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Предмети</span>
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-4 px-3 flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'assignments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span>Завдання</span>
          </button>
          <button
            onClick={() => setActiveTab('workload')}
            className={`py-4 px-3 flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'workload' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span>Аналіз навантаження та прогнози</span>
          </button>
        </div>
      </nav>

      {/* Основной контент */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          {/* Студенты */}
          {activeTab === 'students' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Управління студентами</h2>
              
              <form onSubmit={handleAddStudent} className="mb-6 flex gap-4 bg-gray-50 p-4 rounded-lg border">
                <input
                  type="text"
                  placeholder="ПІБ студента"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="border px-3 py-2 rounded-md flex-1"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="border px-3 py-2 rounded-md flex-1"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Додати
                </button>
              </form>

              {loading ? <p>Загрузка...</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-100 text-gray-600 text-sm">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">ПІБ</th>
                        <th className="py-3 px-4">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{s.id}</td>
                          <td className="py-3 px-4 font-medium">{s.name}</td>
                          <td className="py-3 px-4 text-gray-600">{s.email || '—'}</td>
                        </tr>
                      ))}
                      {students.length === 0 && (
                        <tr><td colSpan={3} className="py-4 text-center text-gray-500">Список студентів пустий</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Предметы */}
          {activeTab === 'subjects' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Навчальні предмети</h2>
              
              <form onSubmit={handleAddSubject} className="mb-6 flex gap-4 bg-gray-50 p-4 rounded-lg border">
                <input
                  type="text"
                  placeholder="Назва предмета"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="border px-3 py-2 rounded-md flex-1"
                  required
                />
                <input
                  type="number"
                  placeholder="Кредити (ECTS)"
                  value={newSubjectCredits}
                  onChange={(e) => setNewSubjectCredits(Number(e.target.value))}
                  className="border px-3 py-2 rounded-md w-40"
                  min={1}
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Додати
                </button>
              </form>

              {loading ? <p>Загрузка...</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-100 text-gray-600 text-sm">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Назва</th>
                        <th className="py-3 px-4">Кредити</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((sub) => (
                        <tr key={sub.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{sub.id}</td>
                          <td className="py-3 px-4 font-medium">{sub.name}</td>
                          <td className="py-3 px-4">{sub.credits}</td>
                        </tr>
                      ))}
                      {subjects.length === 0 && (
                        <tr><td colSpan={3} className="py-4 text-center text-gray-500">Список предметів пустий</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Задания */}
          {activeTab === 'assignments' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Завдання та дедлайни</h2>
              
              <form onSubmit={handleAddAssignment} className="mb-6 flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg border">
                <input
                  type="text"
                  placeholder="Назва завдання"
                  value={newAssignmentTitle}
                  onChange={(e) => setNewAssignmentTitle(e.target.value)}
                  className="border px-3 py-2 rounded-md flex-1 min-w-[200px]"
                  required
                />
                <select
                  value={newAssignmentSubjectId}
                  onChange={(e) => setNewAssignmentSubjectId(Number(e.target.value))}
                  className="border px-3 py-2 rounded-md"
                >
                  {subjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Години"
                  value={newAssignmentHours}
                  onChange={(e) => setNewAssignmentHours(Number(e.target.value))}
                  className="border px-3 py-2 rounded-md w-28"
                />
                <input
                  type="date"
                  value={newAssignmentDate}
                  onChange={(e) => setNewAssignmentDate(e.target.value)}
                  className="border px-3 py-2 rounded-md"
                />
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Додати
                </button>
              </form>

              {loading ? <p>Загрузка...</p> : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-100 text-gray-600 text-sm">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Назва</th>
                        <th className="py-3 px-4">Предмет ID</th>
                        <th className="py-3 px-4">Години</th>
                        <th className="py-3 px-4">Дедлайн</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((a) => (
                        <tr key={a.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{a.id}</td>
                          <td className="py-3 px-4 font-medium">{a.title}</td>
                          <td className="py-3 px-4">{a.subjectId}</td>
                          <td className="py-3 px-4">{a.estimatedHours} год.</td>
                          <td className="py-3 px-4">{new Date(a.dueDate).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {assignments.length === 0 && (
                        <tr><td colSpan={5} className="py-4 text-center text-gray-500">Список завдань пустий</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Анализ нагрузки */}
          {activeTab === 'workload' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Моніторинг та прогноз навантаження</h2>
              <p className="text-gray-600 mb-4">Данные аналитики рассчитываются бэкенд-сервисом прогнозирования нагрузки.</p>

              {loading ? <p>Загрузка прогнозов...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workload.map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-lg border ${item.isOverloaded ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                      <h3 className="font-bold text-lg">{item.studentName || `Студент #${item.studentId}`}</h3>
                      <p className="text-sm text-gray-600 mt-1">Орієнтовне навантаження: <b>{item.totalEstimatedHours} годин</b></p>
                      <div className="mt-3">
                        {item.isOverloaded ? (
                          <span className="bg-red-200 text-red-800 text-xs px-2.5 py-1 rounded-full font-semibold">Перевантаження!</span>
                        ) : (
                          <span className="bg-green-200 text-green-800 text-xs px-2.5 py-1 rounded-full font-semibold">Норма</span>
                        )}
                      </div>
                    </div>
                  ))}
                  {workload.length === 0 && (
                    <p className="text-gray-500">Немає даних для прогнозу навантаження.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}