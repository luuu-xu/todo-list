const Project = (title) => {
  let todoList = [];
  let todoIndex = 0;
  let index;
  const getIndex = () => index;
  const updateIndex = (i) => (index = i);
  const getTitle = () => title;
  const updateTitle = (i) => (title = i);
  const getTodos = () => todoList;
  const addTodo = (todo) => {
    todo.updateIndex(todoIndex);
    todoIndex++;
    todoList.push(todo);
  };
  const addTodos = (todos) => {
    todos.forEach((todo) => {
      addTodo(todo);
    });
  };
  const deleteTodo = (i) => {
    todoList.splice(i, 1);
  };
  return {
    getIndex,
    updateIndex,
    getTitle,
    updateTitle,
    getTodos,
    addTodo,
    addTodos,
    deleteTodo,
    todoList,
    todoIndex,
    title,
    index,
  };
};

const ProjectList = () => {
  let projects = [];
  let projectIndex = 0;
  const getProjectIndex = () => projectIndex;
  const addProject = (project) => {
    project.updateIndex(projectIndex);
    projectIndex++;
    projects.push(project);
  };
  const getProjects = () => projects;
  const deleteProject = (i) => {
    projects.splice(i, 1);
  };
  return {
    getProjectIndex,
    addProject,
    getProjects,
    deleteProject,
    projects,
    projectIndex,
  };
};

export { Project, ProjectList };
