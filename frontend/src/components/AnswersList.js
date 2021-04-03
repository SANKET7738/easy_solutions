import React from "react";

import Answers from "./Answers";
import "./AnswersList.css";
const AnswersList = ({ answers }) => {
  return (
    <div className="AnswersList">
      {answers.map((answer) => (
        <Answers
          answers={answer.answer}
          questions={answer.question}
          link={answer.url[0]}
        />
      ))}
    </div>
  );
};

export default AnswersList;
