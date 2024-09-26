import { createSlice } from "@reduxjs/toolkit";


const TodoSlice = createSlice({
    name: "Todo",
    initialState: [],
    reducers: {
        addtask: (state, action) => {
            console.log(action);
            state.push({ id: Date.now(), text: action.payload,complete:false })
        },
        
        deleteTask: (state, action) => state.filter((todo) => todo.id !== action.payload),
        editTask: (state, action) => {
            return state.map((todo) => {
                if (todo.id === action.payload.id) {
                    return {...todo,text:action.payload.editText}
                }

                
                return todo

            })
        },
       
        completetask: (state, action) => {
            return state.map((todo) => {
                if (todo.id === action.payload.id) {
                    return {...todo,complete:!todo.complete}
                }

                
                return todo

            })
        }
    },

}

)
export const { addtask, deleteTask, editTask,completetask } = TodoSlice.actions

export default TodoSlice.reducer