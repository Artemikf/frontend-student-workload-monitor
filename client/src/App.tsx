import React, { useState } from 'react';
import { Users, BookOpen, CheckSquare, BarChart2, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'students' | 'subjects' | 'assignments' | 'workload'>('students');

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      {/* Навигационная панель */}
      <header className="bg-indigo-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-8 h-8 text-indigo-400" />
            <span className="text-xl font-bold">Student Workload Monitor</span>
          </div>
          <span className="text-sm bg-indigo-800 px-3 py-1 rounded-full text-indigo-200">
            STEM-проєкт • Фронтенд
          </span>
        </div>
      </header>

      {/* Меню переключения вкладок */}
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
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          {activeTab === 'students' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Управління студентами</h2>
              <p className="text-gray-600">Здесь будет таблица студентов, добавление и редактирование профилей через .NET API.</p>
            </div>
          )}
          {activeTab === 'subjects' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Навчальні предмети</h2>
              <p className="text-gray-600">Список учебных дисциплин.</p>
            </div>
          )}
          {activeTab === 'assignments' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Завдання та дедлайни</h2>
              <p className="text-gray-600">Управление заданиями и сроками их выполнения.</p>
            </div>
          )}
          {activeTab === 'workload' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Моніторинг та прогноз навантаження</h2>
              <p className="text-gray-600">Аналитика перегрузок на основе бэкенд-сервиса forecasting.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}