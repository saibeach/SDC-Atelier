import React, { useState, useEffect } from "react";
import axios from 'axios';

function Modal({ question, show, setEntryModalState, pullQuestions, product_name }) {
  // console.log("is the question id passed ?", question)
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [answer, setAnswer] = useState('');
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [answerAlert, setAnswerAlert] = useState(false);
  const [nicknameAlert, setNicknameAlert] = useState(false);
  const [emailAlert, setEmailAlert] = useState(false);

  useEffect(() => {
    if (images.length < 1) return;
    const newImageUrls = [];
    images.forEach((image) => newImageUrls.push(URL.createObjectURL(image)));
    setImageUrls(newImageUrls);
  }, [images]);

  if (!show) { return null; }

  const closeModal = () => {
    setImages([]);
    setImageUrls([]);
    setAnswer('');
    setEmail('');
    setNickname('');
    setEntryModalState(false);
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const imageChange = (e) => {
    if (e.target.files.length > 5) {
      alert('Maximum of 5 files');
      e.target.value = '';
    } else {
      setImages([...images, ...e.target.files]);
    }
  };

  const onChange = (e) => { // Generic onChange function that handles all state based on form names.
    e.target.name === 'answer' && setAnswer(e.target.value)
    e.target.name === 'nickname' && setNickname(e.target.value)
    e.target.name === 'email' && setEmail(e.target.value)
  };

  const submitAnswer = () => {
    if (!nickname || !email || !answer || !isValidEmail(email)) {
      !nickname ? setNicknameAlert(true) : setNicknameAlert(false)
      !email || !isValidEmail(email) ? setEmailAlert(true) : setEmailAlert(false)
      !answer ? setAnswerAlert(true) : setAnswerAlert(false)
    } else {
      axios.post(`/addanswer`, {
        question_id:question.id,
        nickname,
        answer,
        email,
      })
        .then((results) => {
          closeModal();
          pullQuestions();
        });
    }
  };

  return (
    <div className="modalEntry">
      <span onClick={closeModal} className="modalButton"> X </span>
      <div className="modalTitle">
        Submit your Answer<br /><br />
        {product_name}: {question.question_body}
      </div>
      <div className="addAnswerEntry">
        {answerAlert && <span className="errorText"> You must enter the following : </span>}
        Answer: <textarea className="answerEntry" name="answer" onChange={onChange} placeholder="Your answer..." />
        {nicknameAlert && <span className="errorText"> You must enter the following : </span>}
        Nickname : <input className="answerEntry" name="nickname" onChange={onChange} placeholder="Example: jack543!" />
        <p className="warningInputText">For privacy reasons, do not use your full name or email address.</p>
        {emailAlert && <span className="errorText"> You must enter the valid following : </span>}
        E-mail : <input className="answerEntry" name="email" onChange={onChange} placeholder="Example: jack@email.com" />
        <p className="warningInputText">For authentication reasons, you will not be emailed.</p>
        <div className="photoThumbDiv">
          {imageUrls.map((url) => { return <img src={url} className="croppedUpload" alt="upload thumb" />; })}
        </div>
        {images.length < 5
        && (
        <div className="selectPhotoButton">
          <label htmlFor="files" className="ebutton">SELECT PHOTOS</label>
        </div>
        )}
        <input style={{visibility: 'hidden'}} id="files" type="file" multiple accept="image/*" onChange={imageChange} />
        <input className="ebutton" type="button" value="SUBMIT ANSWER" onClick={submitAnswer} />
      </div>
    </div>
  );
}

export default Modal;
