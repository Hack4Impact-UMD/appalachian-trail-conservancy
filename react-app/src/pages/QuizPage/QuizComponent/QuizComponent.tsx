import { Question } from "../../../../src/types/TrainingType.ts";
import QuizCard from "./QuizCard/QuizCard.tsx";
import styles from "./QuizComponent.module.css";
import React from "react";

interface QuizComponentProps {
  totalQuestions: number;
  questions: Question[];
}

const Quiz: React.FC<QuizComponentProps> = ({ totalQuestions, questions }) => {
  return (
    <>
      <div className={styles.container}>
        {questions.map((option, index) => (
          <QuizCard
            key={index}
            currentQuestion={index + 1}
            totalQuestions={totalQuestions}
            question={option.question}
            answerOptions={option.choices}
          />
        ))}
      </div>
    </>
  );
};

export default Quiz;
