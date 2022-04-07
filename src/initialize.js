import dom from "./dom";
import headerSide from "./headerSide";
import projectSide from "./projectSide";
import todoSide from "./todoSide";

const initialize = (() => {
  const start = () => {
    const headerDiv = headerSide.start();
    const mainDiv = dom.createDiv("main-container");
    const projectsDiv = projectSide.start();
    const todosDiv = todoSide.start(0);
    mainDiv.append(projectsDiv, todosDiv);
    document.body.append(headerDiv, mainDiv);
    // setting project-0 welcome project to be active
    document.querySelector("#project-0").classList.add("active");
    projectSide.addProjectDeleteBtn();
  };
  const restartTodoSide = (projectIndex) => {
    const todosDiv = document.querySelector(".todos-container");
    const newTodosDiv = todoSide.start(projectIndex);
    todosDiv.parentNode.replaceChild(newTodosDiv, todosDiv);
  };
  const noProjectsLeftPage = () => {
    const todosHeaderDiv = document.querySelector(".todos-header");
    const messageDiv = dom.createDiv("todos-header");
    messageDiv.innerHTML = "please add a new project";
    todosHeaderDiv.replaceWith(messageDiv);
    document.querySelector(".todos-main").remove();
    document.querySelector(".new-todo-container").remove();
  };
  return { start, restartTodoSide, noProjectsLeftPage };
})();

export default initialize;
