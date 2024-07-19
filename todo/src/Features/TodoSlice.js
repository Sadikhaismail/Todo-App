import { createSlice } from "@reduxjs/toolkit";


const TodoSlice = createSlice({
    name: "Todo",
    initialState: [],
    reducers: {
        addtask: (state, action) => {
            console.log(action);
            state.push({ id: Date.now(), text: action.payload })
        },
        completetask: (state, action) => state.filter((todo) => todo.id === action.payload),
        deleteTask: (state, action) => state.filter((todo) => todo.id !== action.payload),
        editTask: (state, action) => {
            return state.map((todo) => {
                if (todo.id === action.payload.id) {
                    return {...todo,text:action.payload.editText}
                }
                return todo

            })
        }
    },

}

)
export const { addtask, deleteTask, editTask,completetask } = TodoSlice.actions

export default TodoSlice.reducer