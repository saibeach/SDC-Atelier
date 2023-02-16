import axios from 'axios'
import React, { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import Alist from './alist.jsx'

import AEntryModal from './aentrymodal.jsx'


function Qentry({ question, pullQuestions, product_name, searchTerm }) {

  console.log("Qentry modal now, passing in props looks like", { question, pullQuestions, product_name, searchTerm });

  const [cookies, setCookie, removeCookie] = useCookies(['helpfulQIDs']);
  const [helpfulness, setHelpfulness] = useState(question.helpful)
  const [entryModalState, setEntryModalState] = useState(false);
  const [reported, setReported] = useState(false);
  // handle the answers props from DB
  const [answers, setAnswers] = useState([]);


  useEffect(() => {

    axios.get(`/api/answers`, {
      params: {
        question_id: question.id,
      }

    })
      .then((results) => {
        console.log("result sending back from db looks like :", results.data)
        setAnswers(results.data);
      })
      .catch((error) => {
        console.log("db query fault!")
      })

  }, []);


  if (cookies.helpfulQIDs) {
    var cookieChecker = cookies.helpfulQIDs.includes(question.id);
  }


  const helpfulClick = () => {
    if (!cookieChecker) {

      axios.put(`/quesitonhelpful/`, {question_id: question.id}) //  Axios get on render. Pass id later.
        .then((results) => {
          if (!cookies.helpfulQIDs) {
            setCookie('helpfulQIDs', [question.id], { path: '/' });
            setHelpfulness(helpfulness + 1);
          } else if (!cookieChecker) {
            setCookie('helpfulQIDs', [...cookies.helpfulQIDs, question.id], { path: '/' });
            setHelpfulness(helpfulness + 1);
          }
        });
    } else {
      alert("You've already voted this helpful!");
    }
  };

  const clickAddAnswer = () => {
    setEntryModalState(true);
  };

  const reportQuestion = () => {
    axios.put(`/reportq`, {
      params: {
        question_id: question.id
      }
    })
    setReported(true);
  };

  console.log("props passing into Alist looks like :", answers)
  return (
    <div className="aListWrapper">
      <AEntryModal show={entryModalState} setEntryModalState={setEntryModalState} question={question} pullQuestions={pullQuestions} product_name={product_name} />
      <div className="oppositeInline">
        <span className="biggerBolder">
          Q: <span dangerouslySetInnerHTML={{ __html: question.body.replace(searchTerm, `<mark>${searchTerm}</mark>`)}} />
        </span>

        <span className="rightSideQ">
          Helpful?
          <span className="qHelpful" style={{ fontWeight: cookieChecker ? 'bold' : 'normal' }} onClick={helpfulClick} >
            Yes ({helpfulness})
          </span>
          |
          <span className="qAddA" onClick={clickAddAnswer}>
           Add Answer
          </span>
          |
          <span className="qAddA" onClick={reportQuestion}>
            {!reported && <span className="reportAnA" onClick={reportQuestion}>Report</span>}
            {reported && <span className="reportAnA" style={{ fontWeight: 'bold', cursor: 'default' }}>Reported</span>}
          </span>
        </span>
      </div>
      <Alist answers={answers}/>
    </div>
  );
}

export default Qentry;
