import React, {Component} from 'react'

import classes from './Qiuz.scss'

import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'

import FinishedQuiz from '../../components/FinishedQiuz/FinishedQuiz'


class Quiz extends Component {
    state = {
        results: {}, // [id] : suc error
        activeQuestion: 0,
        answerState: null,
        isFinished: false,
        quiz: [
            {
                question: 'qwst - 1',
                rightAnswerId: 2,
                id: 1,
                answers: [
                    {text: 'answ 1', id: 1},
                    {text: 'answ 2', id: 2},
                    {text: 'answ 3', id: 3}
                ]
            },
            {
                question: 'qwst - 2',
                rightAnswerId: 3,
                id: 2,
                answers: [
                    {text: 'answ 2-1', id: 1},
                    {text: 'answ 2-2', id: 2},
                    {text: 'answ 2-3', id: 3}
                ]
            }
        ]
    }

    onAnswerHandler = (answerId) =>  {

        if (this.state.answerState) {
            const key = Object.keys(this.state.answerState)[0];
            if (this.state.answerState[key] === 'success') {
                return
            }
        }

        const question = this.state.quiz[this.state.activeQuestion];
        const results = this.state.results;

        if (question.rightAnswerId === answerId ) {
            if (!results[question.id]) {
                results[question.id] = 'success'
            }
            this.setState({
                answerState: {
                    [answerId]: 'success'
                }
            })
            const timeOut = window.setTimeout(() => {
                if(this.isQuizFinished()) {
                    this.setState({
                        isFinished: true
                    })
                } else {
                    this.setState( {
                        activeQuestion: this.state.activeQuestion + 1,
                        answerState: null
                    })
                }
                window.clearTimeout(timeOut)
            }, 1000)

        } else {
            results[question.id] = 'error';
            this.setState({
                answerState: {
                    [answerId]: 'error',
                    results
                }
            })
        }


    }
    isQuizFinished() {
        return this.state.activeQuestion + 1 === this.state.quiz.length
    }
    resState = () => {
        this.setState({
            activeQuestion: 0,
            answerState: null,
            isFinished: false,
        })
    }

    render() {
        return(
            <div className={classes.Quiz}>

                <div className={classes.QuizWrapper}>
                    <h1>Voprosik</h1>
                    {
                        this.state.isFinished
                        ? <FinishedQuiz
                            results={this.state.results}
                            quiz={this.state.quiz}
                            onRetry={this.resState}
                            />
                            : <ActiveQuiz
                                answersQuiz={this.state.quiz[this.state.activeQuestion].answers}
                                question={this.state.quiz[this.state.activeQuestion].question}
                                onAnswerClick={this.onAnswerHandler}
                                quizLength={this.state.quiz.length}
                                answerNumber={this.state.activeQuestion + 1}
                                state={this.state.answerState}
                            />
                    }

                </div>

            </div>
        )
    }
}

export default Quiz