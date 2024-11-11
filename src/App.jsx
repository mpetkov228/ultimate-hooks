import { useState, useEffect } from 'react';
import axios from 'axios';

const useField = (type) => {
  const [value, setValue] = useState('');

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = () => {
    setValue('');
  };

  return {
    type,
    value,
    onChange,
    reset
  };
};

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    axios.get(baseUrl).then(res => setResources(res.data));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create = (resource) => {
    axios
      .post(baseUrl, resource)
      .then(res => setResources(resources.concat(res.data)));
  };

  const service = {
    create
  };

  return [
    resources, service
  ];
};

const App = () => {
  const content = useField('text');
  const name = useField('text');
  const number = useField('text');

  const [notes, noteService] = useResource('http://localhost:3005/notes');
  const [persons, personService] = useResource('http://localhost:3005/persons');

  const handleNoteSubmit = (event) => {
    event.preventDefault();
    noteService.create({ content: content.value })
    content.reset();
  };
 
  const handlePersonSubmit = (event) => {
    event.preventDefault();
    personService.create({ name: name.value, number: number.value});
    name.reset();
    number.reset();
  };

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...{...content, reset: undefined }} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...{...name, reset: undefined}} /> <br/>
        number <input {...{...number, reset: undefined}} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  );
}

export default App;