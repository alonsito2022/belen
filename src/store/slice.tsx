import {createSlice} from "@reduxjs/toolkit"
export const Slice = createSlice({
    name:'valores',
    initialState:{
        nombre:'JAB'
    },
    reducers: {
        guardarNomber:(state,action)=>{
            state.nombre=action.payload;
        }
    }
})
export const {guardarNomber} = Slice.actions;