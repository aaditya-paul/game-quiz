"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/quiz");

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // Check data structure
        if (!data.questions || !Array.isArray(data.questions)) {
          throw new Error("Invalid data format received from API");
        }

        setQuestions(data.questions);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setQuizCompleted(true);
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error)
    return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-4 flex justify-center items-center min-h-screen ">
      {!quizCompleted ? (
        <Card className="shadow-xl pt-5">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">
              {questions[currentQuestionIndex].description}
              {/* {console.log(questions)} */}
            </h2>
            <div className="space-y-2">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    handleAnswer(option.is_correct);
                    // console.log(option.is_correct);
                  }}
                  className="w-full"
                >
                  {option.description}
                </Button>
              ))}
            </div>
            <Progress
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              className="mt-4"
            />
          </CardContent>
        </Card>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-300">Quiz Completed!</h2>
          <p className="text-xl mt-2 text-gray-300">
            Your Score: {score} / {questions.length}
          </p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Restart Quiz
          </Button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
