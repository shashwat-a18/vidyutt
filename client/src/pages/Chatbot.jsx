import { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from '../components/Chatbot/ChatWindow.jsx';

const Chatbot = () => {
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [operator, setOperator] = useState('');

  const startNewSession = async () => {
    setLoading(true);
    try {
      // Create new session
      const sessionResponse = await axios.post(`${import.meta.env.VITE_API_URL}/chatbot/session`, {
        operator: operator || 'Anonymous',
      });

      setSession(sessionResponse.data);

      // Fetch first question
      const questionResponse = await axios.get(`${import.meta.env.VITE_API_URL}/chatbot/start`);
      setCurrentQuestion(questionResponse.data);
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Error starting diagnostic session');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (optionId, label) => {
    if (!session) return;

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/chatbot/next`, {
        sessionId: session._id,
        questionId: currentQuestion.questionId,
        selectedOptionId: optionId,
        allAnswers: session.answers,
      });

      // Update session with new answer
      const updatedSession = response.data.session;
      updatedSession.fault = response.data.fault; // Attach fault for resolved cases
      setSession(updatedSession);

      if (response.data.resolved) {
        setCurrentQuestion(null);
      } else {
        setCurrentQuestion(response.data.question);
      }
    } catch (error) {
      console.error('Error answering question:', error);
      alert('Error processing answer');
    } finally {
      setLoading(false);
    }
  };

  const isSessionActive = session && !session.resolvedFaultId;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border border-cyan-500/30 text-white p-8 rounded-xl shadow-2xl">
        <h1 className="text-4xl font-bold mb-2 text-cyan-300">🤖 Fault Diagnosis Assistant</h1>
        <p className="text-slate-300 text-sm">
          Answer questions systematically to diagnose substation faults. The assistant will guide you through a
          decision tree based on protection element operation and physical observations.
        </p>
      </div>

      {!session ? (
        <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600/50 p-8 rounded-lg backdrop-blur-sm shadow-xl text-center">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">Start a New Diagnostic Session</h2>
            <div className="max-w-md mx-auto mb-6">
              <label className="block text-sm font-semibold text-cyan-300 mb-2 uppercase tracking-wider">Operator Name (Optional)</label>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-slate-600 rounded-lg bg-slate-900 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
              />
            </div>
          </div>

          <button
            onClick={startNewSession}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-cyan-500/30 disabled:opacity-50 transition text-lg"
          >
            {loading ? '⏳ Starting...' : '▶️ Start Diagnosis'}
          </button>

          <div className="mt-8 pt-8 border-t border-slate-600/50">
            <h3 className="text-lg font-bold text-cyan-300 mb-4">How It Works</h3>
            <ul className="text-left space-y-2 text-slate-300 max-w-md mx-auto">
              <li>✓ Select the protection element that has operated</li>
              <li>✓ Answer follow-up questions about observations</li>
              <li>✓ Receive diagnosed fault and investigation checklist</li>
              <li>✓ Mark checklist items as you complete investigations</li>
              <li>✓ Start a new session anytime</li>
            </ul>
          </div>
        </div>
      ) : (
        <ChatWindow
          sessionData={session}
          currentQuestion={currentQuestion}
          onAnswer={handleAnswer}
          onNewSession={() => {
            setSession(null);
            setCurrentQuestion(null);
            setOperator('');
          }}
        />
      )}
    </div>
  );
};

export default Chatbot;
