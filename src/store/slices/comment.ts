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

export const fetchComments = createAsyncThunk("comment/fetchComments", async () => {
    const response = await axios.get<CommentType[]>("/api/comments/");
    return response.data;
});

export const editComment = createAsyncThunk(
    "comment/editComment", 
    async (ar: CommentType, { dispatch }) => {
        const response = await axios.put("/api/comments/" + ar.id, ar);
        dispatch(commentActions.commentEdit(response.data));
});

export const postComment = createAsyncThunk(
    "comment/postComment", 
    async (ar: Pick<CommentType, "author_id" | "article_id" | "content">, { dispatch }) => {
        const response = await axios.post("/api/comments/", ar);
        dispatch(commentActions.commentAdd(response.data));
});

export const deleteComment = createAsyncThunk(
    "comment/deleteComment",
    async(id: CommentType["id"], {dispatch}) => {
        await axios.delete('/api/comments/' + id);
        dispatch(commentActions.commentDeletion({commentId: id}));
});

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
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchComments.fulfilled, (state, action) => {
        // Add user to the state array
            state.comments = action.payload;
        });
    }
});

export const commentActions = commentSlice.actions;
export const selectComment = (state: RootState) => state.comment;

export default commentSlice.reducer;