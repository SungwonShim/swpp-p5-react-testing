import { useNavigate, useParams } from 'react-router-dom';
import React, {useEffect, useState}from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, fetchUsers, outUser, selectUser, UserType } from '../store/slices/users';
import { selectArticle, fetchArticle, deleteArticle } from '../store/slices/article';
import { AppDispatch } from '../store';
import Comment from '../components/Comment';
import { CommentType, deleteComment, fetchComments, selectComment } from '../store/slices/comment';
import { postComment, editComment } from '../store/slices/comment';

export default function ArticeDetail(){
    const [contentOfComment, setContentOfComment] = useState<string>("");
    const { id } = useParams();
    const articleState = useSelector(selectArticle);
    const userState = useSelector(selectUser);
    const commentState = useSelector(selectComment);
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
        dispatch(fetchArticle(Number(id)));
        dispatch(fetchComments());
    }, [id]);

    const findAuthorName = (ID : number | undefined) => {
        return userState.users.find((user : UserType) => {return (user.id === ID);})?.name;
    };
    
    const commentEditButtonHandler = (comment: CommentType) => {  
        let notice = prompt("Edit Comment", comment.content);
        if(notice === null || notice.length === 0){
            alert("user cannot create empty comment");
        }
        else{
            const EdittedComment = {...comment, content: notice};
            dispatch(editComment(EdittedComment));
        }
    };

    const commentDeleteButtonHandler = (comment: CommentType) => {
        dispatch(deleteComment(comment.id));
    };

    const CommentsforThisArticle = commentState.comments.filter((comment: CommentType) => {return (comment.article_id === Number(id));}).sort((a, b) => a.id - b.id);

    let listedComments = CommentsforThisArticle.map((comment : CommentType) =>{
        return(
            <Comment
                key = {comment.id}
                author = {findAuthorName(comment.author_id)}
                authorId = {comment.author_id}
                content = {comment.content}
                editButtonHandler = {() => commentEditButtonHandler(comment)}
                deleteButtonHandler = {() => commentDeleteButtonHandler(comment)}
            />
        );
    });



    const deleteButtonHandler = (id : number | undefined) => {
        if (id === undefined){
            console.log("no such article");
            return;
        }
        dispatch(deleteArticle(id));
        navigate('/articles');
    };
    
    const commentCreateButtonHandler = () => {
        if(userState.user === undefined || userState.user === null)
            return;
        if(articleState.selectedArticle === undefined || articleState.selectedArticle === null)
            return;
        const data = {content : contentOfComment, author_id: userState.user.id, article_id: articleState.selectedArticle.id};
        dispatch(postComment(data));
        setContentOfComment("");
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
            <h3 id = "article-author">{findAuthorName(articleState.selectedArticle?.id)}</h3>
            <h1 id = "article-title">{articleState.selectedArticle?.title}</h1>
            <h1 id = "article-content">{articleState.selectedArticle?.content}</h1>
            {(articleState.selectedArticle?.author_id === userState.user?.id) ? (
            <div>
                <button id = "edit-article-button" onClick = {() => navigate("/articles/" + articleState.selectedArticle?.id + "/edit")}>edit-article</button>
                <button id = "delete-article-button" onClick = {() => deleteButtonHandler(articleState.selectedArticle?.id)}>delete-article</button>
            </div>
            )
            :
            (<div></div>)
            }
            <button id = "back-detail-article-button" onClick = {() => navigate("/articles")}>back</button>
            <div className='Comment'>
                {listedComments}
                <textarea id = "new-comment-content-input" value = {contentOfComment} onChange = {(e) => (setContentOfComment(e.target.value))}>
                    Type Comment Here
                </textarea>
                <button id = "confirm-create-comment-button" onClick = {() => commentCreateButtonHandler()} disabled = {(contentOfComment === '' || contentOfComment === null)}>
                    confirm
                </button>
            </div>
            <button id='logout-button' onClick = {() => logoutButtonHandler()}>
                logout
            </button>
        </div>
    );
}
