import welcome from "./welcome";
import Todo from "./Todo";
import { Project, ProjectList } from "./Project";

let projectList;

if (!localStorage.getItem("projectList")) {
  console.log("localstorage does not have data");

  projectList = welcome.createWelcomeProjects();

  localStorage.setItem("projectList", JSON.stringify(projectList));
} else {
  console.log("localstorage has data");
  // localStorage.clear();

  const storedProjectList = JSON.parse(localStorage.getItem("projectList"));

  if (storedProjectList.projects.length === 0) {
    console.log("localstorage has data but no projects");

    projectList = welcome.createWelcomeProjects();

    localStorage.setItem("projectList", JSON.stringify(projectList));
  } else {
    console.log("localstorage has data and projects");
    projectList = ProjectList();
    storedProjectList.projects.forEach((storedProject) => {
      const project = Project(storedProject.title);
      storedProject.todoList.forEach((storedTodo) => {
        const todo = Todo(
          storedTodo.title,
          storedTodo.description,
          storedTodo.due,
          storedTodo.priority,
          storedTodo.checked
        );
        project.addTodo(todo);
      });
      projectList.addProject(project);
    });
  }
}

export default projectList;
