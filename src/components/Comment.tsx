import React from 'react';

interface IProps {
    author: string | undefined;
    authorId: number;
    content: string;
    editButtonHandler?: React.MouseEventHandler<HTMLButtonElement>;
    deleteButtonHandler?: React.MouseEventHandler<HTMLButtonElement>;
}

const Comment = (props : IProps) => {

    return (
      <div className="Comment">
        <p>{props.author}</p>
        <p>{props.content}</p>
        {
          (props.authorId === 1) ? 
          (<div className = "buttons">
          <button id="edit-comment-button" onClick={props.editButtonHandler}>edit</button>
          <button id="delete-comment-button" onClick={props.deleteButtonHandler}>delete</button>
          </div>) : 
          (<div>
          </div>)
        }
      </div>
    );
  };
  
  export default Comment;