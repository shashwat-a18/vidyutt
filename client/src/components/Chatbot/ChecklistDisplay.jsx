import { useState } from 'react';
import axios from 'axios';

const ChecklistDisplay = ({ checklist, sessionData }) => {
  const [checklistState, setChecklistState] = useState(
    sessionData?.checklistProgress || checklist.map((item, idx) => ({
      step: item.step,
      completed: false,
    }))
  );

  const handleChecklistToggle = async (step) => {
    const updated = checklistState.map((item) =>
      item.step === step ? { ...item, completed: !item.completed } : item
    );
    setChecklistState(updated);

    // Update server
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chatbot/progress`, {
        sessionId: sessionData._id,
        step,
        completed: !checklistState.find((item) => item.step === step).completed,
      });
    } catch (error) {
      console.error('Error updating checklist progress:', error);
    }
  };

  const allCompleted = checklistState.every((item) => item.completed);

  return (
    <div className="bg-slate-800/30 border-2 border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 text-cyan-300">
        <span>✅ Investigation Checklist</span>
        {allCompleted && <span className="text-green-400 text-2xl">🎉</span>}
      </h3>

      {allCompleted && (
        <div className="bg-green-900/20 border-2 border-green-500/50 text-green-300 p-4 rounded-lg mb-4 font-bold">
          ✓ All checklist items completed!
        </div>
      )}

      <div className="space-y-3">
        {checklist.map((item) => {
          const isCompleted = checklistState.find((c) => c.step === item.step)?.completed || false;
          return (
            <div
              key={item.step}
              className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                isCompleted
                  ? 'bg-green-900/20 border-green-500/50'
                  : 'bg-slate-700/20 border-slate-600/50 hover:bg-slate-700/40 hover:border-cyan-500/30'
              }`}
              onClick={() => handleChecklistToggle(item.step)}
            >
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={isCompleted}
                  onChange={() => {}}
                  className="w-5 h-5 mt-1 cursor-pointer accent-cyan-500"
                />
                <div className="flex-1">
                  <p className={`font-bold ${isCompleted ? 'text-green-300 line-through' : 'text-slate-200'}`}>
                    Step {item.step}: {item.action}
                  </p>
                  <p className="text-sm text-slate-400 mt-1">Component: {item.component}</p>
                  {item.safetyNote && (
                    <p className="text-sm text-orange-400 font-semibold mt-1">⚠️ Safety: {item.safetyNote}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChecklistDisplay;
