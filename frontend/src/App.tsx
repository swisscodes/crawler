import './App.css';
import React, { useState, SyntheticEvent, ChangeEvent } from 'react';

type Tdata = {
  loading:boolean,
  [key:string]:any
}

function App() {

  const [formState, setFormState] = useState({})
  const [result, setResult] = useState<Tdata>({loading:false})


  return (
    <div className="App">
      <form onSubmit={(e) => submitUrl(e)}> 
        <label htmlFor="url-input">Enter url:</label>
        <input id='url-input' type="url" pattern="https?://.*"
               name='url'
               placeholder="Enter url"
               required
               onChange={(e) => formFieldChange(e)}
        />
        <button type='submit'>Submit</button>
      </form>
      {result.loading ? <div>loading...</div> : <div>
        {result.foundedUrl?
        <>
          <p>{result?.data}</p>
          <p>{result?.foundedUrl}</p>
        </>:
        <div>{result?.data && <p>Not found</p>}</div>
        }
        </div>
      }

    </div>
  );

  //Hoisted funcs
  function submitUrl(e:SyntheticEvent) {
    e.preventDefault()
    
    const data = formState
    let url = 'http://localhost:8000/api'
    console.log('submitted')
    setResult({...result, loading:true})
    
    fetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success', data);
      setResult((result) => ({...result, loading:false, ...data}))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  //
  function formFieldChange(e:ChangeEvent) {
    e.preventDefault()

    let target = e.target as HTMLInputElement;
    setFormState({
      ...formState,
      [target.name]: target.value,
    })
    console.log(formState)
  }
}

export default App;
