import React from 'react';

interface IProps {
    author: string;
    authorId: number;
    content: string;
    editFunc?: React.MouseEventHandler<HTMLButtonElement>;
    deleteFunc?: React.MouseEventHandler<HTMLButtonElement>;
}

const Comment = (props:IProps) => {
    let editbutton=null;
    let deletebutton=null;
    if(props.authorId===1){
        editbutton=(<button id="edit-comment-button" onClick={props.editFunc}>edit</button>);
        deletebutton=(<button id="delete-comment-button" onClick={props.deleteFunc}>delete</button>);
    }

    return (
      <div className="Comment">
        <p>{props.author}</p>
        <p>{props.content}</p>
        {editbutton}
        {deletebutton}
      </div>
    );
  };
  
  export default Comment;