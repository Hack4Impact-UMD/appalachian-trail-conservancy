import React, { useState, useEffect } from "react";
import styles from "./PathwayQuizEditorPage.module.css";
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
import {
  Unstable_NumberInput as NumberInput,
  numberInputClasses,
} from "@mui/base/Unstable_NumberInput";
import { styledRectButton } from "../LoginPage/LoginPage";
import { blue, grey } from "@mui/material/colors";

function PathwayQuizEditorPage() {
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
                <h1 className={styles.nameHeading}>Pathways Editor</h1>
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
                      marginRight: "0.5rem",
                      lineHeight: "1.5",
                    }}
                  >
                    POINTS TO PASS:
                  </Typography>

                  <NumberInput
                    slots={{
                      root: StyledInputRoot,
                      input: StyledInputElement,
                      incrementButton: StyledButton,
                      decrementButton: StyledButton,
                    }}
                    aria-label="Points to pass"
                    min={0}
                    max={maxPoints}
                    value={pointsToPass}
                    onChange={handlePointsToPassChange}
                  />

                  <Typography
                    variant="body2"
                    style={{
                      marginLeft: "1rem",
                      color: "black",
                      marginTop: "0",
                      lineHeight: "1.5",
                      fontWeight: "bold",
                    }}
                  >
                    / {maxPoints}
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

export default PathwayQuizEditorPage;
const StyledInputRoot = styled("div")(({ theme }) => ({
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontWeight: 400,
  borderRadius: "4px",
  color: theme.palette.mode === "dark" ? grey[300] : grey[900],
  background: theme.palette.mode === "dark" ? grey[900] : "#fff",
  border: `1px solid black`,

  boxShadow: `0px 2px 2px ${
    theme.palette.mode === "dark" ? grey[900] : grey[50]
  }`,
  display: "grid",
  gridTemplateColumns: "1fr 15px",
  gridTemplateRows: "1fr 1fr",
  overflow: "hidden",
  columnGap: "2px",
  padding: "2px",
  width: "3rem",
  height: "1.6rem",
  marginTop: "0",
  marginLeft: "1rem",
  alignItems: "center",
  boxSizing: "border-box",

  "&:focus-visible": {
    outline: 0,
  },
}));
const StyledInputElement = styled("input")(({ theme }) => ({
  fontSize: "0.9rem",
  fontFamily: "inherit",
  fontWeight: "bold",
  lineHeight: 1.5,
  gridColumn: "1/2",
  gridRow: "1/3",
  color: theme.palette.mode === "dark" ? grey[300] : grey[900],
  background: "inherit",
  border: "none",
  borderRadius: "inherit",
  padding: "2px 2px",
  outline: 0,
  width: "100%",
  height: "100%",
  textAlign: "center",
  boxSizing: "border-box",
}));

const StyledButton = styled("button")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 0,
  width: "10px",
  height: "10px",
  fontFamily: "system-ui, sans-serif",
  fontSize: "0.675rem",
  lineHeight: 1,
  background: grey[200],
  border: 0,
  color: grey[900],
  transition: "all 120ms cubic-bezier(0.4, 0, 0.2, 1)",
  boxSizing: "border-box",

  "&:hover": {
    background: grey[300],
    cursor: "pointer",
  },

  [`&.${numberInputClasses.incrementButton}`]: {
    gridColumn: "2",
    gridRow: "1",
    borderTopLeftRadius: "4px",
    borderTopRightRadius: "4px",
    border: "1px solid",
    borderBottom: 0,
    borderColor: grey[300],
    background: grey[200],
    color: grey[900],
    "&::before": {
      content: '"▲"',
    },
  },

  [`&.${numberInputClasses.decrementButton}`]: {
    gridColumn: "2",
    gridRow: "2",
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
    border: "1px solid",
    borderColor: grey[300],
    background: grey[200],
    color: grey[900],
    "&::before": {
      content: '"▼"',
    },
  },
}));
