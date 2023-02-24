import React, { useState, useEffect } from 'react';
import Qentry from './qentry.jsx'
import Search from './search.jsx'
import QEntryModal from './qentrymodal.jsx'

function Qlist({ setQCount, qCount, product_id, questionList, setQuestionList, pullQuestions, product_name }) {

  // console.log("qlist now, what is props looks like :", { setQCount, qCount, product_id, questionList, setQuestionList, pullQuestions, product_name })

  const [searchTerm, setSearchTerm] = useState('');
  const [loadableQs, setLoadableQs] = useState(3);
  const [entryModalState, setEntryModalState] = useState(false);
  const [scrollHandler, setScrollHandler] = useState(null);
  const questionListRef = React.useRef(null);

  useEffect(() => {
    if (scrollHandler) {
      questionListRef.current.removeEventListener('scroll', scrollHandler);
    }
    const handleScroll = () => {
      if (questionListRef.current.scrollTop + questionListRef.current.clientHeight >= questionListRef.current.scrollHeight) {
        setLoadableQs(prevState => prevState + 2);
      }
    };
    questionListRef.current.addEventListener('scroll', handleScroll);
    setScrollHandler(handleScroll);
    return () => questionListRef.current.removeEventListener('scroll', handleScroll);
  }, [questionList]);

  const filteredQuestionList = questionList.filter((question) =>
    !searchTerm || question.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadableQsArray = filteredQuestionList.slice(0, loadableQs).map((question) =>
    <Qentry searchTerm={searchTerm} question={question} key={question.question_id} pullQuestions={pullQuestions} product_id={product_id} />
  );

  const clickAddQuestion = () => {
    setEntryModalState(true);
  };

  return (
    <div className="innerWrap">
      <QEntryModal show={entryModalState} product_id={product_id} setEntryModalState={setEntryModalState} pullQuestions={pullQuestions} product_name={product_name} />
      <h2>
        QUESTIONS & ANSWERS
      </h2>
      <Search questionList={questionList} setQuestionList={setQuestionList} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="questionList" ref={questionListRef}>
        {loadableQsArray}
      </div>
      <div className="qButtonDiv">
        <input className="qbutton" type="button" onClick={clickAddQuestion} value="ADD A QUESTION +" />
      </div>
    </div>
  );
}

export default Qlist;