import { configureStore } from "@reduxjs/toolkit";
import articleReducer from "./slices/article";
import commentReducer from "./slices/comment";
import usersReducer from "./slices/users";

export const store = configureStore(
    { reducer: 
      {
         article: articleReducer,
         comment: commentReducer,
         users: usersReducer,
      }
   }
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
