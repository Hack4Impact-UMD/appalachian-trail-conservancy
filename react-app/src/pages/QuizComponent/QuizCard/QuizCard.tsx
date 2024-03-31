import React from "react";
import {
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import styles from "./QuizCard.module.css";

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
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item: string) => ({
    checked: selectedValue === item,
    onChange: handleChange,
    value: item,
    name: "color-radio-button-demo",
    inputProps: { "aria-label": item },
    style: {
      color: "black", // Change color to black
      "&.Mui-checked": {
        color: "black", // Change color to black when checked
      },
    },
  });

  return (
    <div className={styles.quizCard}>
      <div className={styles.question}>
        <p className={styles.questionNumber}>
          Question {currentQuestion} of {totalQuestions}
        </p>
        <p className={styles.questionText}>{question}</p>
      </div>
      <div>
        <FormControl component="fieldset">
          <RadioGroup>
            {answerOptions.map((option, index) => (
              <FormControlLabel
                key={index}
                value={option}
                control={<Radio {...controlProps(option)} />}
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
