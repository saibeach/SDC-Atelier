import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Qlist from './qlist.jsx'
import './questions.scss';
const redis = require("redis")
const client = redis.createClient();



function Questions({ productID, product }) {
  // console.log("questions now, what is the props passing here? ", {productID, product})

  const [questionList, setQuestionList] = useState([]);
  const [qCount, setQCount] = useState(0);
  const product_id = 37711;
  const product_name = "fake";

  const cacheKey = `questions:${product_id}`;

  useEffect(() => {
    client.get(cacheKey, (err, cachedData) => {
      if (cachedData !== null) {
        const parsedData = JSON.parse(cachedData);
        const sortedByHelpfulness = parsedData.sort((a, b) => b.helpful - a.helpful);

        setQCount(parsedData.length);
        setQuestionList(sortedByHelpfulness);
      } else {
        const url = `/api/questions?product_id=${productID}&count=999`;

        axios.get(url)
          .then(response => {
            const data = response.data;
            const sortedByHelpfulness = data.sort((a, b) => b.helpful - a.helpful);

            // Cache the API response in Redis for 5 minutes
            client.setex(cacheKey, 300, JSON.stringify(data));

            setQCount(data.length);
            setQuestionList(sortedByHelpfulness);
          });
      }
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