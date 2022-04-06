import dom from "./dom";
import initialize from "./initialize";
import projectList from "./localstorage";

const todoSide = (() => {
    const start = (projectIndex) => {
        const todoSideDiv = _createTodoSideDiv(projectIndex);
        return todoSideDiv;
    };
    const _headerDiv = (projectIndex) => {
        const headerDiv = dom.createDiv('todos-header');
        const currentProject = projectList.getProjects().filter(project => project.getIndex() === Number(projectIndex))[0];
        headerDiv.innerHTML = currentProject.getTitle();
        return headerDiv;
    };
    const _newTodoDiv = () => {
        const newTodoDiv = dom.createDiv('new-todo-container');
        newTodoDiv.classList.add('todo');
        const newTodoInput = document.createElement('input');
        newTodoInput.setAttribute('placeholder', 'new todo');
        newTodoInput.id = 'new-todo-title';
        const newTodoBtn = dom.createBtn('new-todo-btn');
        newTodoBtn.innerHTML = '+';
        newTodoDiv.append(newTodoInput, newTodoBtn);

        // add eventlistner for the new todo button, which pushs a new todo into current project in projectList, and refresh todoSide
        newTodoBtn.addEventListener('click', () => {
            const newTodo = Todo(newTodoInput.value || 'new todo');
            newTodoInput.value = '';
            const currentProjectDiv = document.querySelector('.active');
            const currentProjectIndex = currentProjectDiv.id[currentProjectDiv.id.length - 1];
            const currentProject = projectList.getProjects().filter(project => project.getIndex() === Number(currentProjectIndex))[0];
            currentProject.addTodo(newTodo);
            const todosMainDiv = document.querySelector('.todos-main');
            const parentDiv = todosMainDiv.parentNode;
            parentDiv.replaceChild(_appendTodos(currentProject), todosMainDiv);
            document.querySelector('#new-todo-title').focus();

            // save new projectList to localStorage
            localStorage.setItem('projectList', JSON.stringify(projectList));
        });

        return newTodoDiv;
    };
    const _appendTodos = (project) => {
        const todosMainDiv = dom.createDiv('todos-main');
        // append project's todos into todos-main div
        const todos = project.getTodos();
        todos.forEach(todo => {
            const todoContainerDiv = dom.createDiv('todo-container');
            const todoDiv = dom.createDiv('todo');

            if (todo.getCheckStatus()) {todoDiv.classList.add('checked');}

            todoDiv.id = `todo-${todo.getIndex()}`;
            const todoTitleDiv = dom.createDiv('todo-title');
            todoTitleDiv.innerHTML = todo.getTitle();
            const todoCheckBtn = dom.createBtn('todo-check-btn');
            todoCheckBtn.innerHTML = '✓';
            todoDiv.append(todoTitleDiv, todoCheckBtn);
            todoContainerDiv.appendChild(todoDiv);
            todosMainDiv.appendChild(todoContainerDiv);

            // add eventlistner for todo to be checked, if it's expanded, update it and check it off.
            todoCheckBtn.addEventListener('click', () => {
                if (todoCheckBtn.parentElement.classList.contains('expanded')) {
                    todoDiv.classList.toggle('checked');
                    todo.toggleCheck();

                    // save new projectList to localStorage
                    const activeProjectIndex = document.querySelector('.active').id[document.querySelector('.active').id.length - 1];
                    const todoIndex = todoCheckBtn.parentElement.id[todoCheckBtn.parentElement.id.length - 1];
                    if (!projectList.projects[activeProjectIndex].todoList[todoIndex].checked) {
                        projectList.projects[activeProjectIndex].todoList[todoIndex].checked = true;
                    } else {
                        projectList.projects[activeProjectIndex].todoList[todoIndex].checked = false;
                    }
                    localStorage.setItem('projectList', JSON.stringify(projectList)); 

                    // save the details of the todo when closing it, by updating them, and restart todoSide, restart todoSide with updated details;
                    todoDiv.classList.toggle('expanded');
                    const todoDetailDiv = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]}`);
                    todo.updateTitle(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-title`).value);
                    todo.updateDescription(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-description`).value);
                    todo.updateDue(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-due`).value);
                    todo.updatePriority(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-priority`).value);

                    // save new projectList to localStorage
                    projectList.projects[activeProjectIndex].todoList[todoIndex].title = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-title`).value;
                    projectList.projects[activeProjectIndex].todoList[todoIndex].description = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-description`).value;
                    projectList.projects[activeProjectIndex].todoList[todoIndex].due = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-due`).value;
                    projectList.projects[activeProjectIndex].todoList[todoIndex].priority = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-priority`).value;
                    localStorage.setItem('projectList', JSON.stringify(projectList)); 

                    const currentProjectDiv = document.querySelector('.active');
                    const currentProjectIndex = currentProjectDiv.id[currentProjectDiv.id.length - 1];
                    initialize.restartTodoSide(currentProjectIndex);
                    todoContainerDiv.removeChild(todoDetailDiv);
                } else {
                    todoDiv.classList.toggle('checked');
                    todo.toggleCheck();

                    // save new projectList to localStorage
                    const activeProjectIndex = document.querySelector('.active').id[document.querySelector('.active').id.length - 1];
                    const todoIndex = todoCheckBtn.parentElement.id[todoCheckBtn.parentElement.id.length - 1];
                    if (!projectList.projects[activeProjectIndex].todoList[todoIndex].checked) {
                        projectList.projects[activeProjectIndex].todoList[todoIndex].checked = true;
                    } else {
                        projectList.projects[activeProjectIndex].todoList[todoIndex].checked = false;
                    }
                    localStorage.setItem('projectList', JSON.stringify(projectList));  
                }
            });

            // add eventlistner for todo to be expanded showing details and editing them, plus delete button;
            todoTitleDiv.addEventListener('click', () => {
                // if not checked, todo can be expanded to show details
                if (!todoTitleDiv.parentElement.classList.contains('checked')) {
                    if (!todoDiv.classList.contains('expanded')) {
                        todoDiv.classList.toggle('expanded');
                        const todoDetailDiv = _createTodoDetailDiv(todo, todoDiv);
                        todoContainerDiv.append(todoDetailDiv);
                        const todoDetailTitleInput = document.querySelector('#todo-detail-title');
                        todoDetailTitleInput.focus();

                        // add eventlistener for todo delete button to delete the currently expanded todo;
                        const todoDetailDeleteBtn = document.querySelector('#todo-detail-delete-btn');
                        todoDetailDeleteBtn.addEventListener('click', () => {
                            const currentProjectDiv = document.querySelector('.active');
                            const currentProjectIndex = currentProjectDiv.id[currentProjectDiv.id.length - 1];
                            const currentProject = projectList.getProjects()[currentProjectIndex];   
                            currentProject.deleteTodo(todo);

                            // save new projectList to localStorage
                            localStorage.setItem('projectList', JSON.stringify(projectList));

                            // restart todoSide with updated details
                            initialize.restartTodoSide(currentProjectIndex);
                            todoContainerDiv.removeChild(todoDetailDiv);
                        });

                    } else {
                        // save the details of the todo when closing it, by updating them, and restart todoSide;
                        todoDiv.classList.toggle('expanded');
                        const todoDetailDiv = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]}`);
                        todo.updateTitle(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-title`).value);
                        todo.updateDescription(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-description`).value);
                        todo.updateDue(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-due`).value);
                        todo.updatePriority(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-priority`).value);

                        // save new projectList to localStorage
                        const activeProjectIndex = document.querySelector('.active').id[document.querySelector('.active').id.length - 1];
                        const todoIndex = todoCheckBtn.parentElement.id[todoCheckBtn.parentElement.id.length - 1];
                        projectList.projects[activeProjectIndex].todoList[todoIndex].title = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-title`).value;
                        projectList.projects[activeProjectIndex].todoList[todoIndex].description = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-description`).value;
                        projectList.projects[activeProjectIndex].todoList[todoIndex].due = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-due`).value;
                        projectList.projects[activeProjectIndex].todoList[todoIndex].priority = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-priority`).value;
                        localStorage.setItem('projectList', JSON.stringify(projectList)); 

                        // restart todoSide with updated details
                        const currentProjectDiv = document.querySelector('.active');
                        const currentProjectIndex = currentProjectDiv.id[currentProjectDiv.id.length - 1];
                        initialize.restartTodoSide(currentProjectIndex);
                        todoContainerDiv.removeChild(todoDetailDiv);
                    }   
                }
            });
        });
        return todosMainDiv;
    };
    const _createTodoDetailDiv = (todo, todoDiv) => {
        const todoDetailDiv = dom.createDiv('todo-detail-container');
        todoDetailDiv.id = `todo-detail-${todoDiv.id[todoDiv.id.length - 1]}`;
        // elements inside todoDetailDiv:
        const todoDetailTitleDelete = dom.createDiv('todo-detail-title-delete');
        const todoDetailTitle = dom.createLabel('title', todo);
        const todoDetailDeleteBtn = dom.createBtn('todo-detail-delete-btn');
        todoDetailDeleteBtn.innerHTML = '×';
        todoDetailTitleDelete.append(todoDetailTitle, todoDetailDeleteBtn);
        const todoDetailDescription = dom.createLabel('description', todo);
        const todoDetailDuePriority = dom.createDiv('todo-detail-due-priority');
        const todoDetailDue = dom.createLabel('due', todo);
        const todoDetailPriority = dom.createLabel('priority', todo);
        todoDetailDuePriority.append(todoDetailDue, todoDetailPriority);
        todoDetailDiv.append(todoDetailTitleDelete, todoDetailDescription, todoDetailDuePriority);
        return todoDetailDiv;
    };
    const _createTodoSideDiv = (projectIndex) => {
        const todoSideDiv = dom.createDiv('todos-container');

        todoSideDiv.append(_headerDiv(projectIndex));

        const currentProject = projectList.getProjects().filter(project => project.getIndex() === Number(projectIndex))[0];

        todoSideDiv.append(_appendTodos(currentProject));
        todoSideDiv.append(_newTodoDiv());

        return todoSideDiv;
    };
    return {start};
})();

export default todoSide;