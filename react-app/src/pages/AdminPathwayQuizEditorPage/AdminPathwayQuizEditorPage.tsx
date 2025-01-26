import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./AdminPathwayQuizEditorPage.module.css";
import {
  Button,
  OutlinedInput,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Snackbar,
  Alert,
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
import AdminNavigationBar from "../../components/AdminNavigationBar/AdminNavigationBar";
import Footer from "../../components/Footer/Footer";
import ProfileIcon from "../../components/ProfileIcon/ProfileIcon";
import Hamburger from "../../assets/hamburger.svg";
import { PathwayID, Quiz, Status, Question } from "../../types/PathwayType";
import { updatePathway } from "../../backend/FirestoreCalls";

function PathwayQuizEditorPage() {
  const navigate = useNavigate();
  const [navigationBarOpen, setNavigationBarOpen] = useState(
    !(window.innerWidth < 1200)
  );
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  const location = useLocation();
  const [pathway, setPathway] = useState<PathwayID | undefined>(
    location.state?.pathway as PathwayID | undefined
  ); // Access pathway data and id
  const trainingId = pathway?.id || "";
  const status = pathway?.status || ("DRAFT" as Status);

  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      choices: ["", ""],
      answer: "---",
    },
  ]);

  const [pointsToPass, setPointsToPass] = useState(0);
  const [maxPoints, setMaxPoints] = useState(questions.length);
  const [errorQuestions, setErrorQuestions] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const renderMarker = () => {
    if (status === "DRAFT") {
      // Pathway drafted
      return (
        <div className={`${styles.marker} ${styles.draftMarker}`}>DRAFT</div>
      );
    } else if (status === "PUBLISHED") {
      // Pathway published
      return (
        <div className={`${styles.marker} ${styles.publishedMarker}`}>
          PUBLISHED
        </div>
      );
    } else if (status === "ARCHIVED") {
      // Pathway archived
      return (
        <div className={`${styles.marker} ${styles.archiveMarker}`}>
          ARCHIVE
        </div>
      );
    }
  };

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

  // Load existing quiz data when the page loads
  useEffect(() => {
    if (pathway?.quiz && pathway.quiz.numQuestions > 0) {
      setQuestions(pathway.quiz.questions);
      setPointsToPass(pathway.quiz.passingScore || 0);
    }
  }, [pathway]);

  useEffect(() => {
    const numQuestions = questions.length;
    setMaxPoints(numQuestions);
    if (pointsToPass > numQuestions) {
      setPointsToPass(numQuestions);
    }
  }, [questions, pointsToPass]);

  const handleQuestionChange = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].question = text;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        choices: ["", ""],
        answer: "---",
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (index > 0) {
      const newQuestions = questions.filter((_, i) => i !== index);
      setQuestions(newQuestions);

      // update list of questions with errors
      if (errorQuestions.length !== 0) {
        const newErrorQuestions = errorQuestions
          .filter((errorIndex) => errorIndex !== index)
          .map((errorIndex) =>
            errorIndex > index ? errorIndex - 1 : errorIndex
          );
        setErrorQuestions(newErrorQuestions);
      }
    }
  };

  const handleChoiceChange = (
    questionIndex: number,
    choiceIndex: number,
    text: string
  ) => {
    const newQuestions = [...questions];

    // Update the correct answer if the answer choice is changed
    const answerIndex = newQuestions[questionIndex].choices.findIndex(
      (choice) => choice === newQuestions[questionIndex].answer
    );
    if (answerIndex === choiceIndex) {
      newQuestions[questionIndex].answer = text;
    }

    // Update the answer choice
    newQuestions[questionIndex].choices[choiceIndex] = text;
    setQuestions(newQuestions);
  };

  const handleAddChoice = (questionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choices.push("");
    setQuestions(newQuestions);
  };

  const handleRemoveChoice = (questionIndex: number, choiceIndex: number) => {
    const newQuestions = [...questions];

    // Remove the answer if the answer choice is removed
    const answerIndex = newQuestions[questionIndex].choices.findIndex(
      (choice) => choice === newQuestions[questionIndex].answer
    );
    if (answerIndex === choiceIndex) {
      newQuestions[questionIndex].answer = "---";
    }

    // Remove the answer from the question's answers
    newQuestions[questionIndex].choices = newQuestions[
      questionIndex
    ].choices.filter((_, i) => i !== choiceIndex);
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerText: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].answer = answerText;
    setQuestions(newQuestions);
  };

  const handlePointsToPassChange = (event: any, value: number | null) => {
    if (value !== null && value <= maxPoints) {
      setPointsToPass(value);
    }
  };

  const validateFields = (qs: Question[]) => {
    const newErrorQuestions: number[] = [];
    for (let i = 0; i < qs.length; i++) {
      const question = qs[i];

      // Check that question text is filled out
      if (!question.question) {
        newErrorQuestions.push(i);
        // Question ${i + 1} has no text.
      }

      // Check that all choices contain text
      const hasChoices = question.choices.every(
        (choice) => choice.trim() !== ""
      );
      if (!hasChoices) {
        newErrorQuestions.push(i);
        // Question ${i + 1} has no choices with text.
      }

      // Check that at least one answer is marked as correct
      const hasCorrectAnswer = question.answer === "---" ? false : true;
      if (!hasCorrectAnswer) {
        if (!question.choices.some((choice) => choice.trim() === "---")) {
          newErrorQuestions.push(i);
          // Question ${i + 1} has no correct answer selected.
        }
      }
    }

    setErrorQuestions(newErrorQuestions);
    if (newErrorQuestions.length > 0) {
      setSnackbarMessage(
        "Please complete all fields and ensure a correct answer is selected for each question."
      );
      return false;
    }

    // Ensure points to pass is positive and does not exceed total number of questions
    if (pointsToPass < 0 || pointsToPass > qs.length) {
      setSnackbarMessage("Points to pass is invalid.");
      return false;
    }

    return true; // All checks passed
  };

  // changeStatus: true if the status should be updated, false if saving as current status
  const handleSavePathway = async (changeStatus: boolean) => {
    setLoading(true);
    // Validation: Ensure fields are filled
    if (!validateFields(questions)) {
      setLoading(false);
      setSnackbar(true);
      return;
    }

    const quizData = {
      numQuestions: questions.length,
      passingScore: pointsToPass,
      questions: questions,
    } as Quiz;

    let newStatus = status;

    if (changeStatus) {
      // update status if needed
      newStatus =
        status === "DRAFT"
          ? "PUBLISHED"
          : status === "PUBLISHED"
          ? "ARCHIVED"
          : "PUBLISHED";
    }

    const updatedPathway = {
      ...pathway,
      quiz: quizData,
      status: newStatus,
    } as PathwayID;

    // Update the pathway in the database
    updatePathway(updatedPathway, trainingId)
      .then(() => {
        setLoading(false);
        setPathway(updatedPathway);
        setSnackbarMessage("Pathway updated successfully.");
        setSnackbar(true);
        if (changeStatus) {
          navigate("/pathways", {
            state: { fromUpdate: true, showSnackbar: true }, //use state to pass that it should show snackbar
          }); // Redirect to pathway library
        }
      })
      .catch((error) => {
        setLoading(false);
        setSnackbarMessage("Error updating pathway. Please try again.");
        setSnackbar(true);
      });
  };

  // Snackbar close handler
  const handleCloseSnackbar = () => setSnackbar(false);

  return (
    <>
      <AdminNavigationBar
        open={navigationBarOpen}
        setOpen={setNavigationBarOpen}
      />
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
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <h1 className={styles.nameHeading}>Pathway Editor</h1>
                <div>{renderMarker()}</div>
              </div>
              <div className={styles.profileIcon}>
                <ProfileIcon />
              </div>
            </div>

            <form noValidate onSubmit={(e) => e.preventDefault()}>
              <Button
                sx={whiteButtonGrayBorder}
                variant="contained"
                onClick={() => handleSavePathway(false)}
                disabled={loading}>
                {status === "DRAFT" ? "Save as Draft" : "Save"}
              </Button>

              <h2 className={styles.quizEditorText}>CREATE QUIZ</h2>

              {/* Points to Pass */}
              <div className={styles.pointsContainer}>
                <span className={styles.quizEditorText}>POINTS TO PASS:</span>
                {status === "DRAFT" && (
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
                )}
                <span
                  className={`${styles.quizEditorText} ${styles.leftMargin}`}>
                  {status !== "DRAFT" ? pointsToPass : ""} / {maxPoints}
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
                      sx={{
                        ...grayBorderTextField,
                        minHeight: 90,
                        border: errorQuestions.includes(questionIndex)
                          ? "2px solid var(--hazard-red)"
                          : "2px solid var(--blue-gray)",
                        "& .MuiOutlinedInput-input": {
                          padding: "0",
                        },
                      }}
                      placeholder="QUESTION"
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(questionIndex, e.target.value)
                      }
                      className={styles.questionBox}
                      multiline
                      rows={3}
                    />
                    {questionIndex > 0 && status === "DRAFT" ? (
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
                        value={questions[questionIndex].answer || "---"}
                        onChange={(e) => {
                          handleCorrectAnswerChange(
                            questionIndex,
                            e.target.value
                          );
                        }}>
                        {question.choices.map((choice, choiceIndex) => (
                          <FormControlLabel
                            key={choiceIndex}
                            value={choice}
                            control={<Radio sx={grayGreenRadioButton} />}
                            label={
                              <div className={styles.answerOption}>
                                <OutlinedInput
                                  sx={{
                                    ...grayBorderTextField,
                                    minHeight: 70,
                                    margin: "5px 0",
                                    border: errorQuestions.includes(
                                      questionIndex
                                    )
                                      ? "2px solid var(--hazard-red)"
                                      : "2px solid var(--blue-gray)",
                                    "& .MuiOutlinedInput-input": {
                                      padding: "0",
                                    },
                                  }}
                                  value={choice}
                                  placeholder="ANSWER"
                                  onChange={(e) =>
                                    handleChoiceChange(
                                      questionIndex,
                                      choiceIndex,
                                      e.target.value
                                    )
                                  }
                                  className={styles.answerBox}
                                  multiline
                                  rows={2}
                                />
                                {choiceIndex >= 2 && (
                                  <div className={styles.closeIcon}>
                                    <IoCloseOutline
                                      onClick={() =>
                                        handleRemoveChoice(
                                          questionIndex,
                                          choiceIndex
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
                        onClick={() => handleAddChoice(questionIndex)}>
                        <AddIcon />
                        <h5>ADD ANSWER CHOICE</h5>
                      </div>
                      <div className={styles.selectedAnswerBox}>
                        <span className={styles.selectedAnswerText}>
                          ANSWER:{" "}
                          {questions[questionIndex].answer
                            ? question.choices.findIndex(
                                (choice) =>
                                  choice === questions[questionIndex].answer
                              ) + 1 || "N/A"
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Question Button */}
              {status === "DRAFT" && (
                <div
                  className={styles.addQuestionContainer}
                  onClick={handleAddQuestion}>
                  <AddIcon fontSize="large" />
                  <h2>ADD QUESTION</h2>
                </div>
              )}

              {/* Button group */}
              <div className={styles.buttonsContainer}>
                <Button
                  variant="contained"
                  sx={{
                    ...styledRectButton,
                    ...whiteButtonGrayBorder,
                    width: "120px",
                  }}
                  onClick={() => {
                    navigate("/pathways/editor", {
                      state: { pathway: pathway },
                    });
                  }}
                  disabled={loading}>
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
                  onClick={() => handleSavePathway(true)}
                  disabled={loading}>
                  {status === "DRAFT"
                    ? "PUBLISH"
                    : status === "PUBLISHED"
                    ? "ARCHIVE"
                    : "UNARCHIVE"}
                </Button>
              </div>
            </form>
          </div>
        </div>
        {/* Snackbar wrapper container */}
        <div className={styles.snackbarContainer}>
          <Snackbar
            open={snackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={
                snackbarMessage.includes("successfully") ? "success" : "error"
              }>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>

        <Footer />
      </div>
    </>
  );
}

export default PathwayQuizEditorPage;
