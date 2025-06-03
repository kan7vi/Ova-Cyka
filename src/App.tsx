import React, { useState } from 'react';
import { Calendar, Moon, Settings, TrendingUp } from 'lucide-react';

interface CycleDay {
  date: string;
  flow: 'light' | 'medium' | 'heavy' | null;
  symptoms: string[];
  notes: string;
  metrics?: {
    weight?: number;
    hairLoss?: 'none' | 'mild' | 'moderate' | 'severe';
    acne?: 'none' | 'mild' | 'moderate' | 'severe';
    insulinLevel?: number;
  };
}

type ConditionType = 'pcos' | 'pcod' | 'neither' | null;

function App() {
  const [condition, setCondition] = useState<ConditionType>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'insights' | 'settings'>('calendar');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cycleData, setCycleData] = useState<Record<string, CycleDay>>({});

  const [flow, setFlow] = useState<'light' | 'medium' | 'heavy' | null>(null);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [metrics, setMetrics] = useState<CycleDay['metrics']>({});

  const baseSymptoms = [
    'Cramps', 'Headache', 'Fatigue', 'Bloating', 
    'Mood Swings', 'Back Pain', 'Breast Tenderness'
  ];

  const pcosSymptoms = [
    ...baseSymptoms,
    'Irregular Periods',
    'Weight Gain',
    'Hair Growth',
    'Hair Loss',
    'Acne',
    'Insulin Resistance'
  ];

  const pcodSymptoms = [
    ...baseSymptoms,
    'Pelvic Pain',
    'Heavy Periods',
    'Weight Gain',
    'Acne'
  ];

  const getSymptomOptions = () => {
    switch (condition) {
      case 'pcos':
        return pcosSymptoms;
      case 'pcod':
        return pcodSymptoms;
      default:
        return baseSymptoms;
    }
  };

  if (condition === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-purple-800 mb-8 text-center">Welcome to Luna Track</h1>
            <p className="text-gray-600 mb-6 text-center">
              To provide you with better tracking and insights, please let us know if you have been diagnosed with any of the following conditions:
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setCondition('pcos')}
                className="w-full p-4 text-left rounded-lg border-2 border-purple-200 hover:border-purple-500 transition-colors"
              >
                <h3 className="font-semibold text-purple-800">PCOS</h3>
                <p className="text-sm text-gray-600">Polycystic Ovary Syndrome</p>
              </button>
              <button
                onClick={() => setCondition('pcod')}
                className="w-full p-4 text-left rounded-lg border-2 border-purple-200 hover:border-purple-500 transition-colors"
              >
                <h3 className="font-semibold text-purple-800">PCOD</h3>
                <p className="text-sm text-gray-600">Polycystic Ovarian Disease</p>
              </button>
              <button
                onClick={() => setCondition('neither')}
                className="w-full p-4 text-left rounded-lg border-2 border-purple-200 hover:border-purple-500 transition-colors"
              >
                <h3 className="font-semibold text-purple-800">Neither</h3>
                <p className="text-sm text-gray-600">I have not been diagnosed with either condition</p>
              </button>
            </div>
            <p className="mt-6 text-sm text-gray-500 text-center">
              This information helps us provide more relevant tracking features and insights for your specific needs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    if (cycleData[date]) {
      setFlow(cycleData[date].flow);
      setSymptoms(cycleData[date].symptoms);
      setNotes(cycleData[date].notes);
      setMetrics(cycleData[date].metrics || {});
    } else {
      setFlow(null);
      setSymptoms([]);
      setNotes('');
      setMetrics({});
    }
  };

  const handleSave = () => {
    setCycleData(prev => ({
      ...prev,
      [selectedDate]: {
        date: selectedDate,
        flow,
        symptoms,
        notes,
        metrics
      }
    }));
  };

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const renderConditionSpecificMetrics = () => {
    if (condition === 'pcos') {
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-purple-800">PCOS Specific Metrics</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={metrics?.weight || ''}
                onChange={(e) => setMetrics(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hair Loss</label>
              <select
                value={metrics?.hairLoss || 'none'}
                onChange={(e) => setMetrics(prev => ({ ...prev, hairLoss: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Insulin Level (if measured)</label>
              <input
                type="number"
                value={metrics?.insulinLevel || ''}
                onChange={(e) => setMetrics(prev => ({ ...prev, insulinLevel: parseFloat(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>
      );
    } else if (condition === 'pcod') {
      return (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-purple-800">PCOD Specific Metrics</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={metrics?.weight || ''}
                onChange={(e) => setMetrics(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acne Severity</label>
              <select
                value={metrics?.acne || 'none'}
                onChange={(e) => setMetrics(prev => ({ ...prev, acne: e.target.value as any }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="none">None</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-purple-800 mb-8 text-center">Luna Track</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-around mb-6">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                activeTab === 'calendar' ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Calendar size={20} />
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                activeTab === 'insights' ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <TrendingUp size={20} />
              <span>Insights</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                activeTab === 'settings' ? 'bg-purple-100 text-purple-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
          </div>

          {activeTab === 'calendar' && (
            <div>
              <div className="mb-6">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-800">Flow</h3>
                <div className="flex gap-3">
                  {(['light', 'medium', 'heavy'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setFlow(level)}
                      className={`px-4 py-2 rounded-lg capitalize ${
                        flow === level 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-800">Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {getSymptomOptions().map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        symptoms.includes(symptom)
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}
                    >
                      {symptom}
                    </button>
                  ))}
                </div>
              </div>

              {renderConditionSpecificMetrics()}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-purple-800">Notes</h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Add any notes about your day..."
                />
              </div>

              <button
                onClick={handleSave}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
              >
                Save Entry
              </button>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="text-center py-12">
              <Moon size={48} className="mx-auto mb-4 text-purple-600" />
              <p className="text-gray-600">
                Track your cycle for at least one month to see insights about your patterns.
                {condition !== 'neither' && (
                  <span className="block mt-2">
                    We'll provide specific insights related to your {condition.toUpperCase()} condition, including:
                    {condition === 'pcos' && (
                      <ul className="mt-2 text-left list-disc pl-6">
                        <li>Cycle irregularity patterns</li>
                        <li>Weight fluctuations</li>
                        <li>Hair loss patterns</li>
                        <li>Insulin level trends</li>
                      </ul>
                    )}
                    {condition === 'pcod' && (
                      <ul className="mt-2 text-left list-disc pl-6">
                        <li>Period heaviness patterns</li>
                        <li>Weight changes</li>
                        <li>Acne correlation with cycle</li>
                      </ul>
                    )}
                  </span>
                )}
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Your Profile</h3>
                <p className="text-sm text-gray-600">
                  Condition: {condition === 'neither' ? 'No specific condition' : condition.toUpperCase()}
                </p>
                <button
                  onClick={() => setCondition(null)}
                  className="mt-2 text-sm text-purple-600 hover:text-purple-800"
                >
                  Change condition
                </button>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Notifications</h3>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Enable period predictions</span>
                </label>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Data Privacy</h3>
                <p className="text-sm text-gray-600">
                  Your data is stored locally on your device and is never shared with third parties.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;