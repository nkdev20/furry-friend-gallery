import React, { useState, useEffect } from 'react';

import DogCardInfo from './DogCardInfo';

import './App.css';

const loadingDogPictures = async (dogsToLoad = 8) => {
  const apiBaseUrl = 'https://dog.ceo/api/breeds/image/random/';
  const response = await fetch(`${apiBaseUrl}${dogsToLoad}`);
  const data = await response?.json();

  const dogData = data.message.map((dog) => {
    let breed = dog.replace('https://', '').split('/')[2];

    if(breed && breed !== ''){
      breed = breed.split('-').reverse().join(' ');
    }

    return {
      id: `dog_pic_${data.message.indexOf(dog)}`,
      image: dog,
      breed
    };
  });

  return dogData;

} 

function App() {
  const [dogPictures, setDogPictures] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [numOfDogs, setNumOfDogs] = useState('');
  const [totalDogsSearched, setTotalDogsSearched] = useState(0);


  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setIsLoading(true);
    setDogPictures(await loadingDogPictures(numOfDogs));
    setIsLoading(false);
  };

  useEffect(() => {
    (async() => {
      setIsLoading(loading  => !loading);
      const dogPics = await loadingDogPictures();
      setDogPictures((pics) => [...dogPics]);
      setIsLoading(loading  => !loading);
    })()
  }, []);


  useEffect(() => {
    setTotalDogsSearched(totalDogs => totalDogs + dogPictures.length);
  }, [dogPictures])



  return (
    <>
    <div className='container'>
      <header className='columns section has-text-centered'>

        <div className='column is-6 is-offset-3'>
          <h1 className='title is-size-3'>
            Search for pictures of good doggos
          </h1>
          <form className='form' onSubmit={handleSubmit}>
            <div className='field has-addons has-addons-centered'>
              <div className='control is-expanded'>
                <input
                  type='text'
                  className='input is-medium'
                  placeholder='how many dogs should we look for (max 50)?'
                  value={numOfDogs}
                  onChange={e => setNumOfDogs(e.target.value)}
                />
              </div>
              <div className='control'>
                <button className='button is-primary is-medium'>
                  <span className='icon is-small'>
                    <i className='fas fa-search'></i>
                  </span>
                  <span>search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </header>
    </div>
    <hr />
      <div className='has-text-centered'>
        <h3 className='subtitle is-size-4'>
          All time puppers found = {totalDogsSearched}
        </h3>
      </div>
      <div className='columns section is-multiline'>
        {isLoading && (
          <progress className='progress is-medium is-link' max='100'>
            60%
          </progress>
        )}
        {!isLoading &&
          dogPictures.map(dogPicture => (
            <div className='column is-one-quarter' key={dogPicture.id}>
              <DogCardInfo {...dogPicture} />
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
