import React , {useState,useEffect,useCallback} from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies,setMovies]=useState([]);
  const [isLoading,setIsLoading]=useState(false);
  const [error,setError] = useState(null);
const fetchMoviesHandler= useCallback(async()=>{
    setIsLoading(true);
    setError(null);
    try{
      const response = await fetch('https://react-https-reqs-default-rtdb.firebaseio.com/movies.json');
      const data=await response.json();
      console.log("🚀 ~ file: App.js:16 ~ fetchMoviesHandler ~ data", data)
      
      let requiredData=[];
      for(const key in data){
        requiredData.push({
          id:key,
          title:data[key].title,
          releaseDate:data[key].releaseDate,
          openingText:data[key].openingText
        })
      }
      setMovies(requiredData);
    }
    catch(error){
      console.log(error)
   setError(error.message);
    }

    setIsLoading(false);
  },[])

  useEffect(()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler])
  
  let content=<p>No Movies Found</p>;
  if(isLoading) content=<p>Loading...</p>
  if(!isLoading && movies.length>=1) content= <MoviesList movies={movies} />;
  if(error) content=<p style={{ color: 'red',  fontWeight: 'bold' }}>something went wrong..try agin after 1 minute </p>;

  async function addMovieHandler(movie){
  const response= await fetch('https://react-https-reqs-default-rtdb.firebaseio.com/movies.json',{
    method:"POST",
    body:JSON.stringify(movie),
    headers:{
      'Content-Type':'application/json'
    }
  })
  const data=await response.json();
  console.log(data);

  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
       {content}
      </section>
    </React.Fragment>
  );
}

export default App;
