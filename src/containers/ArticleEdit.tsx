import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchArticle, selectArticle, editArticle, fetchArticles } from '../store/slices/article';
import { fetchUser, fetchUsers, outUser, selectUser, UserType } from '../store/slices/users';

export default function ArticleEdit(){
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [clickedPreview, setClickedPreview] = useState<boolean>(false);
    const { id } = useParams();

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
      dispatch(fetchArticle(Number(id)));
  }, [id]);

  const logoutButtonHandler = async () => {
    const token = userState.users.find((user : UserType) => {return user.id === 1;});
    if(token !== undefined) {
        let noUser = {...token, logged_in: false};
        await dispatch(outUser(noUser));
        navigate('/login');
    }
};
  
    const confirmButtonHandler = async () => {
    if(articleState.selectedArticle === undefined || articleState.selectedArticle === null)
        return;
    if(userState.user === undefined || userState.user === null)
        return;
    const data = { id: articleState.selectedArticle.id, author_id: userState.user.id, title: title, content: content};
    await dispatch(editArticle(data));
      // if (result.type === `${postArticle.typePrefix}/fulfilled`) {
      //   setSubmitted(true);
      // } else {
      //   alert("Error on post Article");
      // }
      navigate('/articles/'+ articleState.selectedArticle?.id);
    };

    const backButtonHandler = async () => {
        if(articleState.selectedArticle?.title !== title || articleState.selectedArticle.content!== content){
            let notice = window.confirm("Are you sure? The change will be lost");
            if(notice)
                navigate('/articles/' + articleState.selectedArticle?.id);
        }
        else
            navigate('/articles/' + articleState.selectedArticle?.id);
    };

    return(
        <div className="ArticleEdit">
      {clickedPreview ? (
        <div className="PreviewTab">
            <h3 id="article-author">{userState.user?.name}</h3>
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
      <button id="back-edit-article-button" onClick={() => backButtonHandler()}>
        back
      </button>
      <button id="confirm-edit-article-button" disabled={ title == '' || content == '' } onClick={() => confirmButtonHandler()}>
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