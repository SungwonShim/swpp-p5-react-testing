import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { selectArticle, postArticle, fetchArticles  } from '../store/slices/article';
import { fetchUser, fetchUsers, selectUser, outUser, UserType } from '../store/slices/users';

export default function ArticleCreate(){
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [clickedPreview, setClickedPreview] = useState<boolean>(false);

    const articleState = useSelector(selectArticle);
    const userState = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    useEffect(() => {
      dispatch(fetchUsers());
      dispatch(fetchUser());
      if(!userState.user?.logged_in){
         navigate('/login');
      }
      dispatch(fetchArticles());
  }, []);

    
  
    const confirmButtonHandler = async () => {
    if(userState.user === undefined || userState.user === null)
        return;
      const data = { author_id: userState.user.id, title: title, content: content};
      await dispatch(postArticle(data));
      // if (result.type === `${postArticle.typePrefix}/fulfilled`) {
      //   setSubmitted(true);
      // } else {
      //   alert("Error on post Article");
      // }
      navigate('/articles/'+ (articleState.articles[articleState.articles.length-1].id + 1));
    };

    const logoutButtonHandler = async () => {
      const token = userState.users.find((user : UserType) => {return user.id === 1;});
      if(token !== undefined) {
          let noUser = {...token, logged_in: false};
          await dispatch(outUser(noUser));
          navigate('/login');
      }
  };

    return(
        <div className="ArticleCreate">
      {clickedPreview ? (
        <div className="PreviewTab">
            <h3 id="article-author">{userState.users[0].name}</h3>
            <h1 id="article-title">{title}</h1>
            <p id="article-content">{content}</p>
        </div>
      ) : (
        <div className="WriteTab">
            <div className="article-title-input"> 
                <input id="article-title-input" value={title} onChange={(e) => setTitle(e.target.value)}></input>
            </div>
            <div className="article-content-input">
                <input id="article-content-input" value={content} onChange={(e) => setContent(e.target.value)}></input>
            </div>
        </div>
      )}
      <button id="back-create-article-button" onClick={() => navigate("/articles")}>
        back
      </button>
      <button id="confirm-create-article-button" disabled={ title === '' || content === '' } onClick={() => confirmButtonHandler()}>
        confirm
      </button>
      <button id="preview-tab-button" onClick={() => setClickedPreview(true)}>
        preview
      </button>
      <button id="write-tab-button" onClick={() => setClickedPreview(false)}>
        write
      </button>
      <button id='logout-button' onClick = {() => logoutButtonHandler()}>
        logout
      </button>
    </div>
    );
}