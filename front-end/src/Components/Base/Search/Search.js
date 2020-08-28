import React, { useState } from "react";
import { Form, FormControl, Button } from "react-bootstrap";
import { withRouter } from 'react-router-dom';

const Search = (props) => {

    const [ bookName, setBookName ] = useState('');

    const searchHandler = () => {
        return bookName ? props.history.push(`/books/search/${bookName}`) : null
    }

  return (
    <Form inline>
      <FormControl
        type="text"
        placeholder="Search book"
        className="mr-sm-2"
        onChange={((e) => setBookName(e.target.value))}
        value={bookName}
        />
      <Button variant="outline-light" onClick={(e) => (e.preventDefault(), searchHandler())}>Search</Button>
    </Form>
  );
};

export default withRouter(Search);
