import React from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import {
  grayRadioButton,
  greenRadioButton,
  redRadioButton,
} from "../../../../muiTheme";
import styles from "./QuizResultCard.module.css";
import { IoCloseOutline, IoCheckmark } from "react-icons/io5";

interface QuizResultCardProps {
  currentQuestion: number;
  totalQuestions: number;
  question: string;
  answerOptions: string[];
  selectedAnswer: string;
  correctAnswer: string;
}

const QuizResultCard: React.FC<QuizResultCardProps> = ({
  currentQuestion,
  totalQuestions,
  question,
  answerOptions,
  selectedAnswer,
  correctAnswer,
}) => {
  const isAnswerCorrect = selectedAnswer === correctAnswer;

  return (
    <div className={styles.quizCard}>
      <div className={styles.question}>
        <h2 className={styles.questionNumber}>
          Question {currentQuestion} of {totalQuestions}
        </h2>
        <p className={styles.questionText}>{question}</p>
      </div>
      <div>
        <FormControl>
          <RadioGroup value={selectedAnswer}>
            {answerOptions.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={
                  <Radio
                    sx={
                      selectedAnswer === option
                        ? isAnswerCorrect
                          ? greenRadioButton // green style if selected answer correct
                          : redRadioButton // red style if selected answer incorrect
                        : correctAnswer === option
                        ? greenRadioButton //green style to the correct answer's button
                        : {}
                    }
                  />
                }
                label={
                  <>
                    {option}
                    {isAnswerCorrect && selectedAnswer === option && (
                      <IoCheckmark className={`${styles.greenIcon}`} />
                    )}
                    {!isAnswerCorrect && selectedAnswer === option && (
                      <IoCloseOutline className={`${styles.redIcon}`} />
                    )}
                    {!isAnswerCorrect && correctAnswer === option && (
                      <IoCheckmark className={`${styles.greenIcon}`} />
                    )}
                  </>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default QuizResultCard;
