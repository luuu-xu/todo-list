import Todo from './todo';
import {Project, ProjectList} from './project';
import projectList from './welcome';

const dom = (() => {
    const createDiv = (name) => {
        const div = document.createElement('div');
        div.className = name;
        return div; 
    };
    const createBtn = (name) => {
        const btn = document.createElement('button');
        btn.id = name;
        return btn;
    };
    const _createInput = (name) => {
        const input = document.createElement('input');
        input.id = name;
        input.className = 'todo-detail-input';
        return input;
    };
    const _createOption = (name) => {
        const option = document.createElement('option');
        option.setAttribute('value', name);
        option.innerHTML = name;
        return option;
    }
    const _createSelect = (name) => {
        const select = document.createElement('select');
        select.id = name;
        select.className = 'todo-detail-input';
        const now = _createOption('now!');
        const later = _createOption('later');
        const eventually = _createOption('eventually');
        select.append(now, later, eventually);
        return select;
    }
    const createLabel = (name, todo) => {
        const label = document.createElement('label');
        label.innerHTML = `${name}: `;
        let input;
        if (name === 'title') {
            input = _createInput(`todo-detail-${name}`);
            input.value = todo.getTitle() || '';
        } else if (name === 'description') {
            input = _createInput(`todo-detail-${name}`);
            input.value = todo.getDescription() || '';
        } else if (name === 'due') {
            input = _createInput(`todo-detail-${name}`);
            input.setAttribute('type', 'date');
            input.value = todo.getDue() || '';
        } else if (name === 'priority') {
            input = _createSelect(`todo-detail-${name}`);
            input.value = todo.getPriority() || 'eventually';
        };
        label.append(input);
        return label;
    }
    return {createDiv, createBtn, createLabel};
})();

const headerSide = (() => {
    const start = () => {
        const headerDiv = dom.createDiv('header-container');
        const header = dom.createDiv('header');
        header.innerHTML = 'Todooo';
        headerDiv.appendChild(header);
        return headerDiv;
    };
    return {start};
})();

const projectSide = (() => {
    const start = () => {
        const projectSideDiv = _createProjectSideDiv();
        return projectSideDiv;
    };
    const _headerDiv = () => {
        const headerDiv = dom.createDiv('projects-header');
        headerDiv.innerHTML = 'Projects';
        return headerDiv;
    };
    const _newProjectDiv = () => {
        const newProjectDiv = dom.createDiv('new-project-container');
        const newProjectInput = document.createElement('input');
        newProjectInput.setAttribute('placeholder', 'New Project');
        newProjectInput.id = 'new-project-title';
        const newProjectBtn = dom.createBtn('new-project-btn');
        newProjectBtn.innerHTML = '+';
        newProjectDiv.append(newProjectInput, newProjectBtn);

        // add eventlistner for the new project button, which push a new project into projectList, and refresh projectSide, as well as todoSide
        newProjectBtn.addEventListener('click', () => {
            const newProject = Project(newProjectInput.value || 'New Project');
            newProjectInput.value = '';
            projectList.addProject(newProject);

            // save new projectList to localStorage
            localStorage.setItem('projectList', JSON.stringify(projectList));

            const projectsMainDiv = document.querySelector('.projects-main');
            const parentDiv = projectsMainDiv.parentNode;
            parentDiv.replaceChild(_appendProjects(), projectsMainDiv);
            const projectIndex = projectList.getProjectIndex() - 1;
            document.querySelectorAll('.project').forEach((project) => {project.classList.remove('active')});
            document.querySelector(`#project-${projectIndex}`).classList.add('active');
            addProjectDeleteBtn();
            initialize.restartTodoSide(projectIndex);
        });

        return newProjectDiv;
    };
    const addProjectDeleteBtn = () => {
        // if active, projectDiv has delete btn
        // remove other delete buttons first
        const deleteBtn = document.querySelector('#project-delete-btn');
        if (deleteBtn) {deleteBtn.parentElement.removeChild(deleteBtn)};

        const activeProjectDiv = document.querySelector('.active');
        const projectDeleteBtn = dom.createBtn('project-delete-btn');
        projectDeleteBtn.innerHTML = '×';
        activeProjectDiv.append(projectDeleteBtn);
        projectDeleteBtn.addEventListener('click', () => {
            const currentProjectIndex = activeProjectDiv.id[activeProjectDiv.id.length - 1];
            projectList.deleteProject(Number(currentProjectIndex));

            // save new projectList to localStorage
            localStorage.setItem('projectList', JSON.stringify(projectList));

            // restart projectSide, if there is a project remaining, restart todoSide too;
            // if no projects left, restart todoSide saying "please add a new project"
            const projectsMainDiv = document.querySelector('.projects-main');
            const parentDiv = projectsMainDiv.parentNode;
            parentDiv.replaceChild(_appendProjects(), projectsMainDiv);

            if (projectList.getProjects().length !== 0) {
                const projectIndex = projectList.getProjects()[projectList.getProjects().length - 1].getIndex();
                document.querySelectorAll('.project').forEach((project) => {project.classList.remove('active')});
                document.querySelector(`#project-${projectIndex}`).classList.add('active');
                addProjectDeleteBtn();
                initialize.restartTodoSide(projectIndex);
            } else {
                initialize.noProjectsLeftPage();
            };
        });
    };
    const _appendProjects = () => {
        const projectsMainDiv = dom.createDiv('projects-main');
        
        const projects = projectList.getProjects();
        projects.forEach(project => {
            // append projects currently in projectList into projectDiv
            const projectDiv = dom.createDiv('project');
            projectDiv.id = `project-${project.getIndex()}`;
            const projectTitle = dom.createDiv('project-title');
            projectTitle.innerHTML = project.getTitle();
            projectDiv.append(projectTitle);

            projectsMainDiv.appendChild(projectDiv);

            // add eventlistener for choosing the project if not active, or changing to rename/delete if active
            projectTitle.addEventListener('click', () => {
                if (!projectDiv.classList.contains('active')) {
                    document.querySelectorAll('.project').forEach((project) => {project.classList.remove('active')});
                    projectDiv.classList.add('active');

                    addProjectDeleteBtn();

                    const projectIndex = projectDiv.id[projectDiv.id.length - 1];
                    initialize.restartTodoSide(projectIndex);
                } else {
                    const projectRenameInput = document.createElement('input');
                    projectRenameInput.setAttribute('placeholder', `${project.getTitle()}`);
                    projectRenameInput.id = 'project-rename-input';
                    const projectRenameBtn = dom.createBtn('project-rename-btn');
                    projectRenameBtn.innerHTML = '✓';
                    projectDiv.innerHTML = '';
                    projectDiv.append(projectRenameInput, projectRenameBtn);
                    projectRenameInput.focus();

                    // add eventlistener for projectRenameBtn to update the project title
                    projectRenameBtn.addEventListener('click', () => {
                        project.updateTitle(projectRenameInput.value || `${project.getTitle()}`);

                        // save new projectList to localStorage
                        projectList.projects[projectDiv.id[projectDiv.id.length - 1]].title = projectRenameInput.value || `${project.getTitle()}`;
                        localStorage.setItem('projectList', JSON.stringify(projectList));  

                        // restart projectSide + todoSide
                        const projectsMainDiv = document.querySelector('.projects-main');
                        const parentDiv = projectsMainDiv.parentNode;
                        parentDiv.replaceChild(_appendProjects(), projectsMainDiv);
                        initialize.restartTodoSide(project.getIndex());
                        document.querySelector(`#project-${project.getIndex()}`).classList.add('active');
                        addProjectDeleteBtn();
                    });
                };
            });
        });

        return projectsMainDiv;
    };
    const _createProjectSideDiv = () => {
        const projectSideDiv = dom.createDiv('projects-container');

        projectSideDiv.append(_headerDiv());
        projectSideDiv.append(_appendProjects());
        projectSideDiv.append(_newProjectDiv());

        return projectSideDiv;
    };
    return {start, addProjectDeleteBtn};
})();

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

            if (todo.getCheckStatus()) {todoDiv.classList.add('checked')};

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
                    };
                    localStorage.setItem('projectList', JSON.stringify(projectList)); 

                    // save the details of the todo when closing it, by updating them, and restart todoSide, restart todoSide with updated details;
                    todoDiv.classList.toggle('expanded');
                    const todoDetailDiv = document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]}`);
                    todo.updateTitle(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-title`).value);
                    todo.updateDescription(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-description`).value);
                    todo.updateDue(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-due`).value);
                    todo.updatePriority(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-priority`).value)

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
                    };
                    localStorage.setItem('projectList', JSON.stringify(projectList));  
                };
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
                        todo.updatePriority(document.querySelector(`#todo-detail-${todoDiv.id[todoDiv.id.length - 1]} #todo-detail-priority`).value)

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
                    };    
                };
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

const initialize = (() => {
    const start = () => {
        const headerDiv = headerSide.start();
        const mainDiv = dom.createDiv('main-container');
        const projectsDiv = projectSide.start();
        const todosDiv = todoSide.start(0);
        mainDiv.append(projectsDiv, todosDiv);
        document.body.append(headerDiv, mainDiv);
        // setting project-0 welcome project to be active
        document.querySelector('#project-0').classList.add('active');
        projectSide.addProjectDeleteBtn();
    };
    const restartTodoSide = (projectIndex) => {
        const todosDiv = document.querySelector('.todos-container');
        const newTodosDiv = todoSide.start(projectIndex);
        todosDiv.parentNode.replaceChild(newTodosDiv, todosDiv);
    };
    const noProjectsLeftPage = () => {
        const todosHeaderDiv = document.querySelector('.todos-header');
        const messageDiv = dom.createDiv('todos-header');
        messageDiv.innerHTML = 'please add a new project';
        todosHeaderDiv.replaceWith(messageDiv);
        document.querySelector('.todos-main').remove();
        document.querySelector('.new-todo-container').remove();
    };
    return {start, restartTodoSide, noProjectsLeftPage};
})();

export default initialize;