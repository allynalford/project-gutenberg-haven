import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import './DisplayText.css';
interface Book {
  id: string;
  title: string;
  author: string;
  textContent: string;
}

const HomePage: React.FC = () => {
  const [bookId, setBookId] = useState('');
  const [book, setBook] = useState<Book | null>(null);
  const [error, setError] = useState('');
  const [analyze, setAnalyze] = useState<boolean>(true);
  const [analyzed, setAnalyzed] = useState<string>("");
  const [analyzedType, setAnalyzedType] = useState<string>("");

  // Fetch saved books from local storage on component mount
  useEffect(() => {
    
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}${urlSuffix}${bookId}`);
      const result = response.data[dataKey];
      
      setAnalyzedType(type);
      setAnalyzed(result);
      setError('');
      setAnalyze(false);
    } catch (err: any) {
      console.error(err.message);
      setAnalyze(true);
      setError(`Failed to ${type.toLowerCase()} for the book.`);
    }
  };
  
  const fetchBook = async () => {
    if (!bookId) {
      setError('Please enter a valid book ID.');
      return;
    }
  
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}book/${bookId}`);
      const { title, author, textContent } = response.data;
      const fetchedBook: Book = { id: bookId, title, author, textContent };
  
      setBook(fetchedBook);
      setAnalyze(false);
      setAnalyzed('');
      setAnalyzedType('');
      setError('');
    } catch (err: any) {
      console.error(err.message);
      setAnalyze(true);
      setError('Failed to fetch book data. Please check the ID and try again.');
    }
  };
  
  // Specific Analysis Functions
  const analyzeCharacters = () => fetchBookData('analyze-characters/', 'Characters', 'characters');
  const analyzeSentiment = () => fetchBookData('analyze-sentiment/', 'Sentiment', 'sentiment');
  const detectLanguage = () => fetchBookData('detect-language/', 'Language', 'language');
  const extractThemes = () => fetchBookData('extract-themes/', 'Themes', 'themes');
  const summarizePlot = () => fetchBookData('summarize-plot/', 'Summarized Plot', 'plotSummary');
  
  return (
    <Container className="mt-5">
      <h1>Access Project Gutenberg Books</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Enter Book ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Project Gutenberg Book ID"
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary"  className="mt-3" onClick={fetchBook}>Fetch Book</Button>
      </Form>

      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {book && (
        <div>
          <hr />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Button variant="primary" disabled={analyze} className="mt-3" onClick={analyzeCharacters} style={{ marginRight: '25px' }}>Analyze Characters</Button>
            <Button variant="primary" disabled={analyze} className="mt-3" onClick={analyzeSentiment} style={{ marginRight: '25px' }}>Analyze Sentiment</Button>
            <Button variant="primary" disabled={analyze} className="mt-3" onClick={detectLanguage} style={{ marginRight: '25px' }}>Detect Language</Button>
            <Button variant="primary" disabled={analyze} className="mt-3" onClick={extractThemes} style={{ marginRight: '25px' }}>Extract Themes</Button>
            <Button variant="primary" disabled={analyze} className="mt-3" onClick={summarizePlot} style={{ marginRight: '25px' }}>Summarize Plot</Button>
          </Form.Group>
          {analyzed && (<hr />)}
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              {!analyze && (<h2>{analyzedType}</h2>)}
              <Accordion.Body>
                {analyzed}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
          <hr />
          <Card style={{ width: 'auto' }}>
            <Card.Body>
              <Card.Title>{book.title} | By: {book.author}</Card.Title>
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
