import react from 'react';
import { Routes,Route } from 'react-router-dom';
import GameGrid from './Pages/GameGrid';
import Home from './Pages/Home';

function App(){

  return(
    <div>
           <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/battle' element={<GameGrid/>}/>
           </Routes>
    </div>
  );
}

export default App;