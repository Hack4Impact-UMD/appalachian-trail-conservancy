import React from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import "./QuizCard.css";

interface QuizCardProps {
  currentQuestion: number;
  totalQuestions: number;
  question: string;
  answerOptions: string[];
}

const QuizCard: React.FC<QuizCardProps> = ({
  currentQuestion,
  totalQuestions,
  question,
  answerOptions,
}) => {
  return (
    <div className="quiz-card">
      <div className="question">
        <p className="question-number">
          Question {currentQuestion} of {totalQuestions}
        </p>
        <p className="question-text">{question}</p>
      </div>
      <div>
        <FormControl component="fieldset">
          <RadioGroup>
            {answerOptions.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default QuizCard;
