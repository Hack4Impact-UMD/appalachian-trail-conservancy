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
  radioGroup,
  radioAnswers,
} from "../../muiTheme";
import styles from "./QuizResultCard.module.css";
import { IoCloseOutline, IoCheckmark } from "react-icons/io5";

interface QuizResultCardProps {
  currentQuestion: number;
  question: string;
  answerOptions: string[];
  selectedAnswer: string;
  correctAnswer: string;
}

const QuizResultCard: React.FC<QuizResultCardProps> = ({
  currentQuestion,
  question,
  answerOptions,
  selectedAnswer,
  correctAnswer,
}) => {
  const isAnswerCorrect = selectedAnswer === correctAnswer;

  return (
    <div className={styles.quizCard}>
      <div className={styles.question}>
        <h2 className={styles.questionNumber}>Question {currentQuestion}</h2>
        <p className={styles.questionText}>{question}</p>
      </div>
      <div>
        <FormControl>
          <RadioGroup value={selectedAnswer} sx={radioGroup}>
            {answerOptions.map((option, index) => (
              <FormControlLabel
                disabled={true}
                key={index}
                value={option}
                sx={radioAnswers}
                control={
                  <Radio
                    sx={
                      selectedAnswer === option
                        ? isAnswerCorrect
                          ? greenRadioButton // green style if selected answer correct
                          : redRadioButton // red style if selected answer incorrect
                        : correctAnswer === option
                        ? greenRadioButton //green style to the correct answer's button
                        : grayRadioButton
                    }
                  />
                }
                label={
                  <div className={styles.choices}>
                    {selectedAnswer !== option && correctAnswer !== option && (
                      <span className={styles.otherChoiceText}>{option}</span>
                    )}
                    {((isAnswerCorrect && selectedAnswer === option) ||
                      (!isAnswerCorrect && correctAnswer === option)) && (
                      <>
                        <span className={styles.correctChoiceText}>
                          {option}
                        </span>
                        <IoCheckmark className={`${styles.greenIcon}`} />
                      </>
                    )}
                    {!isAnswerCorrect && selectedAnswer === option && (
                      <>
                        <span className={styles.incorrectChoiceText}>
                          {option}
                        </span>
                        <IoCloseOutline className={`${styles.redIcon}`} />
                      </>
                    )}
                  </div>
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
