import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  useMutation
} from "@apollo/client";

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

const BOOKS_INFO = gql`
  query GetBooks {
    books {
      title
      author
    }
  }
`;

const ADD_BOOK = gql`
  mutation AddBook($title: String, $author: String) {
    addBook(title: $title, author: $author) {
      title
      author
    }
  }
`;

const Books = () => {
  const { loading, error, data } = useQuery(BOOKS_INFO);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return data.books.map(({ title, author }) => (
    <div key={title}>
      <p>{title}</p>
      <p>{author}</p>
    </div>
  ));
}

const AddBook = () => {
  const [addBook, { data, loading, error }] = useMutation(ADD_BOOK, {
    refetchQueries: [BOOKS_INFO]});
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const submitForm = (e) => {
    e.preventDefault();
    addBook({ variables: { title: title, author: author } });
    setTitle('');
    setAuthor('');
  }

  if (loading) return 'Submitting...';
  if (error) return `Submission error! ${error.message}`;

  return (
    <form>
      <input type='text' value={title} id='title' placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
      <input type='text' value={author} id='author' placeholder='Author' onChange={(e) => setAuthor(e.target.value)} />
      <button onClick={submitForm}>Submit</button>
    </form>
  )
}


ReactDOM.render(
  <ApolloProvider client={client}>
    <Books />
    <AddBook />
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
