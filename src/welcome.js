import Todo from './todo';
import {Project, ProjectList} from './project';

let projectList;

if (!localStorage.getItem('projectList')) {
    console.log('localstorage does not have data');

    const projectWelcome = Project('Welcome');
    projectWelcome.addTodos([Todo('welcome! this is your first todo'), 
    Todo('check todo off on the right'), 
    Todo('click on the todo to see the details', 'this is the description', '2022-04-01', 'eventually'), 
    Todo('open the details, update and close to see the change', 'try it! change the title to your name!', '2022-02-22', 'now!'),
    Todo('delete todo in the details'),
    Todo('change to Project 2 on the left side')]);
    const project2 = Project('Project 2');
    project2.addTodos([Todo('hello again! this is the second project'),
    Todo('you manage your projects on the left side'),
    Todo('rename project by clicking on it'),
    Todo('you can delete project too'),
    Todo('name and add your new project!')]);
    projectList = ProjectList();
    projectList.addProject(projectWelcome);
    projectList.addProject(project2);
    
    localStorage.setItem('projectList', JSON.stringify(projectList));

} else {
        console.log('localstorage has data');
        // localStorage.clear();
    
        const storedProjectList = JSON.parse(localStorage.getItem('projectList'));

        if (storedProjectList.projects.length === 0) {
            console.log('localstorage has data but no projects');
            const projectWelcome = Project('Welcome');
            projectWelcome.addTodos([Todo('welcome! this is your first todo'), 
            Todo('check todo off on the right'), 
            Todo('click on the todo to see the details', 'this is the description', '2022-04-01', 'eventually'), 
            Todo('open the details, update and close to see the change', 'try it! change the title to your name!', '2022-02-22', 'now!'),
            Todo('delete todo in the details'),
            Todo('change to Project 2 on the left side')]);
            const project2 = Project('Project 2');
            project2.addTodos([Todo('hello again! this is the second project'),
            Todo('you manage your projects on the left side'),
            Todo('rename project by clicking on it'),
            Todo('you can delete project too'),
            Todo('name and add your new project!')]);
            projectList = ProjectList();
            projectList.addProject(projectWelcome);
            projectList.addProject(project2);
            
            localStorage.setItem('projectList', JSON.stringify(projectList));
        } else {
            console.log('localstorage has data and projects');
            projectList = ProjectList();
            storedProjectList.projects.forEach(storedProject => {
                const project = Project(storedProject.title);
                storedProject.todoList.forEach(storedTodo => {
                    const todo = Todo(storedTodo.title, storedTodo.description, storedTodo.due, storedTodo.priority, storedTodo.checked);
                    project.addTodo(todo);
                });
                projectList.addProject(project);
            });
        };
};

export default projectList;