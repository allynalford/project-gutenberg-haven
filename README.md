# project-gutenberg-haven
 Project Gutenberg frontend in ReactJS

 Project Gutenberg is a platform to download and access free e-books. A web application that allows users to explore and analyze books from Project Gutenberg. 

##
LIVE DEMO URL: https://main.d15o6tr2xe1g64.amplifyapp.com/

### Project Structure

 **⚙️ Core Functionality** 

1. Input field for users to enter a Project Gutenberg book ID.
2. Fetch and display the book's text and metadata.
3. Save the book text and metadata for future access.
4. Provide a list view of all books the user has previously accessed.

🧠 **Text Analysis**

Given the text the user can perform text analysis. Using Groq Fast AI Inference SambaNova Cloud

- Identify key characters
- Language Detection
- Sentiment Analysis
- Plot Summary
- Extract Theme



### Setup


Provide environment variable for API.

REACT_APP_API_URL=http://localhost:3001/

Start the application

npm run dev
