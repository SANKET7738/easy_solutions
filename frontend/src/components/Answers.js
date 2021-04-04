import React from "react";

import "./Answers.css";
const Answers = ({ answers, questions, link }) => {
  return (
    <div className="Answers">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{questions}</h5>
          <p className="card-text">{answers}</p>
          <a href={link} className="btn btn-dark linkBtn" target="_blank">
            read more
          </a>
        </div>
      </div>
    </div>
  );
};

export default Answers;
