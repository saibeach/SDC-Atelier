import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Qlist from './qlist.jsx'
import './questions.scss';

function Questions({ productID, product }) {
  // console.log("questions now, what is the props passing here? ", {productID, product})

  const [questionList, setQuestionList] = useState([]);
  const [qCount, setQCount] = useState(0);
  const product_id = 37719;
  const product_name = "fake";

  useEffect(() => {
    // console.log("first render?", product_id)
    axios.get(`/api/questions`, {
      params: {
        product_id: product_id,
        count: 100
      }

    })
      .then((results) => {
        // console.log("result sending back from db looks like :", results.data)
        const sortedByHelpfulness = results.data.sort((a, b) => b.helpful - a.helpful);

        setQCount(results.data.length);
        setQuestionList(sortedByHelpfulness);
        // console.log("after first render qcount :", qCount, "questionlist :", questionList);
      });


  }, []);

  const pullQuestions = () => {
    axios.get(`/api/questions`)
      .then((results) => {
        const sortedByHelpfulness = results.data.sort((a, b) => b.helpful - a.helpful);

        setQCount(results.data.length);
        setQuestionList(sortedByHelpfulness);

      });
  };
  // console.log("what is passing into qlist, ", questionList, product_id, product_name, qCount)
  return (
    <div className="outerWrap">
      <Qlist questionList={questionList} product_id={product_id} product_name={product_name} pullQuestions={pullQuestions} setQCount={setQCount} qCount={qCount} />
    </div>
  );
}

export default Questions;