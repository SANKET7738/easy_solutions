import React from "react";

import Answers from "./Answers";
const AnswersList = ({ answers }) => {
  return (
    <div className="Answers">
      {answers.map((answer) => (
        <Answers
          answers={answer.answer}
          questions={answer.questions}
          link={answer.url[0]}
        />
      ))}
    </div>
  );
};

export default AnswersList;
