import { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { grayRadioButton } from "../../../muiTheme";
import styles from "./QuizCard.module.css";

interface QuizCardProps {
  currentQuestion: number;
  question: string;
  answerOptions: string[];
}

const QuizCard: React.FC<QuizCardProps> = ({
  currentQuestion,
  question,
  answerOptions,
}) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className={styles.quizCard}>
      <div className={styles.question}>
        <h2 className={styles.questionNumber}>Question {currentQuestion}</h2>
        <p className={styles.questionText}>{question}</p>
      </div>
      <div>
        <FormControl>
          <RadioGroup value={selectedValue} onChange={handleChange}>
            {answerOptions.map((option, index) => (
              <FormControlLabel
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
