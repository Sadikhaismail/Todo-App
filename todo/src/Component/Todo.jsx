import React, { useState, useEffect } from 'react';
import './Todo.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addtask, completetask, deleteTask, editTask } from '../Features/TodoSlice';

function Todo() {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState("");
  const [currentEditedItem, setCurrentEditedItem] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [regexError, setRegexError] = useState('');
  const [spaceError, setSpaceError] = useState('');
  const dispatch = useDispatch()
  const [EditMode, setEditMode] = useState(false)
  const [EditedTask, setEditedTask] = useState(null)
  const [editIndex, setEditIndex] = useState(null)
  const [EditError, setEditError] = useState("")


  const todos = useSelector(state => state.Todo)

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

    let newTodoItem = {
      title: newTitle,
      description: newDescription,
    };
    let updatedTodoArr = [...allTodos, newTodoItem];
    setTodos(updatedTodoArr);
    dispatch(addtask(newTitle))
    localStorage.setItem('todolist', JSON.stringify(updatedTodoArr));
    setNewTitle('');
    setNewDescription('');
    setErrorMessage('');
    setRegexError('');
    setSpaceError('');

  };

  const handleDeleteTodo = index => {
    let reducedTodo = [...allTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem('todolist', JSON.stringify(reducedTodo));
    setTodos(reducedTodo);

    dispatch(deleteTask(index))
  };

  const handleComplete = index => {
    let now = new Date();
    let completedOn = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()} at ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
    let filteredItem = {
     


      ...allTodos[index],
      completedOn,
     };
     



    let updatedCompletedArr = [...completedTodos, filteredItem];
    setCompletedTodos(updatedCompletedArr);
    handleDeleteTodo(index);
    handleComplete(index);
    localStorage.setItem('completedTodos', JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompletedTodo = index => {
    let reducedTodo = [...completedTodos];
    reducedTodo.splice(index, 1);
    localStorage.setItem('completedTodos', JSON.stringify(reducedTodo));
    setCompletedTodos(reducedTodo);
    
  };

  // const handleEdit = (ind, item) => {
  //   setCurrentEdit(ind);
  //   setCurrentEditedItem(item);
  // };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, title: value };
    });
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => {
      return { ...prev, description: value };
    });
  };

  const handleUpdateToDo = () => {
    let newToDo = [...allTodos];
    newToDo[currentEdit] = currentEditedItem;
    setTodos(newToDo);
    setCurrentEdit("");
    localStorage.setItem('todolist', JSON.stringify(newToDo));
  };

  const handleSave = (id) => {

    if (!EditedTask) {
      setEditError('No Changes Deducted');
      return
    }

    dispatch(editTask({ editText: EditedTask, id }))
    setEditMode(false)
    setEditedTask('');
}
















  useEffect(() => {
    if (!allTodos.length && !completedTodos.length) {
      setErrorMessage('No todos available');
    } else {
      setErrorMessage('');
    }
  }, [allTodos, completedTodos]);

  const handleEdit = (id) => {
    setEditMode(true)
    setEditIndex(id)
  }

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
          {todos.map((todo) => {

            return (
              <div className='todo-list-item'>


                {EditMode && editIndex === todo.id ? (
                  <div  className=''>
                    <input onChange={(e) => setEditedTask(e.target.value)} defaultValue={todo.text} className='todo-input-item'/>
                    <button onClick={() => handleSave(todo.id)} className='changeSave'>Save</button>
                    {EditError && <p className="error-message">{EditError}</p>}

                  </div>
                ) : (
                  <p>{todo.text}</p>
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
                        onClick={() => dispatch(completetask(todo.id))}
                        title="Complete?"
                      />
                  <AiOutlineDelete
                    className="icon"
                    size={30}

                    onClick={() => dispatch(deleteTask(todo.id))}
                    title="Delete?"
                  />
                </div>
              </div>
            )
          })}









          {/* {isCompleteScreen === false &&
            todos.map((item, index) => {
              if (currentEdit === index) {
                return (
                  <div className='edit__wrapper' key={index}>
                    <input
                      placeholder='Updated Title'
                      onChange={(e) => handleUpdateTitle(e.target.value)}
                      value={currentEditedItem.title}
                    />
                    <textarea
                      placeholder='Updated Description'
                      rows={4}
                      onChange={(e) => handleUpdateDescription(e.target.value)}
                      value={currentEditedItem.description}
                    />
                    <button
                      type="button"
                      onClick={handleUpdateToDo}
                      className="primaryBtn"
                    >
                      Update
                    </button>
                  </div>
                )
              } else {
                return (
                  <div className="todo-list-item" key={index}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div>
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTodo(item.id)}
                        title="Delete?"
                      />
                      <BsCheckLg
                        className="check-icon"
                        onClick={() => handleComplete(index)}
                        title="Complete?"
                      />
                      <AiOutlineEdit
                        className="check-icon"
                        onClick={() => handleEdit(index, item)}
                        title="Edit?"
                      />
                    </div>
                  </div>
                );
              }
            })} */}

          {/* {isCompleteScreen === true &&
            completedTodos.map((item, index) => {
              return (
                <div className="todo-list-item" key={index}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <p><small>Completed on: {item.completedOn}</small></p>
                  </div>
                  <div>
                    <AiOutlineDelete
                      className="icon"
                      onClick={() => handleDeleteCompletedTodo(index)}
                      title="Delete?"
                    />
                  </div>
                </div>
              );
            })} */}
        </div>
      </div>
    </div>
  );
}

export default Todo;
