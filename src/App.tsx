import React, {useState} from 'react';
import QuestionCard from './components/QuestionCard';
import { fetchQuizQuestion } from './Api';
import { QuestionState,Difficulty } from './Api';
import { GlobalStyle } from './Appstyle';



export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}
const total_Questions = 5;
const App = () => {

  const [Loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswer, setUserAnswer] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  console.log(questions);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions =   await fetchQuizQuestion(total_Questions,Difficulty.EASY);

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswer([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      //user answer
      const answer = e.currentTarget.value;
      // Check
      const correct = questions[number].correct_answer === answer;
      //Score
      if(correct) setScore(prev => prev+1);
      //save
      const answerObject = {
        question : questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      };
      setUserAnswer(prev => [...prev, answerObject])
    }
  }

  const nextQuestion = () => {
    const nextQuestion = number + 1

    if(nextQuestion===total_Questions){
      setGameOver(true)
    }else
    setNumber(nextQuestion)
  }
  return (
    <>
        <h1>Quiz</h1>
        {gameOver || userAnswer.length === total_Questions ? (
          <button className='start' onClick={startTrivia}>Start</button>):
          null
        }
        
        {!gameOver ? <p className='score'>Score: {score}</p> : null }
        {Loading && <p>Loading Questions ...</p> }
        {!Loading && !gameOver && (
          <QuestionCard 
          questionNr={number + 1}
          totalQuestions={total_Questions}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswer ? userAnswer[number] : undefined}
          callback={checkAnswer}
        />
        )}
        {!gameOver && !Loading && userAnswer.length === number + 1 && 
        number !== total_Questions - 1 ? (
          <button className='next' onClick={nextQuestion}>Next Question</button>
        ) : null}
    </>
  );  
}

export default App;
