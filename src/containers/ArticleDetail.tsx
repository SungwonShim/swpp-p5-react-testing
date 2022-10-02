import { useNavigate, useParams } from 'react-router-dom';
import React, {useEffect, useState}from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, fetchUsers, outUser, selectUser, UserType } from '../store/slices/users';
import { selectArticle, fetchArticle, ArticleType, deleteArticle } from '../store/slices/article';
import { AppDispatch } from '../store';

export default function ArticeDetail(){
    
    const [enableButton, setEnableButton] = useState<boolean>(false);
    const { id } = useParams();
    const articleState = useSelector(selectArticle);
    const userState = useSelector(selectUser);
    const navigate = useNavigate();
    // const location = useLocation();

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchUser());
         if(!userState.user?.logged_in){
             navigate('/login');
        }
        // dispatch(fetchArticles());
        // const splitURL = location.pathname.split('/');
        // let arId = parseInt(splitURL[splitURL.length-1]);
        // dispatch(articleActions.getOneArticle({articleId: arId}))
        console.log("detail");
        dispatch(fetchArticle(Number(id)));
    }, [id]);

    const findAuthorName = (anArticle : ArticleType | null) => {
        return userState.users.find((user : UserType) => {return (user.id === anArticle?.author_id);})?.name;
    };
    
    const deleteButtonHandler = (id : number | undefined) => {
        if (id === undefined){
            console.log("no such article");
            return;
        }
        dispatch(deleteArticle(id));
        navigate('/articles');
    };
    
    const logoutButtonHandler = async () => {
        const token = userState.users.find((user : UserType) => {return user.id === 1;});
        if(token !== undefined) {
            let noUser = {...token, logged_in: false};
            await dispatch(outUser(noUser));
            navigate('/login');
        }
    };
      
    // if(true){ // if id same
    //     CEDButtonHandler = (
    //         <div>
    //             <button id = "edit-comment-button" onClick = {() => navigate("/articles/${articleId}/edit")}>edit-article</button>
    //             <button id = "delete-comment-button" onClick = {() => clickDeleteHandler()}>delete-article</button>
    //         </div>
    //     )
    // }

    return (
        <div className='ArticleDetail'>
            <h3 id = "article-author">{findAuthorName(articleState.selectedArticle)}</h3>
            <h1 id = "article-title">{articleState.selectedArticle?.title}</h1>
            <h1 id = "article-content">{articleState.selectedArticle?.content}</h1>
            {(articleState.selectedArticle?.author_id === 1) ? (
            <div>
                <button id = "edit-article-button" onClick = {() => navigate("/articles/" + articleState.selectedArticle?.id + "/edit")}>edit-article</button>
                <button id = "delete-article-button" onClick = {() => deleteButtonHandler(articleState.selectedArticle?.id)}>delete-article</button>
            </div>
            )
            :
            (<div></div>)
            }
            <button id = "back-detail-article-button" onClick = {() => navigate("/articles")}>back</button>
            {/* <div className='Comment'>
                <h5> {comment_author}</h5>
                <p>{comment_content}</p>
                {CEDButtonHandler}
            </div> */}
            <button id='logout-button' onClick = {() => logoutButtonHandler()}>
                logout
            </button>
        </div>
    );
}