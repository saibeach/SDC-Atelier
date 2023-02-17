import Moment from 'moment';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import React, { useState, useEffect } from 'react';
import ImageModal from './picturemodal.jsx'

function Aentry({ answer }) {
  // console.log("now in aentry component, what the props looks like ", answer)

  const [cookies, setCookie] = useCookies(['helpfulQIDs']);
  const [helpfulness, setHelpfulness] = useState(answer.helpful);
  const [imageModalState, setImageModalState] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [reported, setReported] = useState(false);
  const hasVoted = cookies.helpfulQIDs?.includes(answer.id);

  const [photos, setPhotos] = useState([]);

  // console.log("cookies before click looks like :", cookies);

  useEffect(() => {
    axios.get('/api/answer_photos', {
      params: {
        answer_id: answer.id
      }
    })
      .then((result) => {
        // console.log("what is the url return looks like :", result);
        setPhotos(result.data)
      })
      .catch((error) => {
        console.log("error when fetch photos")
      })
  },[])

  // console.log("what is the photo array looks like :", photos);


  const handleHelpfulClick = () => {
    if (!hasVoted) {
      axios.put('/answerhelpful', { answer_id: answer.id })
        .then(() => {
          setCookie('helpfulQIDs');
          setHelpfulness(helpfulness + 1);
        });
    } else {
      alert("You've already voted this helpful!");
    }
  };

  const handleReportAnswer = () => {
    axios.put(`/reporta`, {
      params: {
        answer_id: answer.id
      }
    });
    setReported(true);
  };

  const handleShowImageModal = (e) => {
    setImageModalState(true);
    setModalImage(e.target.currentSrc);
  };

  return (
    <div className="aListEntry">
      <ImageModal show={imageModalState} url={modalImage} setImageModalState={setImageModalState} />
      <b>A: </b>
      {answer.body}
      <div>
        {photos?.map((item, index) => (
          <img src={item.url} key={index} className="croppedPic" onClick={handleShowImageModal} />
        ))}
      </div>
      <p className="smallText">
        by {answer.answerer_name === 'Seller' ? <b>Seller</b> : answer.answerer_name}, {Moment.utc(answer.date).format("MMM Do, YYYY")} | Helpful?
        <span className="qHelpful" onClick={handleHelpfulClick} style={{ fontWeight: hasVoted ? 'bold' : 'normal' }} >
          Yes ({helpfulness})
        </span>
        |
        {!reported ? (
          <span className="reportAnA" onClick={handleReportAnswer}>Report</span>
        ) : (
          <span className="reportAnA" style={{ fontWeight: 'bold', cursor: 'default' }}>Reported</span>
        )}
      </p>
    </div>
  );
};

export default Aentry;