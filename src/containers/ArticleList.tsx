import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate} from 'react-router-dom';
import Article from '../components/Article';
import { AppDispatch } from '../store';
import { fetchArticles, selectArticle, ArticleType } from '../store/slices/article';
import { fetchUser, fetchUsers, outUser, selectUser, UserType } from '../store/slices/users';

export default function ArticleList(){
    const articleState = useSelector(selectArticle);
    const userState = useSelector(selectUser);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchArticles());
        dispatch(fetchUsers());
        dispatch(fetchUser());
        if(!userState.user?.logged_in){
            navigate('/login');
        }
    });

    const findAuthorName = (anArticle : ArticleType | null) => {
        return userState.users.find((user : UserType) => {return (user.id === anArticle?.author_id);})?.name;
    };
    
    const logoutButtonHandler = async () => {
        const token = userState.users.find((user : UserType) => {return user.id === userState.user?.id;});
        if(token !== undefined) {
            let noUser = {...token, logged_in: false};
            await dispatch(outUser(noUser));
            navigate('/login');
        }
    };

    let listedArticles = articleState.articles.map((article : ArticleType) =>{
        return(
            <Article
                key = {article.id}
                id = {article.id}
                buttonHandler = { () => { navigate('/articles/' + article.id); }}
                title = {article.title}
                author = {findAuthorName(article)}
            />
        );
    });

    return(
        <div className='ArticleList'>
            {listedArticles}
            <button id = "create-article-button" onClick = {() => { navigate('/articles/create') }}>create-article</button>
            <button id = 'logout-button' onClick={() => logoutButtonHandler()}>logout</button>
        </div>
    );
}