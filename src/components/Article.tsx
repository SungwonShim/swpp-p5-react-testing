import React from 'react';

interface IProps {
    id: number;
    author: string | undefined;
    title: string;
    buttonHandler?: React.MouseEventHandler<HTMLButtonElement>;
}

const Article = (props : IProps) => {
    return (
      <div className="Article">
        {props.id}
        <button onClick={props.buttonHandler}>{props.title}</button>
        {props.author}
      </div>
    );
  };
  
  export default Article;