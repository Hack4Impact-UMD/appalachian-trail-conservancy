import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./AdminTrainingQuizEditorPage.module.css";
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
import { updateTraining } from "../../backend/FirestoreCalls";
import { Quiz, TrainingID } from "../../types/TrainingType";

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionText: string;
  answers: Answer[];
}

function TrainingQuizEditorPage() {
  const location = useLocation();
  const training = location.state?.training as TrainingID | undefined; // Access training data and id
  const trainingId = training?.id || "";

  const [trainingData, setTrainingData] = useState<TrainingID | undefined>(
    training
  );

  const navigate = useNavigate();
  const [navigationBarOpen, setNavigationBarOpen] = useState(true);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);
  const [isEditMode, setIsEditMode] = useState<boolean>(
    training?.status !== "DRAFT"
  );

  const [questions, setQuestions] = useState<Question[]>([
    {
      questionText: "",
      answers: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);

  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([
    "N/A",
  ]);
  const [pointsToPass, setPointsToPass] = useState(0);
  const [maxPoints, setMaxPoints] = useState(questions.length);

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const isQuestionBlank = (question: Question) => {
    return (
      !question.questionText.trim() &&
      question.answers.every((answer) => !answer.text.trim())
    );
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
    if (training?.quiz) {
      setQuestions([
        ...training.quiz.questions.map((q) => ({
          questionText: q.question,
          answers: q.choices.map((choice) => ({
            text: choice,
            isCorrect: choice === q.answer, // Set `isCorrect` if this choice is the answer
          })),
        })),
        {
          questionText: "", // Add a blank question
          answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        },
      ]);

      // Map the correct answer indices
      const correctAnswers = training.quiz.questions.map((q) => q.answer);
      setSelectedAnswers([...correctAnswers, "N/A"]);
      setPointsToPass(training.quiz.passingScore || 0);
    }
  }, [training]);

  useEffect(() => {
    const numQuestions = questions.filter((q) => !isQuestionBlank(q)).length;
    setMaxPoints(numQuestions);
    if (pointsToPass > numQuestions) {
      setPointsToPass(numQuestions);
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
    setSelectedAnswers([...selectedAnswers, "N/A"]);
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
    const removedAnswerText =
      newQuestions[questionIndex].answers[answerIndex].text;

    // Update the selectedAnswers array
    const newSelectedAnswers = [...selectedAnswers];
    if (newSelectedAnswers[questionIndex] === removedAnswerText) {
      newSelectedAnswers[questionIndex] = null;
    }
    setSelectedAnswers(newSelectedAnswers);

    // Remove the answer from the question's answers
    newQuestions[questionIndex].answers = newQuestions[
      questionIndex
    ].answers.filter((_, i) => i !== answerIndex);
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (
    questionIndex: number,
    answerText: string
  ) => {
    const newQuestions = [...questions];

    // Update the answers with correct answer set
    newQuestions[questionIndex].answers = newQuestions[
      questionIndex
    ].answers.map((answer) => ({
      ...answer,
      isCorrect: answerText !== "" && answer.text === answerText,
    }));
    setQuestions(newQuestions);

    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = answerText;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handlePointsToPassChange = (event: any, value: number | null) => {
    if (value !== null && value <= maxPoints) {
      setPointsToPass(value);
    }
  };

  const validateFields = (qs: Question[]) => {
    for (let i = 0; i < qs.length; i++) {
      const question = qs[i];

      // Check that question text is filled out
      if (!question.questionText) {
        console.log(`Validation failed: Question ${i + 1} has no text.`);
        return false;
      }

      // Check that there's at least one answer with text
      const hasAnswers = question.answers.some(
        (answer) => answer.text.trim() !== ""
      );
      if (!hasAnswers) {
        console.log(
          `Validation failed: Question ${i + 1} has no answers with text.`
        );
        return false;
      }

      // Check that at least one answer is marked as correct
      const hasCorrectAnswer = question.answers.some(
        (answer) => answer.isCorrect
      );
      if (!hasCorrectAnswer) {
        console.log(
          `Validation failed: Question ${i + 1} has no correct answer selected.`
        );
        return false;
      }
    }

    // Ensure points to pass is greater than 0 and does not exceed total number of questions
    if (pointsToPass < 1 || pointsToPass > qs.length) {
      console.log(
        `Validation failed: Points to pass is invalid. Points to pass: ${pointsToPass}, Total questions: ${questions.length}`
      );
      return false;
    }

    console.log("Validation passed: All fields are properly filled.");
    return true; // All checks passed
  };

  const handleSaveClick = async () => {
    const nonBlankQuestions = questions.filter((q) => !isQuestionBlank(q));

    // Validate fields only if in edit mode
    if (isEditMode && !validateFields(nonBlankQuestions)) {
      setSnackbarMessage("Please complete all required fields.");
      setSnackbar(true);
      return;
    }

    const quizData = {
      numQuestions: nonBlankQuestions.length,
      passingScore: pointsToPass,
      questions: nonBlankQuestions.map((q) => ({
        question: q.questionText || "",
        choices: q.answers.map((a) => a.text || ""),
        answer: q.answers.find((a) => a.isCorrect)?.text || "",
      })),
    } as Quiz;

    const updatedTraining = {
      ...training,
      quiz: quizData,
    } as TrainingID;

    // Update the training in the database
    await updateTraining(updatedTraining, trainingId);
    setTrainingData(updatedTraining);
    setSnackbarMessage("Quiz saved successfully.");
    setSnackbar(true);
  };

  const handlePublishClick = async () => {
    // Filter out blank questions
    const nonBlankQuestions = questions.filter((q) => !isQuestionBlank(q));

    // Ensure valid fields before proceeding
    if (nonBlankQuestions.length === 0) {
      setSnackbarMessage("Please add at least one question.");
      setSnackbar(true);
      return;
    }

    // Validation: Ensure fields are filled
    if (!validateFields(nonBlankQuestions)) {
      setSnackbarMessage("Please complete all fields.");
      setSnackbar(true);
      return;
    }

    try {
      /* Check for duplicate training names in the backend
      const isDuplicate = await checkDuplicateTrainingName(training.name);
      if (isDuplicate) {
        setSnackbarMessage("Training with this name already exists.");
        setSnackbar(true);
        return;
      }*/

      // Prepare quiz data for publishing
      const quizData = {
        numQuestions: nonBlankQuestions.length,
        passingScore: pointsToPass,
        questions: nonBlankQuestions.map((q) => ({
          question: q.questionText,
          choices: q.answers.map((a) => a.text),
          answer: q.answers.find((a) => a.isCorrect)?.text || "",
        })),
      } as Quiz;

      const updatedTraining = {
        ...training,
        quiz: quizData,
        status: training?.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED",
      } as TrainingID;

      // Update Firestore with the published training
      await updateTraining(updatedTraining, trainingId);
      setSnackbarMessage("Training published successfully.");
      setSnackbar(true);
      navigate("/trainings"); // Redirect to training library
    } catch (error) {
      console.error("Error publishing training:", error);
      setSnackbarMessage("Error publishing training. Please try again.");
      setSnackbar(true);
    }
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
              <h1 className={styles.nameHeading}>Trainings Editor</h1>
              <ProfileIcon />
            </div>

            <form noValidate onSubmit={(e) => e.preventDefault()}>
              <Button
                sx={whiteButtonGrayBorder}
                variant="contained"
                onClick={handleSaveClick}>
                {isEditMode ? "Save" : "Save as Draft"}
              </Button>

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
                        value={selectedAnswers[questionIndex] || ""}
                        onChange={(e) => {
                          const answerText = e.target.value;
                          const answerIndex = question.answers.findIndex(
                            (answer) => answer.text === answerText
                          );
                          handleCorrectAnswerChange(
                            questionIndex,
                            e.target.value
                          );
                        }}>
                        {question.answers.map((answer, answerIndex) => (
                          <FormControlLabel
                            key={answerIndex}
                            value={answer.text}
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
                          {selectedAnswers[questionIndex]
                            ? question.answers.findIndex(
                                (answer) =>
                                  answer.text === selectedAnswers[questionIndex]
                              ) + 1 || "N/A"
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
                  }}
                  onClick={() => {
                    navigate("/trainings/editor", {
                      state: { training: trainingData },
                    });
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
                  }}
                  onClick={handlePublishClick}>
                  {isEditMode
                    ? training?.status === "PUBLISHED"
                      ? "ARCHIVE"
                      : "UNARCHIVE"
                    : "PUBLISH"}
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

export default TrainingQuizEditorPage;
