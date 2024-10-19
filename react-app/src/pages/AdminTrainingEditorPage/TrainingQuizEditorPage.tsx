import React, { useState, useEffect } from "react"; // Added useEffect
import styles from "./TrainingQuizEditorPage.module.css";
import { Button, Typography, OutlinedInput, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import {
  forestGreenButton,
  grayBorderTextField,
  whiteButtonGrayBorder,
} from "../../muiTheme";
import { Unstable_NumberInput as NumberInput } from "@mui/base/Unstable_NumberInput";
import { styledRectButton } from "../LoginPage/LoginPage";

function TrainingQuizEditorPage() {
  const [navigationBarOpen, setNavigationBarOpen] = useState(true);

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
        style={{ left: navigationBarOpen ? "250px" : "0" }}
      >
        <div className={styles.container}>
          <div className={styles.navbar}>
            <NavigationBar
              open={navigationBarOpen}
              setOpen={setNavigationBarOpen}
            />
          </div>
          <div className={styles.editor}>
            <div className={styles.editorContent}>
              <div className={styles.editorHeader}>
                <h1 className={styles.nameHeading}>Trainings Editor</h1>
                <div className={styles.editorProfileHeader}>
                  <h5 className={styles.adminText}> Admin </h5>
                  <ProfileIcon />
                </div>
              </div>

              <form noValidate onSubmit={(e) => e.preventDefault()}>
                <Button sx={whiteButtonGrayBorder}>Save as Draft</Button>

                <h2>CREATE QUIZ</h2>

                {/* Added NumberInput for points to pass */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "0.5rem",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      color: "black",
                      fontWeight: "bold",
                      marginTop: "2rem",
                    }}
                  >
                    POINTS TO PASS:
                  </Typography>

                  <NumberInput
                    aria-label="Points to pass"
                    min={0}
                    max={maxPoints}
                    value={pointsToPass}
                    onChange={handlePointsToPassChange}
                  />
                  <Typography
                    variant="body2"
                    style={{ marginLeft: "1rem", color: "gray" }}
                  >
                    / {maxPoints} {/* Displays the total number of questions */}
                  </Typography>
                </div>

                <Typography
                  variant="body2"
                  style={{
                    color: "black",
                    fontWeight: "bold",
                    marginTop: "2rem",
                  }}
                >
                  QUESTIONS
                </Typography>

                {questions.map((question, questionIndex) => (
                  <div key={questionIndex} className={styles.question}>
                    <div className={styles.questionTitleBox}>
                      <p className={styles.questionNumber}>
                        {questionIndex + 1}
                      </p>
                      <OutlinedInput
                        sx={{ ...grayBorderTextField, width: "100%" }}
                        placeholder="TYPE QUESTION HERE"
                        value={question.questionText}
                        onChange={(e) =>
                          handleQuestionChange(questionIndex, e.target.value)
                        }
                      />
                      {questionIndex > 0 && (
                        <CloseIcon
                          onClick={() => handleRemoveQuestion(questionIndex)}
                          className={styles.closeIcon}
                        />
                      )}
                      {questionIndex <= 0 && (
                        <CloseIcon
                          className={styles.closeIcon}
                          style={{ visibility: "hidden" }}
                        />
                      )}
                    </div>
                    <div className={styles.answerOptions}>
                      {question.answers.map((answer, answerIndex) => (
                        <div key={answerIndex} className={styles.answerOption}>
                          <label className={styles.radioLabel}>
                            <input
                              type="radio"
                              checked={
                                selectedAnswers[questionIndex] === answerIndex
                              }
                              onChange={() =>
                                handleCorrectAnswerChange(
                                  questionIndex,
                                  answerIndex
                                )
                              }
                              className={styles.radioButton}
                            />
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
                          </label>
                          {answerIndex >= 2 && (
                            <CloseIcon
                              onClick={() =>
                                handleRemoveAnswer(questionIndex, answerIndex)
                              }
                            />
                          )}
                        </div>
                      ))}
                      <div
                        className={styles.addAnswerBox}
                        onClick={() => handleAddAnswer(questionIndex)}
                      >
                        <AddIcon />
                        <h5>ADD ANSWER</h5>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className={styles.addQuestionContainer}
                  onClick={handleAddQuestion}
                >
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
                    }}
                  >
                    BACK
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      ...styledRectButton,
                      ...forestGreenButton,
                      width: "120px",
                      marginLeft: "30px",
                    }}
                  >
                    PUBLISH
                  </Button>
                </div>
              </form>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

export default TrainingQuizEditorPage;
