import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";

export interface CommentType {
    id: number;
    content: string;
    author_id: number;
    article_id: number;
}

export interface CommentState {
    comments: CommentType[];
    selectedComments: CommentType[];
    selectedComment: CommentType | null;
}

const initialState: CommentState = {
    comments: [],
    selectedComments: [],
    selectedComment: null,
};

export const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers:{
        getAllComments: (state, action: PayloadAction<{ comments: CommentType[] }>) => {
            return {...state, comments: action.payload.comments};
        },
        commentAdd: (state, action: PayloadAction<CommentType>) => {
            const commentToAdd = {...action.payload, id: state.comments[state.comments.length - 1].id + 1};
            return {...state, comments: [...state.comments, commentToAdd], selectedComment: commentToAdd}
        },
        commentDeletion: (state, action: PayloadAction<{ commentId: number }>) => {
            const commentsAfterDelete = state.comments.filter((comment) => {
                return comment.id !== action.payload.commentId;
            });
            return {...state, comments: commentsAfterDelete};
        },
        commentEdit: (state, action: PayloadAction<CommentType>) => {
            const commentToEdit = {...action.payload};
            const commentsAfterEdit = state.comments.filter((comment) => {
                return comment.id !== action.payload.id;
            });
            return {...state, comments: [...commentsAfterEdit, commentToEdit], selectedComment: commentToEdit};    
        },
    },
});

export const commentActions = commentSlice.actions;
export const selectComment = (state: RootState) => state.comment;

export default commentSlice.reducer;