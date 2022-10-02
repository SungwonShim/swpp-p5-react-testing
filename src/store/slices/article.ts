import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";

export interface ArticleType {
    id: number;
    title: string;
    content: string;
    author_id: number;
}

export interface ArticleState {
    articles: ArticleType[];
    selectedArticle: ArticleType | null;
}

const initialState: ArticleState = {
    articles: [],
    selectedArticle: null,
};

export const fetchArticles = createAsyncThunk("article/fetchArticles", async () => {
    const response = await axios.get<ArticleType[]>("/api/articles/");
    return response.data;
});

export const fetchArticle = createAsyncThunk(
    "article/fetchArticle",
    async(id: ArticleType["id"]) => {
        const response = await axios.get<ArticleType>("/api/articles/" + id);
        return response.data;
});

export const editArticle = createAsyncThunk(
    "article/editArticle", 
    async (ar: ArticleType, { dispatch }) => {
        const response = await axios.put("/api/articles/" + ar.id, ar);
        dispatch(articleActions.articleEdit(response.data));
});

export const postArticle = createAsyncThunk(
    "article/postArticle", 
    async (ar: Pick<ArticleType, "author_id" | "title" | "content">, { dispatch }) => {
        const response = await axios.post("/api/articles/", ar);
        dispatch(articleActions.articleAdd(response.data));
});

export const deleteArticle = createAsyncThunk(
    "article/deleteArticle",
    async(id: ArticleType["id"], {dispatch}) => {
        await axios.delete('/api/articles/' + id);
        dispatch(articleActions.articleDelete({articleId: id}));
});

export const articleSlice = createSlice({
    name: 'article',
    initialState,
    reducers:{
        articleAdd: (state, action: PayloadAction<{ author_id: number, title: string; content: string }>) => {
            const articleToAdd = {id: state.articles[state.articles.length -1].id + 1,
                                  title: action.payload.title,
                                  content: action.payload.content,
                                  author_id: action.payload.author_id};
            return {...state, articles: [...state.articles, articleToAdd], selectedArticle: articleToAdd};
        },
        articleDelete: (state, action: PayloadAction<{articleId : number}>) => {
            console.log(action.payload.articleId);
            const articlesAfterDeletion = state.articles.filter((article) => {return (article.id !== action.payload.articleId );
            });
            return {...state, articles: articlesAfterDeletion };
        },
        articleEdit: (state, action: PayloadAction<ArticleType>) => {
            const articleToEdit ={...action.payload};
            const articlesAfterEdit = state.articles.filter((article) => {return article.id !== action.payload.id;});
            return {...state, articles: [...articlesAfterEdit, articleToEdit], selectedArticle: articleToEdit};
        },
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchArticles.fulfilled, (state, action) => {
        // Add user to the state array
            state.articles = action.payload;
        });
        builder.addCase(fetchArticle.fulfilled, (state, action) => {
            // Add user to the state array
            state.selectedArticle = action.payload;
        });
    }
});

export const articleActions = articleSlice.actions;
export const selectArticle = (state: RootState) => state.article;

export default articleSlice.reducer;