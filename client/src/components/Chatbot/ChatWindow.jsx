import QuestionCard from './QuestionCard.jsx';
import DiagnosisSummary from './DiagnosisSummary.jsx';

const ChatWindow = ({ sessionData, currentQuestion, onAnswer, onNewSession }) => {
  if (!sessionData) {
    return (
      <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-8 rounded-lg backdrop-blur-sm text-center">
        <p className="text-slate-300 mb-4">No active diagnostic session. Click "Start New Diagnosis" to begin.</p>
      </div>
    );
  }

  const resolved = sessionData.resolvedFaultId;

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
      {/* Session Header */}
      <div className="mb-6 pb-4 border-b border-slate-600/50">
        <p className="text-sm text-cyan-300 font-mono">Session ID: {sessionData._id}</p>
        <p className="text-sm text-slate-300">Operator: <span className="text-cyan-400">{sessionData.operator || 'Anonymous'}</span></p>
        <p className="text-sm text-slate-300">Started: <span className="text-slate-400">{new Date(sessionData.startTime).toLocaleString()}</span></p>
      </div>

      {/* Conversation History */}
      <div className="mb-6 max-h-96 overflow-y-auto space-y-3 pr-3">
        {sessionData.answers && sessionData.answers.length > 0 ? (
          sessionData.answers.map((answer, idx) => (
            <div key={idx} className="bg-slate-700/30 border-l-4 border-cyan-500 p-4 rounded-lg">
              <p className="text-xs text-cyan-400 font-semibold mb-1 uppercase tracking-wider">Q{idx + 1}</p>
              <p className="text-slate-200 text-sm">→ {answer.selectedLabel}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-400 text-center py-4">No questions answered yet. Start below.</p>
        )}
      </div>

      {/* Resolution or Next Question */}
      {resolved ? (
        <>
          {sessionData.fault && (
            <DiagnosisSummary fault={sessionData.fault} sessionData={sessionData} />
          )}
        </>
      ) : currentQuestion ? (
        <QuestionCard question={currentQuestion} onAnswer={onAnswer} />
      ) : (
        <p className="text-center text-cyan-400 py-4 animate-pulse">⏳ Loading next question...</p>
      )}

      {/* Start New Diagnosis Button */}
      <button
        onClick={onNewSession}
        className="w-full mt-6 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white py-3 rounded-lg font-semibold shadow-lg shadow-cyan-500/30 transition"
      >
        🔄 Start New Diagnosis
      </button>
    </div>
  );
};

export default ChatWindow;
