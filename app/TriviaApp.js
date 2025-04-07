"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Home, ChevronLeft, ChevronRight } from "lucide-react"
import { questions, getRandomQuestions, shuffleOptions } from "./questions"
import { cn } from "@/lib/utils" // Import cn function

const difficultySettings = {
  easy: { questions: 10, label: "Fácil", color: "bg-emerald-500 hover:bg-emerald-600" },
  normal: { questions: 20, label: "Normal", color: "bg-amber-500 hover:bg-amber-600" },
  hard: { questions: 30, label: "Difícil", color: "bg-rose-500 hover:bg-rose-600" },
}

export default function TriviaApp() {
  const [mode, setMode] = useState("menu")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [jumpToQuestion, setJumpToQuestion] = useState("")
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [shuffledOptions, setShuffledOptions] = useState([])
  const [score, setScore] = useState(0)
  const [wrongAnswers, setWrongAnswers] = useState([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [examFinished, setExamFinished] = useState(false)
  const [difficulty, setDifficulty] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [sequentialAnswers, setSequentialAnswers] = useState([])

  const startPracticeMode = () => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5)
    setShuffledQuestions(shuffled)
    setShuffledOptions(shuffleOptions(shuffled[0]))
    setMode("practice")
    resetState()
  }

  const startExamMode = () => {
    const shuffled = getRandomQuestions(80)
    setShuffledQuestions(shuffled)
    setShuffledOptions(shuffleOptions(shuffled[0]))
    setMode("exam")
    resetState()
  }

  const startQuickTest = (selectedDifficulty) => {
    const numQuestions = difficultySettings[selectedDifficulty].questions
    const shuffled = getRandomQuestions(numQuestions)
    setShuffledQuestions(shuffled)
    setShuffledOptions(shuffleOptions(shuffled[0]))
    setMode("quickTest")
    setDifficulty(selectedDifficulty)
    resetState()
  }

  const startSequentialMode = () => {
    setShuffledQuestions(questions)
    setShuffledOptions(shuffleOptions(questions[0]))
    setMode("sequential")
    resetState()
    setSequentialAnswers(new Array(questions.length).fill(null))
  }

  const resetState = () => {
    setCurrentQuestion(0)
    setScore(0)
    setWrongAnswers([])
    setShowExplanation(false)
    setExamFinished(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setSequentialAnswers([])
  }

  const handleAnswer = (selectedIndex) => {
    const currentQ = shuffledQuestions[currentQuestion]
    const selectedAnswer = shuffledOptions[selectedIndex]
    const correctAnswer = currentQ.options[currentQ.correct]
    const isCorrect = selectedAnswer === correctAnswer

    setSelectedAnswer(selectedAnswer)
    setIsCorrect(isCorrect)
    setShowExplanation(true)

    if (isCorrect) {
      setScore((prev) => prev + 1)
    } else {
      setWrongAnswers((prev) => [
        ...prev,
        {
          question: currentQ.question,
          wrongAnswer: selectedAnswer,
          correctAnswer: correctAnswer,
          explanation: currentQ.explanation,
        },
      ])
    }
  }

  const nextQuestion = () => {
    const nextQuestionIndex = currentQuestion + 1
    if (nextQuestionIndex < shuffledQuestions.length) {
      setCurrentQuestion(nextQuestionIndex)
      setShuffledOptions(shuffleOptions(shuffledQuestions[nextQuestionIndex]))
      setShowExplanation(false)
      setSelectedAnswer(null)
      setIsCorrect(null)
    } else {
      setExamFinished(true)
    }
  }

  const jumpToSpecificQuestion = () => {
    const questionNumber = Number.parseInt(jumpToQuestion) - 1
    if (!isNaN(questionNumber) && questionNumber >= 0 && questionNumber < shuffledQuestions.length) {
      setCurrentQuestion(questionNumber)
      setShuffledOptions(shuffleOptions(shuffledQuestions[questionNumber]))
      setShowExplanation(false)
      setSelectedAnswer(null)
      setIsCorrect(null)
    } else {
      alert("Número de pregunta inválido.")
    }
    setJumpToQuestion("")
  }

  const handleSequentialAnswer = (selectedAnswer) => {
    const currentQ = shuffledQuestions[currentQuestion]
    const isCorrect = selectedAnswer === currentQ.options[currentQ.correct]

    setSequentialAnswers((prev) => {
      const newAnswers = [...prev]
      newAnswers[currentQuestion] = selectedAnswer
      return newAnswers
    })

    setIsCorrect(isCorrect)
    setShowExplanation(true)

    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
      setShuffledOptions(shuffleOptions(shuffledQuestions[currentQuestion - 1]))
    }
  }

  const finishSequentialMode = () => {
    const wrongAnswers = shuffledQuestions.reduce((acc, question, index) => {
      if (sequentialAnswers[index] !== question.options[question.correct]) {
        acc.push({
          question: question.question,
          wrongAnswer: sequentialAnswers[index],
          correctAnswer: question.options[question.correct],
          explanation: question.explanation,
        })
      }
      return acc
    }, [])

    setWrongAnswers(wrongAnswers)
    setExamFinished(true)
  }

  if (mode === "menu") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-8 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-blue-800 font-bold">Trivia de Veterinaria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              className="w-full text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
              onClick={startPracticeMode}
            >
              Modo Práctica
            </Button>
            <Button
              className="w-full text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white"
              onClick={startExamMode}
            >
              Modo Examen
            </Button>
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-center text-gray-800">Test Rápido</h3>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(difficultySettings).map(([key, { label, color }]) => (
                  <Button
                    key={key}
                    className={cn("font-semibold text-white", color)}
                    onClick={() => startQuickTest(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
            <Button
              className="w-full text-lg font-semibold bg-green-600 hover:bg-green-700 text-white"
              onClick={startSequentialMode}
            >
              Modo Secuencial
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (examFinished) {
    const percentage = (score / shuffledQuestions.length) * 100
    const modeTitle =
      mode === "quickTest"
        ? `Test Rápido - ${difficultySettings[difficulty].label}`
        : mode === "sequential"
          ? "Resultados del Modo Secuencial"
          : "Resultados del Examen"

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-4 sm:p-8 flex items-center justify-center">
        <Card className="w-full max-w-[95vw] sm:max-w-4xl bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-800 font-bold">{modeTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-2xl text-gray-800 font-bold">
                Puntuación: {score}/{shuffledQuestions.length}
              </p>
              <p className="text-xl text-gray-700">Porcentaje de aciertos: {percentage.toFixed(2)}%</p>
            </div>

            <div className="space-y-4 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800">Respuestas Incorrectas:</h3>
              {wrongAnswers.map((wrong, index) => (
                <Card key={index} className="p-4 bg-red-50 border border-red-200">
                  <p className="font-medium text-gray-800">{wrong.question}</p>
                  <p className="text-red-600">Tu respuesta: {wrong.wrongAnswer}</p>
                  <p className="text-green-600">Respuesta correcta: {wrong.correctAnswer}</p>
                  <p className="text-gray-700 mt-2">{wrong.explanation}</p>
                </Card>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={() => setMode("menu")}
            >
              <Home className="mr-2 h-5 w-5" />
              Volver al Menú
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const currentQ = shuffledQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-2 sm:p-4 md:p-8 flex items-start sm:items-center justify-center">
      <Card className="w-full max-w-[95vw] sm:max-w-2xl bg-white/80 backdrop-blur-sm shadow-xl">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 border-b">
          <CardTitle className="text-lg sm:text-xl text-blue-800 font-bold text-center sm:text-left">
            {mode === "practice"
              ? "Modo Práctica"
              : mode === "quickTest"
                ? `Test Rápido - ${difficultySettings[difficulty].label}`
                : mode === "sequential"
                  ? "Modo Secuencial"
                  : "Modo Examen"}
            <span className="block text-sm font-normal text-gray-600 mt-1">
              Pregunta {currentQuestion + 1}/{shuffledQuestions.length}
            </span>
          </CardTitle>
          <Button variant="outline" onClick={() => setMode("menu")} className="w-full sm:w-auto">
            <Home className="h-5 w-5 text-gray-800 mr-2" />
            <span className="sm:hidden">Volver al Menú</span>
          </Button>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <div className="space-y-6 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
            <p className="text-lg text-gray-800 font-medium mb-4">{currentQ.question}</p>

            {!showExplanation ? (
              <div className="space-y-4">
                {shuffledOptions.map((option, index) => (
                  <Button
                    key={index}
                    className={cn(
                      "w-full text-left justify-start text-gray-700 bg-white hover:bg-gray-100 transition-colors p-4 h-auto whitespace-normal break-words",
                      "border border-gray-300 rounded-lg shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    )}
                    onClick={() => (mode === "sequential" ? handleSequentialAnswer(option) : handleAnswer(index))}
                  >
                    <span className="inline-block">{option}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  className={cn(
                    "p-4 rounded-lg",
                    isCorrect ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300",
                  )}
                >
                  <p className={cn("font-medium", isCorrect ? "text-green-700" : "text-red-700")}>
                    {isCorrect ? "¡Respuesta Correcta!" : "Respuesta Incorrecta"}
                  </p>
                  {!isCorrect && (
                    <p className="text-green-700 mt-2">Respuesta correcta: {currentQ.options[currentQ.correct]}</p>
                  )}
                  <p className="mt-2 text-gray-700">{currentQ.explanation}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 border-t pt-4">
          <div className="flex justify-between sm:justify-start space-x-4 w-full sm:w-auto">
            <Button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1 sm:flex-none"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            {showExplanation && (
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex-1 sm:flex-none"
                onClick={nextQuestion}
              >
                Siguiente <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input
              type="number"
              value={jumpToQuestion}
              onChange={(e) => setJumpToQuestion(e.target.value)}
              placeholder="Nº pregunta"
              className="border rounded-md p-2 w-24 text-sm"
            />
            <Button onClick={jumpToSpecificQuestion} className="bg-green-600 hover:bg-green-700 text-white">
              Ir a Pregunta
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

