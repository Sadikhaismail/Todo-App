import React, { useState, useEffect } from 'react';
import './Todo.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg, BsArrowCounterclockwise } from 'react-icons/bs'; // Added undo icon
import { useSelector, useDispatch } from 'react-redux';
import { addtask, completetask, deleteTask, editTask } from '../Features/TodoSlice';

function Todo() {
    const [isCompleteScreen, setIsCompleteScreen] = useState(false);
    const [allTodos, setTodos] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [completedTodos, setCompletedTodos] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [regexError, setRegexError] = useState('');
    const [spaceError, setSpaceError] = useState('');
    const dispatch = useDispatch();
    const [EditMode, setEditMode] = useState(false);
    const [EditedTask, setEditedTask] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [EditError, setEditError] = useState('');

    const todos = useSelector(state => state.Todo);
    console.log(todos);


    useEffect(() => {
        let savedTodo = JSON.parse(localStorage.getItem('todolist'));
        let savedCompletedTodo = JSON.parse(localStorage.getItem('completedTodos'));
        if (savedTodo) {
            setTodos(savedTodo);
        }
        if (savedCompletedTodo) {
            setCompletedTodos(savedCompletedTodo);
        }
    }, []);

    const handleAddTodo = () => {
        const regex = /^[a-zA-Z0-9\s]+$/;
        if (!newTitle.trim() || !newDescription.trim()) {
            setErrorMessage('Title and Description cannot be empty');
            return;
        }

        if (newTitle[0] === ' ' || newDescription[0] === ' ') {
            setSpaceError('Spaces are not allowed at the beginning of the title or description');
            return;
        }

        if (!regex.test(newTitle) || !regex.test(newDescription)) {
            setRegexError('Special characters are not allowed in the title and description');
            return;
        }

        const newTodoItem = {
            id: Date.now(), 
            title: newTitle,
            description: newDescription,
            complete: false,
        };

        const updatedTodoArr = [...allTodos, newTodoItem];
        setTodos(updatedTodoArr);
        dispatch(addtask(newTodoItem)); 
        localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
        setNewTitle('');
        setNewDescription('');
        setErrorMessage('');
        setRegexError('');
        setSpaceError('');
    };

    const handleCompleteTask = (id) => {
        const completedItem = allTodos.find(todo => todo.id === id);
        if (completedItem) {
            const updatedTodos = allTodos.filter(todo => todo.id !== id);
            setTodos(updatedTodos);

            const updatedCompletedTodos = [...completedTodos, { ...completedItem, complete: true }];
            setCompletedTodos(updatedCompletedTodos);

            localStorage.setItem('todolist', JSON.stringify(updatedTodos));
            localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedTodos));

            dispatch(completetask(id));
            setIsCompleteScreen(true);  
        }
    };

    const handleUndoTask = (id) => {
        const undoItem = completedTodos.find(todo => todo.id === id);
        if (undoItem) {
            const updatedCompletedTodos = completedTodos.filter(todo => todo.id !== id);
            setCompletedTodos(updatedCompletedTodos);

            const updatedTodos = [...allTodos, { ...undoItem, complete: false }];
            setTodos(updatedTodos);

            localStorage.setItem('todolist', JSON.stringify(updatedTodos));
            localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedTodos));
        }
    };

    const handleSave = (id) => {
        if (!EditedTask) {
            setEditError('No Changes Detected');
            return;
        }

        dispatch(editTask({ editText: EditedTask, id }));
        setEditMode(false);
        setEditedTask('');
    };

    useEffect(() => {
        if (!allTodos.length && !completedTodos.length) {
            setErrorMessage('No todos available');
        } else {
            setErrorMessage('');
        }
    }, [allTodos, completedTodos]);

    const handleEdit = (id) => {
        setEditMode(true);
        setEditIndex(id);
    };

    const handleDeleteTask = (id) => {
        const updatedTodos = allTodos.filter(todo => todo.id !== id);
        setTodos(updatedTodos);
        localStorage.setItem('todolist', JSON.stringify(updatedTodos));
        dispatch(deleteTask(id));
    };

    const handleDeleteCompletedTask = (id) => {
        const updatedCompletedTodos = completedTodos.filter(todo => todo.id !== id);
        setCompletedTodos(updatedCompletedTodos);
        localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedTodos));
    };

    return (
        <div className="App">
            <h1>My Todos</h1>

            <div className="todo-wrapper">
                <div className="todo-input">
                    <div className="todo-input-item">
                        <label htmlFor="todo-title">Title</label>
                        <input
                            type="text"
                            id="todo-title"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            placeholder="What's the task title?"
                        />
                    </div>
                    <div className="todo-input-item">
                        <label htmlFor="todo-description">Description</label>
                        <input
                            type="text"
                            id="todo-description"
                            value={newDescription}
                            onChange={e => setNewDescription(e.target.value)}
                            placeholder="What's the task description?"
                        />
                    </div>
                    <div className="todo-input-item">
                        <button
                            type="button"
                            onClick={handleAddTodo}
                            className="primaryBtn"
                        >
                            Add
                        </button>
                    </div>
                </div>

                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {regexError && <p className='regex'>{regexError}</p>}
                {spaceError && <p className='space-error'>{spaceError}</p>}

                <div className="btn-area">
                    <button
                        className={`secondaryBtn ${!isCompleteScreen && 'active'}`}
                        onClick={() => setIsCompleteScreen(false)}
                    >
                        Todo
                    </button>
                    <button
                        className={`secondaryBtn ${isCompleteScreen && 'active'}`}
                        onClick={() => setIsCompleteScreen(true)}
                    >
                        Completed
                    </button>
                </div>

                <div className="todo-list">
                    {isCompleteScreen
                        ? completedTodos.map(todo => (
                            <div className='todo-list-item' key={todo.id}>
                                <p>{todo.title}</p>
                                <div className='list-icons'>
                                    <BsArrowCounterclockwise
                                        className="undo-icon"
                                        size={30}
                                        onClick={() => handleUndoTask(todo.id)} 
                                        title="Undo?"
                                    />
                                    <AiOutlineDelete
                                        className="icon"
                                        size={30}
                                        onClick={() => handleDeleteCompletedTask(todo.id)}
                                        title="Delete Completed?"
                                    />
                                </div>
                            </div>
                        ))
                        : allTodos.map(todo => (
                            <div className='todo-list-item' key={todo.id}>
                                {EditMode && editIndex === todo.id ? (
                                    <div>
                                        <input onChange={(e) => setEditedTask(e.target.value)} defaultValue={todo.title} className='todo-input-item' />
                                        <button onClick={() => handleSave(todo.id)} className='changeSave'>Save</button>
                                        {EditError && <p className="error-message">{EditError}</p>}
                                    </div>
                                ) : (
                                    <p>{todo.title}</p>
                                )}
                                <div className='list-icons'>
                                    <AiOutlineEdit
                                        className="check-icon"
                                        size={30}
                                        onClick={() => handleEdit(todo.id)}
                                        title="Edit?"
                                    />
                                    <BsCheckLg
                                        className="check-icon"
                                        size={30}
                                        onClick={() => handleCompleteTask(todo.id)}
                                        title="Complete?"
                                    />
                                    <AiOutlineDelete
                                        className="icon"
                                        size={30}
                                        onClick={() => handleDeleteTask(todo.id)}
                                        title="Delete?"
                                    />
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default Todo;
