import React from "react";

const Answers = ({ answers, questions, link }) => {
  return (
    <div>
      <p>{answers}</p>
      <p>{questions}</p>
      <p>{link}</p>
    </div>
  );
};

export default Answers;
