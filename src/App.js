import React from 'react';
import './App.css';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner'
import { Container, Row, Col } from 'react-bootstrap';

function App() {
  const [imgpath, setImgpath] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
  const [label, setLabel] = useState(null);
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(false);

  const imageHandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImgpath(reader.result);
      }
    }
    sendImg(e.target.files[0])
    reader.readAsDataURL(e.target.files[0])
  }

  const sendImg = async (imageFile) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', imageFile)
    try {
      const data = await axios
        .post('https://rest-first-cat-classifier.herokuapp.com', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          console.log(res.data);
          setLabel(res.data.label);
          setProbability(res.data.probability);
          setLoading(false);
        })
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="App">
      <Container>
        <Row className="justify-content-center text-center">
          <Col>
              <h1 className="heading">Simple Deep Learning Cat Classifier</h1>
              <div className="img-holder">
                <img src={imgpath} alt="" />
              </div>
              <h3>
                {loading ? <Spinner animation="border" /> : <p>{label} {probability}</p>}
              </h3>
              <input type="file" accept="image/*" name="image-upload" onChange={imageHandler} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
