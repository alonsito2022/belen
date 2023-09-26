import { configureStore } from "@reduxjs/toolkit";
import { Slice } from "./slice"

export default configureStore({
    reducer:{
        valores:Slice.reducer
    }
})
// export type RootState = ReturnType<typeof store.getState>
/*const store = configureStore({
    reducer:{
        valores:Slice.reducer
    }
  })


export type AppDispatch = typeof store.dispatch*/