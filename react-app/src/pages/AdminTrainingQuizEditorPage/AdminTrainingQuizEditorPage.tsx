import { useState, useEffect } from "react";
import styles from "./AdminTrainingQuizEditorPage.module.css";
import {
  Button,
  OutlinedInput,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { IoCloseOutline } from "react-icons/io5";
import {
  forestGreenButton,
  grayBorderTextField,
  whiteButtonGrayBorder,
  numberInputRoot,
  numberInputElement,
  numberInputButton,
  grayGreenRadioButton,
  styledRectButton,
} from "../../muiTheme";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";
import AddIcon from "@mui/icons-material/Add";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Hamburger from "../../assets/hamburger.svg";

function TrainingQuizEditorPage() {
  const [navigationBarOpen, setNavigationBarOpen] = useState(true);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([
    null,
  ]);

  const [pointsToPass, setPointsToPass] = useState(0);
  const [maxPoints, setMaxPoints] = useState(questions.length);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setMaxPoints(questions.length);
    if (pointsToPass > questions.length) {
      setPointsToPass(questions.length);
    }
  }, [questions, pointsToPass]);

  const handleQuestionChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = text;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        answers: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
    setSelectedAnswers([...selectedAnswers, null]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (index > 0) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);
      const newSelectedAnswers = selectedAnswers.filter((_, i) => i !== index);
      setSelectedAnswers(newSelectedAnswers);
    }
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    text: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers[answerIndex].text = text;
    setQuestions(newQuestions);
  };

  const handleAddAnswer = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.push({ text: "", isCorrect: false });
    setQuestions(newQuestions);
  };

  const handleRemoveAnswer = (questionIndex: number, answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    if (newSelectedAnswers[questionIndex] == answerIndex) {
      newSelectedAnswers[questionIndex] = null;
    }
    setSelectedAnswers(newSelectedAnswers);

    const newQuestions = [...questions];
    newQuestions[questionIndex].answers = newQuestions[
      questionIndex
    ].answers.filter((_, i) => i !== answerIndex);
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerIndex: number
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answers.map((answer, idx) => ({
      ...answer,
      isCorrect: idx === answerIndex,
    }));
    setQuestions(newQuestions);

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handlePointsToPassChange = (event: any, value: number | null) => {
    if (value !== null && value <= maxPoints) {
      setPointsToPass(value);
    }
  };

  return (
    <>
      <NavigationBar open={navigationBarOpen} setOpen={setNavigationBarOpen} />
      <div
        className={`${styles.split} ${styles.right}`}
        style={{
          // Only apply left shift when screen width is greater than 1200px
          left: navigationBarOpen && screenWidth > 1200 ? "250px" : "0",
        }}>
        {!navigationBarOpen && (
          <img
            src={Hamburger}
            alt="Hamburger Menu"
            className={styles.hamburger} // Add styles to position it
            width={30}
            onClick={() => setNavigationBarOpen(true)} // Set sidebar open when clicked
          />
        )}
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.editorHeader}>
              <h1 className={styles.nameHeading}>Trainings Editor</h1>
              <ProfileIcon />
            </div>

            <form noValidate onSubmit={(e) => e.preventDefault()}>
              <Button sx={whiteButtonGrayBorder}>Save as Draft</Button>

              <h2 className={styles.quizEditorText}>CREATE QUIZ</h2>

              {/* Points to Pass */}
              <div className={styles.pointsContainer}>
                <span className={styles.quizEditorText}>POINTS TO PASS:</span>
                <NumberInput
                  slots={{
                    root: numberInputRoot,
                    input: numberInputElement,
                    incrementButton: numberInputButton,
                    decrementButton: numberInputButton,
                  }}
                  min={0}
                  max={maxPoints}
                  value={pointsToPass}
                  onChange={handlePointsToPassChange}
                />
                <span
                  className={`${styles.quizEditorText} ${styles.leftMargin}`}>
                  / {maxPoints}
                </span>
              </div>

              {/* Questions */}
              <div
                className={`${styles.quizEditorText} ${styles.questionHeading}`}>
                QUESTIONS
              </div>

              {questions.map((question, questionIndex) => (
                <div key={questionIndex}>
                  {/* Question Title */}
                  <div className={styles.questionTitleBox}>
                    <p className={styles.questionNumber}>{questionIndex + 1}</p>
                    <OutlinedInput
                      sx={{ ...grayBorderTextField, width: "100%" }}
                      placeholder="TYPE QUESTION HERE"
                      value={question.questionText}
                      onChange={(e) =>
                        handleQuestionChange(questionIndex, e.target.value)
                      }
                    />
                    {questionIndex > 0 ? (
                      <div
                        className={`${styles.closeIcon} ${styles.leftMargin}`}>
                        <IoCloseOutline
                          onClick={() => handleRemoveQuestion(questionIndex)}
                        />
                      </div>
                    ) : (
                      <div
                        className={`${styles.closeIcon} ${styles.leftMargin}`}
                        style={{ visibility: "hidden" }}>
                        <IoCloseOutline />
                      </div>
                    )}
                  </div>

                  {/* Question Answers */}
                  <div className={styles.answerOptions}>
                    <FormControl>
                      <RadioGroup
                        value={selectedAnswers[questionIndex]}
                        onChange={(e) =>
                          handleCorrectAnswerChange(
                            questionIndex,
                            Number(e.target.value)
                          )
                        }>
                        {question.answers.map((answer, answerIndex) => (
                          <FormControlLabel
                            key={answerIndex}
                            value={answerIndex}
                            control={<Radio sx={grayGreenRadioButton} />}
                            label={
                              <div className={styles.answerOption}>
                                <OutlinedInput
                                  value={answer.text}
                                  onChange={(e) =>
                                    handleAnswerChange(
                                      questionIndex,
                                      answerIndex,
                                      e.target.value
                                    )
                                  }
                                  className={styles.answerBox}
                                />
                                {answerIndex >= 2 && (
                                  <div className={styles.closeIcon}>
                                    <IoCloseOutline
                                      onClick={() =>
                                        handleRemoveAnswer(
                                          questionIndex,
                                          answerIndex
                                        )
                                      }
                                    />
                                  </div>
                                )}
                              </div>
                            }
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>

                    {/* Add Answer Button */}
                    <div className={styles.addAnswerRow}>
                      <div
                        className={styles.addAnswerButton}
                        onClick={() => handleAddAnswer(questionIndex)}>
                        <AddIcon />
                        <h5>ADD ANSWER CHOICE</h5>
                      </div>
                      <div className={styles.selectedAnswerBox}>
                        <span className={styles.selectedAnswerText}>
                          ANSWER:{" "}
                          {selectedAnswers[questionIndex] != null &&
                          selectedAnswers[questionIndex] >= 0
                            ? Number(selectedAnswers[questionIndex]) + 1
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              <div
                className={styles.addQuestionContainer}
                onClick={handleAddQuestion}>
                <AddIcon fontSize="large" />
                <h2>ADD QUESTION</h2>
              </div>

              {/* Button group */}
              <div className={styles.buttonsContainer}>
                <Button
                  variant="contained"
                  sx={{
                    ...styledRectButton,
                    ...whiteButtonGrayBorder,
                    width: "120px",
                  }}>
                  BACK
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    ...styledRectButton,
                    ...forestGreenButton,
                    width: "120px",
                    marginLeft: "30px",
                  }}>
                  PUBLISH
                </Button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default TrainingQuizEditorPage;
