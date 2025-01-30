import { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { grayRadioButton, radioGroup, radioAnswers } from "../../muiTheme";
import styles from "./QuizCard.module.css";

interface QuizCardProps {
  currentQuestion: number;
  question: string;
  answerOptions: string[];
  selectedAnswers: (string | undefined)[];
  setSelectedAnswers: any;
  index: number;
}

const QuizCard: React.FC<QuizCardProps> = ({
  currentQuestion,
  question,
  answerOptions,
  selectedAnswers,
  setSelectedAnswers,
  index,
}) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
    // Copy selected answers list, then edit answer at current index, then replace
    const copyAnswers = selectedAnswers.slice();
    copyAnswers[index] = event.target.value;
    setSelectedAnswers(copyAnswers);
  };

  return (
    <div className={styles.quizCard}>
      <div className={styles.question}>
        <h2 className={styles.questionNumber}>Question {currentQuestion}</h2>
        <p className={styles.questionText}>{question}</p>
      </div>
      <div>
        <FormControl>
          <RadioGroup
            value={selectedValue}
            onChange={handleChange}
            sx={radioGroup}>
            {answerOptions.map((option, index) => (
              <FormControlLabel
                sx={radioAnswers}
                key={index}
                value={option}
                control={<Radio sx={grayRadioButton} />}
                label={<div className={styles.choiceText}>{option}</div>}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </div>
    </div>
  );
};

export default QuizCard;
