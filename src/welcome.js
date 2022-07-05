import Todo from "./Todo";
import { Project, ProjectList } from "./Project";

const welcome = (() => {
  const createWelcomeProjects = () => {
    const projectWelcome = Project("Welcome");
    projectWelcome.addTodos([
      Todo("welcome! this is your first todo"),
      Todo("check todo off on the right"),
      Todo(
        "click on the todo to see the details",
        "this is the description",
        "2022-04-01",
        "eventually"
      ),
      Todo(
        "open the details, update and close to see the change",
        "try it! change the title to your name!",
        "2022-02-22",
        "now!"
      ),
      Todo("delete todo in the details"),
      Todo("change to Project 2 on the left side"),
    ]);
    const project2 = Project("Project 2");
    project2.addTodos([
      Todo("hello again! this is the second project"),
      Todo("you manage your projects on the left side"),
      Todo("rename project by clicking on it"),
      Todo("you can delete project too"),
      Todo("name and add your new project!"),
    ]);
    const projectList = ProjectList();
    projectList.addProject(projectWelcome);
    projectList.addProject(project2);
    return projectList;
  };
  return { createWelcomeProjects };
})();

export default welcome;