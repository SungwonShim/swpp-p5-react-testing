import "./App.css";
import Login from "./containers/Login"; 
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ArticleList from "./containers/ArticleList";
import ArticleCreate from './containers/ArticleCreate';
import ArticleDetail from "./containers/ArticleDetail";
import ArticleEdit from './containers/ArticleEdit';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element ={<Login />} />
          <Route path="/articles" element={<ArticleList/>}/>
          <Route path="/articles/create" element={<ArticleCreate/>}/>
          <Route path="/articles/:id" element={<ArticleDetail/>}/>
          <Route path="/articles/:id/edit" element={<ArticleEdit/>}/>
          <Route path="/" element={<Navigate replace to={"/login"} />} />
          <Route path="/*" element={<Navigate replace to={"/login"} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
