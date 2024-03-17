import {LinearProgress, Button} from '@mui/material';

const QuizResult = (props: { achievedScore: number; totalScore: number; passingScore: number; }) => {
    const { achievedScore, totalScore, passingScore } = props;
    const passed = achievedScore >= passingScore
    const scoredFull = achievedScore == totalScore

    return (
        <div>
            {/* badge */}
            <img src="https://pyxis.nymag.com/v1/imgs/7aa/21a/c1de2c521f1519c6933fcf0d08e0a26fef-27-spongebob-squarepants.rsquare.w400.jpg" />
            
            {/* message about score */}
            {scoredFull ? (
                <h3>Perfect score, you passed!</h3>
            ) : passed ? (
                <h3>Nice job, you passed!</h3>
            ) : (
                <h3>You got this, try again!</h3>
            )}

            {/* score */}
            {achievedScore} / {totalScore} 

            {/* progress bar */}
            <LinearProgress variant="determinate" value={achievedScore * 10} />

            {/* add quiz card here */}

            {/* buttons */}
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
    );
}

export default QuizResult