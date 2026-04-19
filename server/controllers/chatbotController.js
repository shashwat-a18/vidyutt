import FaultDecisionTree from '../models/FaultDecisionTree.js';
import FaultChecklist from '../models/FaultChecklist.js';
import ChatSession from '../models/ChatSession.js';

export const startChat = async (req, res) => {
  try {
    // Get the first question (Q1)
    const firstQuestion = await FaultDecisionTree.findOne({
      questionId: 'Q1',
    });
    if (!firstQuestion) {
      return res.status(404).json({ message: 'Starting question not found' });
    }
    res.status(200).json(firstQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createSession = async (req, res) => {
  try {
    const { operator } = req.body;
    const newSession = new ChatSession({
      operator: operator || 'Anonymous',
    });
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getNextQuestion = async (req, res) => {
  try {
    const { sessionId, questionId, selectedOptionId, allAnswers } = req.body;

    // Find the current question
    const currentQuestion = await FaultDecisionTree.findOne({
      questionId: questionId,
    });

    if (!currentQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Find the selected option
    const selectedOption = currentQuestion.options.find(
      (opt) => opt.optionId === selectedOptionId
    );

    if (!selectedOption) {
      return res.status(404).json({ message: 'Option not found' });
    }

    // Save the answer to the session
    const session = await ChatSession.findById(sessionId);
    if (session) {
      session.answers.push({
        questionId: questionId,
        selectedOptionId: selectedOptionId,
        selectedLabel: selectedOption.label,
      });

      // If this option resolves to a fault
      if (selectedOption.resolvedFaultId) {
        session.resolvedFaultId = selectedOption.resolvedFaultId;

        // Get the fault checklist
        const checklist = await FaultChecklist.findOne({
          faultId: selectedOption.resolvedFaultId,
        });

        if (checklist) {
          // Initialize checklist progress
          session.checklistProgress = checklist.checklist.map((item) => ({
            step: item.step,
            completed: false,
          }));
        }

        await session.save();

        // Return resolved fault with checklist
        return res.status(200).json({
          resolved: true,
          fault: checklist,
          session: session,
        });
      }

      await session.save();
    }

    // Get next question
    const nextQuestion = await FaultDecisionTree.findOne({
      questionId: selectedOption.nextQuestionId,
    });

    if (!nextQuestion) {
      return res.status(404).json({ message: 'Next question not found' });
    }

    res.status(200).json({
      resolved: false,
      question: nextQuestion,
      session: session,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateChecklistProgress = async (req, res) => {
  try {
    const { sessionId, step, completed } = req.body;

    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const stepProgress = session.checklistProgress.find((p) => p.step === step);
    if (stepProgress) {
      stepProgress.completed = completed;
      stepProgress.completedAt = completed ? new Date() : null;
    }

    await session.save();
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSession = async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
