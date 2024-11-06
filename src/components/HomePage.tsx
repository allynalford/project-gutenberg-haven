import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, FloatingLabel, Badge, Col, Row } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import './DisplayText.css';
import Book from '../interfaces/IBook';


const HomePage: React.FC = () => {
  const [bookId, setBookId] = useState('');
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState('');
  const [disableLookup, setDisableLookup] = useState<boolean>(false);
  const [analyze, setAnalyze] = useState<boolean>(true);
  const [analyzed, setAnalyzed] = useState<string>("");
  const [analyzedType, setAnalyzedType] = useState<string>("");
  const [viewedBooks, setViewedBooks] = useState([]);
  const [buttonTxt, setButtonTxt] = useState<string>("Fetch Book");

  // Fetch saved books from local storage on component mount
  useEffect(() => {
    const viewed = viewViewedBooks();
    if(viewed){
      setViewedBooks(viewed);
    }
  }, [analyzed, book, analyze]);

  function removeAsterisksText(input: string) {
    return input.replace(/\*\*\*.*?\*\*\*/g, '');
  }

  function formatTextForReactUI(text: string): JSX.Element[] {
    // Split the text into paragraphs by detecting multiple line breaks
    const paragraphs = text.split(/\r\n\s*\r\n/);
  
    // Map each paragraph to a JSX element with <br /> for single line breaks
    return paragraphs.map((paragraph, index) => (
      <p key={index}>
        {paragraph.split(/\r\n/).map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </p>
    ));
  }
  
  // Fetch book data from Project Gutenberg API
  const fetchBookData = async (urlSuffix: string, type: string, dataKey: string) => {
    if (!bookId) {
      setError('Please enter a valid book ID.');
      return;
    }
  
    try {
      setAnalyze(true);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}${urlSuffix}${bookId}`);
      const result = response.data[dataKey];
      
      setAnalyzedType(type);
      setAnalyzed(result);
      setError('');
      setAnalyze(false);
    } catch (err: any) {
      console.error(err.message);
      setAnalyze(false);
      setError(`Failed to ${type.toLowerCase()} for the book.`);
    }
  };
  
  const fetchBook = async () => {
    if (!bookId) {
      setError('Please enter a valid book ID.');
      return;
    }
  
    try {
      setError('');
      setAnalyze(true);
      setDisableLookup(true);
      setButtonTxt("Loading...");
      const response = await axios.get(`${process.env.REACT_APP_API_URL}book/${bookId}`);
      const { title, author, textContent } = response.data;
      const fetchedBook: Book = { id: bookId, title, author, textContent };
  
      // Update the viewed books list in local storage
      updateViewedBooks(bookId, title, author);
  
      setBook(fetchedBook);
      setAnalyze(false);
      setAnalyzed('');
      setAnalyzedType('');
      setDisableLookup(false);
      setButtonTxt("Fetch Book");
    } catch (err: any) {
      console.error(err.message);
      setAnalyze(false);
      setError('Failed to fetch book data. Please check the ID and try again.');
      setDisableLookup(false);
      setButtonTxt("Fetch Book");
      setBook(null);
    }
  };
  
  // Helper function to update the viewed books list in local storage
  const updateViewedBooks = (bookId: string, title: string, author: string) => {
    const viewedBooks = JSON.parse(localStorage.getItem('viewedBooks') || '[]');
    // Check if the book is already in the viewed list
    const isBookAlreadyViewed = viewedBooks.some((book: { id: string }) => book.id === bookId);
  
    if (!isBookAlreadyViewed) {
      viewedBooks.push({ id: bookId, title, author});
      localStorage.setItem('viewedBooks', JSON.stringify(viewedBooks));
    }
  };
  
  // Function to view the list of viewed books from local storage
  const viewViewedBooks = () => {
    const viewedBooks = JSON.parse(localStorage.getItem('viewedBooks') || '[]');
    return viewedBooks;
  };
  
  // Specific Analysis Functions
  const analyzeCharacters = () => fetchBookData('analyze-characters/', 'Characters', 'characters');
  const analyzeSentiment = () => fetchBookData('analyze-sentiment/', 'Sentiment', 'sentiment');
  const detectLanguage = () => fetchBookData('detect-language/', 'Language', 'language');
  const extractThemes = () => fetchBookData('extract-themes/', 'Themes', 'themes');
  const summarizePlot = () => fetchBookData('summarize-plot/', 'Summarized Plot', 'plotSummary');
  
  return (
    <Container className="mt-5">
      <Container fluid="md">
      <Row>
        <Col xs={2}><img src='image.jpg' alt="Project Gutenberg Books"/></Col>
      </Row>
    </Container>
      <Card style={{ width: 'auto'}}>
        <Card.Header>
        Access Project Gutenberg Books
        </Card.Header>
        <Card.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Enter Book ID"
                  className="mb-3"
                >
                  <Form.Control
                    type="number"
                    required
                    placeholder="Enter Project Gutenberg Book ID"
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                  />
                </FloatingLabel>
                <Form.Control.Feedback type="invalid">
                  Please Enter Project Gutenberg Book ID.
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" className="mt-3" onClick={fetchBook} disabled={disableLookup}>
                {disableLookup && (<Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />)}
                {buttonTxt}
              </Button>
            </Form>
          </Card.Body>
          
          {error && <Card.Footer><Alert variant="danger" className="mt-3">{error}</Alert></Card.Footer>}
      </Card>
      <hr />
      {viewedBooks.length > 0 && (<>
        <Card style={{ width: 'auto' }}>
          <Card.Header>
            Previously accessed books
          </Card.Header>
          <Card.Body>
            <ListGroup as="ol" numbered>
              {viewedBooks.map((book: any, lineIndex) => (
                <ListGroup.Item key={lineIndex} as="li">{book.title} By: {book.author} -  <Badge bg="success">{book.id}</Badge></ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </>)}
        
      {book && (
        <div>
          <hr />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Button variant="primary" disabled={analyze} className="mt-3" onClick={analyzeCharacters} style={{ marginRight: '25px' }}>
              {analyze ? 'Loading...' : 'Analyze Characters'}
            </Button>
            <Button variant="primary" disabled={analyze} className="mt-3" onClick={analyzeSentiment} style={{ marginRight: '25px' }}>
              {analyze ? 'Loading...' : 'Analyze Sentiment'}
            </Button>
            <Button variant="primary" disabled={analyze} className="mt-3" onClick={detectLanguage} style={{ marginRight: '25px' }}>
              {analyze ? 'Loading...' : 'Detect Language'}
            </Button>
            <Button variant="primary" disabled={analyze} className="mt-3" onClick={extractThemes} style={{ marginRight: '25px' }}>
              {analyze ? 'Loading...' : 'Extract Themes'}
            </Button>
            <Button variant="primary" disabled={analyze} className="mt-3" onClick={summarizePlot} style={{ marginRight: '50px' }}>
              {analyze ? 'Loading...' : 'Summarize Plot'}
            </Button>
            {analyze && (<Spinner
                as="span"
                animation="border" 
                variant="primary"
                role="status"
                aria-hidden="true"
              />)}
          </Form.Group>
          {analyzed && (<hr />)}
          {analyzed && (<Card style={{ width: 'auto', marginBottom: '25px' }}>
            <Card.Body>
              <Card.Title>{analyzedType}</Card.Title>
              <Card.Body>
                <div className="reader-mode-container">
                  {formatTextForReactUI(analyzed)}
                </div>
              </Card.Body>
            </Card.Body>
          </Card>)}

          <Card style={{ width: 'auto' }}>
          <Card.Header>
          {book.title} By: {book.author}
          </Card.Header>
            <Card.Body>
              <Card.Body>
              <div className="reader-mode-container">
              {formatTextForReactUI(removeAsterisksText(book.textContent))}
              </div>
               
              </Card.Body>
            </Card.Body>
          </Card>
        </div>

      )}
    </Container>
  );
};

export default HomePage;
