const QuizResult = (props: { achievedScore: number; totalScore: number; passingScore: number; }) => {
    const { achievedScore, totalScore, passingScore } = props;
    return (
        <div>
            {achievedScore} {totalScore} {passingScore}
        </div>
    );
}

export default QuizResult