import { Question } from "../../../../src/types/TrainingType.ts";
import QuizCard from "./QuizCard/QuizCard.tsx";
import React from "react";

interface QuizComponentProps {
  totalQuestions: number;
  questions: Question[];
}

const Quiz: React.FC<QuizComponentProps> = ({ totalQuestions, questions }) => {
  return (
    <>
      {questions.map((option, index) => (
        <QuizCard
          key={index}
          currentQuestion={index + 1}
          totalQuestions={totalQuestions}
          question={option.question}
          answerOptions={option.choices}
        />
      ))}
    </>
  );
};

export default Quiz;
