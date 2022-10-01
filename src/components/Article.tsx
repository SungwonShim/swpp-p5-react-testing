import React from 'react';

interface IProps {
    id: number;
    author: string | undefined;
    title: string;
    clickDetail?: React.MouseEventHandler<HTMLButtonElement>;
}

const Article = (props : IProps) => {
    return (
      <div className="Article">
        {props.id}
        <button onClick={props.clickDetail}>{props.title}</button>
        {props.author}
      </div>
    );
  };
  
  export default Article;