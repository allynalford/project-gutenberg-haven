# project-gutenberg-haven
 Project Gutenberg frontend in ReactJS

 Project Gutenberg is a platform to download and access free e-books. A web application that allows users to explore and analyze books from Project Gutenberg. 

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



### Installation

**Clone the repository**
   ```bash
   git clone https://github.com/allynalford/project-gutenberg-haven.git
   cd your-repo

   ### Configuration

Provide any environment variables or configuration steps if required.

#### Example `.env` file:
REACT_APP_API_URL=http://localhost:3001/
