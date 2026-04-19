const QuestionCard = ({ question, onAnswer }) => {
  if (!question) {
    return <div className="text-center text-cyan-400 py-4 animate-pulse">⏳ Loading question...</div>;
  }

  return (
    <div className="bg-slate-700/20 border-2 border-cyan-500/30 p-6 rounded-lg backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-6 text-cyan-300">{question.questionText || question.question}</h3>

      <div className="space-y-3">
        {question.options && question.options.map((option) => (
          <button
            key={option.optionId}
            onClick={() => onAnswer(option.optionId, option.label)}
            className="w-full bg-slate-800/50 border-2 border-slate-600 hover:border-cyan-500 hover:bg-slate-700/60 p-4 rounded-lg text-left transition duration-200 font-medium text-slate-200 hover:text-cyan-300"
          >
            ✓ {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
