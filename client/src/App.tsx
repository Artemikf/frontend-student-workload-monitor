import React, { useState, useEffect } from 'react';
import { Users, BookOpen, CheckSquare, BarChart2, ShieldAlert, Plus } from 'lucide-react';
import {
  getStudents,
  createStudent,
  Student,
  getSubjects,
  createSubject,
  Subject,
  getAssignments,
  createAssignment,
  Assignment,
  getWorkloadSummary,
  WorkloadForecast,
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState<'students' | 'subjects' | 'assignments' | 'workload'>('students');

  const [students, setStudents] = useState<Student[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [workload, setWorkload] = useState<WorkloadForecast[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Форма студента
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [academicGroup, setAcademicGroup] = useState('');

  // Форма предмета
  const [subjectName, setSubjectName] = useState('');
  const [subjectCredits, setSubjectCredits] = useState(5);

  // Форма завдання
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentSubjectId, setAssignmentSubjectId] = useState<number>(1);
  const [assignmentHours, setAssignmentHours] = useState<number>(4);
  const [assignmentDate, setAssignmentDate] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'students') {
        const res = await getStudents();
        setStudents(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'subjects') {
        const res = await getSubjects();
        setSubjects(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'assignments') {
        const [resAssign, resSubj] = await Promise.all([getAssignments(), getSubjects()]);
        const assignList = Array.isArray(resAssign.data) ? resAssign.data : [];
        const subjList = Array.isArray(resSubj.data) ? resSubj.data : [];
        setAssignments(assignList);
        setSubjects(subjList);
        if (subjList.length > 0) {
          setAssignmentSubjectId((prev) => (subjList.some((s) => s.id === prev) ? prev : subjList[0].id));
        }
      } else if (activeTab === 'workload') {
        const res = await getWorkloadSummary();
        setWorkload(Array.isArray(res.data) ? res.data : []);
      }
    } catch {
      setError('Не вдалося завантажити дані з сервера. Перевірте, чи запущено бекенд API на порту 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !academicGroup.trim()) return;
    try {
      await createStudent({
        fullName: fullName.trim(),
        email: email.trim(),
        academicGroup: academicGroup.trim(),
      });
      setFullName('');
      setEmail('');
      setAcademicGroup('');
      fetchData();
    } catch {
      alert('Помилка під час додавання студента');
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    try {
      await createSubject({
        name: subjectName.trim(),
        credits: Number(subjectCredits),
      });
      setSubjectName('');
      setSubjectCredits(5);
      fetchData();
    } catch {
      alert('Помилка під час додавання дисципліни');
    }
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentTitle.trim()) return;
    try {
      await createAssignment({
        title: assignmentTitle.trim(),
        subjectId: Number(assignmentSubjectId),
        estimatedHours: Number(assignmentHours),
        dueDate: assignmentDate ? new Date(assignmentDate).toISOString() : new Date().toISOString(),
      });
      setAssignmentTitle('');
      setAssignmentDate('');
      fetchData();
    } catch {
      alert('Помилка під час додавання завдання');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-indigo-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold">Моніторинг навчального навантаження</span>
          </div>
          <span className="text-sm bg-indigo-800 px-3 py-1 rounded-full text-indigo-200">
            STEM-проєкт • Фронтенд
          </span>
        </div>
      </header>

      <nav className="bg-white shadow border-b overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex space-x-6 sm:space-x-8">
          <button
            onClick={() => setActiveTab('students')}
            className={`py-4 px-3 flex items-center space-x-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'students' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Студенти</span>
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`py-4 px-3 flex items-center space-x-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'subjects' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Предмети</span>
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-4 px-3 flex items-center space-x-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'assignments' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span>Завдання</span>
          </button>
          <button
            onClick={() => setActiveTab('workload')}
            className={`py-4 px-3 flex items-center space-x-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
              activeTab === 'workload' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span>Аналіз навантаження та прогнози</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          {activeTab === 'students' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Управління студентами</h2>

              <form onSubmit={handleAddStudent} className="mb-6 flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg border">
                <input
                  type="text"
                  placeholder="ПІБ / Ім'я студента"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="border px-3 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Академічна група"
                  value={academicGroup}
                  onChange={(e) => setAcademicGroup(e.target.value)}
                  className="border px-3 py-2 rounded-md w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="email"
                  placeholder="Електронна пошта (Email)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border px-3 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Додати
                </button>
              </form>

              {loading ? (
                <p className="text-gray-500">Завантаження списку студентів...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-100 text-gray-600 text-sm">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">ПІБ / Ім'я</th>
                        <th className="py-3 px-4">Група</th>
                        <th className="py-3 px-4">Електронна пошта</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-500">{s.id}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">{s.fullName}</td>
                          <td className="py-3 px-4 text-gray-700">{s.academicGroup || '—'}</td>
                          <td className="py-3 px-4 text-gray-600">{s.email || '—'}</td>
                        </tr>
                      ))}
                      {students.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-gray-500">
                            Список студентів наразі порожній
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'subjects' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Навчальні дисципліни</h2>

              <form onSubmit={handleAddSubject} className="mb-6 flex flex-col sm:flex-row gap-4 bg-gray-50 p-4 rounded-lg border">
                <input
                  type="text"
                  placeholder="Назва дисципліни"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="border px-3 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Кредити (ECTS)"
                  value={subjectCredits}
                  onChange={(e) => setSubjectCredits(Number(e.target.value))}
                  className="border px-3 py-2 rounded-md w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={1}
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Додати
                </button>
              </form>

              {loading ? (
                <p className="text-gray-500">Завантаження дисциплін...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-100 text-gray-600 text-sm">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Назва дисципліни</th>
                        <th className="py-3 px-4">Кредити ECTS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.map((sub) => (
                        <tr key={sub.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-500">{sub.id}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">{sub.name}</td>
                          <td className="py-3 px-4">{sub.credits ?? '—'}</td>
                        </tr>
                      ))}
                      {subjects.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-gray-500">
                            Список дисциплін наразі порожній
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'assignments' && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Завдання та дедлайни</h2>

              <form onSubmit={handleAddAssignment} className="mb-6 flex flex-wrap gap-4 bg-gray-50 p-4 rounded-lg border">
                <input
                  type="text"
                  placeholder="Назва завдання"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="border px-3 py-2 rounded-md flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <select
                  value={assignmentSubjectId}
                  onChange={(e) => setAssignmentSubjectId(Number(e.target.value))}
                  className="border px-3 py-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {subjects.length === 0 && <option value={1}>Дисципліна #1</option>}
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Години"
                  value={assignmentHours}
                  onChange={(e) => setAssignmentHours(Number(e.target.value))}
                  className="border px-3 py-2 rounded-md w-28 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min={1}
                />
                <input
                  type="date"
                  value={assignmentDate}
                  onChange={(e) => setAssignmentDate(e.target.value)}
                  className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Додати
                </button>
              </form>

              {loading ? (
                <p className="text-gray-500">Завантаження завдань...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-100 text-gray-600 text-sm">
                        <th className="py-3 px-4">ID</th>
                        <th className="py-3 px-4">Назва завдання</th>
                        <th className="py-3 px-4">ID предмета</th>
                        <th className="py-3 px-4">Трудомісткість</th>
                        <th className="py-3 px-4">Дедлайн</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.map((a) => (
                        <tr key={a.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-500">{a.id}</td>
                          <td className="py-3 px-4 font-medium text-gray-900">{a.title}</td>
                          <td className="py-3 px-4">{a.subjectId}</td>
                          <td className="py-3 px-4">{a.estimatedHours} год.</td>
                          <td className="py-3 px-4">{new Date(a.dueDate).toLocaleDateString('uk-UA')}</td>
                        </tr>
                      ))}
                      {assignments.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            Список завдань наразі порожній
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'workload' && (
            <div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Моніторинг та прогноз навантаження</h2>
              <p className="text-gray-600 mb-6">
                Аналітичні показники формуються на основі даних бекенд-сервісу.
              </p>

              {loading ? (
                <p className="text-gray-500">Завантаження прогнозів...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {workload.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl border transition-shadow hover:shadow-md ${
                        item.isOverloaded ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <h3 className="font-bold text-lg text-gray-900">
                        {item.studentName || `Запис #${item.studentId ?? idx + 1}`}
                      </h3>
                      {typeof item.totalEstimatedHours === 'number' && (
                        <p className="text-sm text-gray-700 mt-2">
                          Орієнтовне навантаження: <span className="font-semibold">{item.totalEstimatedHours} год.</span>
                        </p>
                      )}
                      {typeof item.isOverloaded === 'boolean' && (
                        <div className="mt-4">
                          {item.isOverloaded ? (
                            <span className="inline-block bg-red-200 text-red-900 text-xs px-3 py-1 rounded-full font-semibold">
                              Критичне перевантаження!
                            </span>
                          ) : (
                            <span className="inline-block bg-green-200 text-green-900 text-xs px-3 py-1 rounded-full font-semibold">
                              Навантаження в нормі
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  {workload.length === 0 && (
                    <p className="text-gray-500 col-span-full">Немає даних для формування прогнозу навантаження.</p>
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