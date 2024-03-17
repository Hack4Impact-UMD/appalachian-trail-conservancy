import { LinearProgress, Button } from '@mui/material';
import styles from "./QuizResult.module.css";

const QuizResult = (props: { achievedScore: number; totalScore: number; passingScore: number; }) => {
    const { achievedScore, totalScore, passingScore } = props;
    const passed = achievedScore >= passingScore
    const scoredFull = achievedScore == totalScore

    return (
        <div className={styles.body}>
            <div className={styles.feedback}>
                {/* badge */}
                <div className={styles.imgContainer}>
                    <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
                </div>

                <div className={styles.feedbackRight}> 
                    {/* message about score */}
                    {scoredFull ? (
                        <h3>Perfect score, you passed!</h3>
                    ) : passed ? (
                        <h3>Nice job, you passed!</h3>
                    ) : (
                        <h3>You got this, try again!</h3>
                    )}

                    {/* score */}
                    <div className={styles.score}> 
                        <div className={styles.bigNum}>{achievedScore}</div> <div className={styles.smallNum}>/ {totalScore}</div>
                    </div>

                    {/* progress bar */}
                    <LinearProgress 
                        variant="determinate" 
                        value={achievedScore * 10} 
                        sx={{
                            height: 24, 
                            backgroundColor: "lightgray", 
                            borderRadius: 12,
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: "var(--forest-green)", 
                            },
                          }}
                    />
                </div>
                
            </div>
            
            {/* add quiz card here */}
            <div className={styles.quizCardPlaceholder}></div>

            {/* buttons */}
            <div className={styles.buttons}> 
                {passed ? (
                    <Button>Exit training</Button>
                ) : (
                    <div>
                        <Button>Exit training</Button>
                        <Button>Restart training</Button>
                        <Button>Retake quiz</Button>
                    </div> 
                )}
            </div>
            
        </div>
    );
}

export default QuizResult