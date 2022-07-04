import { auth } from "./firebase/auth";
import dom from "./dom";
import initialize from "./initialize";
import projectList from "./localstorage";
import { Project } from "./Project";

const projectSide = (() => {
  const start = () => {
    const projectSideDiv = _createProjectSideDiv();
    return projectSideDiv;
  };
  const _headerDiv = () => {
    const headerDiv = dom.createDiv("projects-header");
    headerDiv.innerHTML = "Projects";
    return headerDiv;
  };
  const _newProjectDiv = () => {
    const newProjectDiv = dom.createDiv("new-project-container");
    const newProjectInput = document.createElement("input");
    newProjectInput.setAttribute("placeholder", "New Project");
    newProjectInput.id = "new-project-title";
    const newProjectBtn = dom.createBtn("new-project-btn");
    newProjectBtn.innerHTML = "+";
    newProjectDiv.append(newProjectInput, newProjectBtn);

    // add eventlistner for the new project button, which push a new project into projectList, and refresh projectSide, as well as todoSide
    newProjectBtn.addEventListener("click", () => {
      const newProject = Project(newProjectInput.value || "New Project");
      newProjectInput.value = "";
      projectList.addProject(newProject);

      // save new projectList to localStorage
      localStorage.setItem("projectList", JSON.stringify(projectList));

      const projectsMainDiv = document.querySelector(".projects-main");
      const parentDiv = projectsMainDiv.parentNode;
      parentDiv.replaceChild(_appendProjects(), projectsMainDiv);
      const projectIndex = projectList.getProjects().length - 1;
      document.querySelectorAll(".project").forEach((project) => {
        project.classList.remove("active");
      });
      document
        .querySelector(`#project-${projectIndex}`)
        .classList.add("active");
      addProjectDeleteBtn();
      initialize.restartTodoSide(projectIndex);
    });

    return newProjectDiv;
  };
  const addProjectDeleteBtn = () => {
    // if active, projectDiv has delete btn
    // remove other delete buttons first
    const deleteBtn = document.querySelector("#project-delete-btn");
    if (deleteBtn) {
      deleteBtn.parentElement.removeChild(deleteBtn);
    }

    const activeProjectDiv = document.querySelector(".active");
    const projectDeleteBtn = dom.createBtn("project-delete-btn");
    projectDeleteBtn.innerHTML = "×";
    activeProjectDiv.append(projectDeleteBtn);
    projectDeleteBtn.addEventListener("click", () => {
      const currentProjectIndex =
        activeProjectDiv.id[activeProjectDiv.id.length - 1];
      console.log(currentProjectIndex);
      console.log(projectList);
      projectList.deleteProject(currentProjectIndex);
      console.log("after deleting project" + projectList.getProjects());

      // save new projectList to localStorage
      localStorage.setItem("projectList", JSON.stringify(projectList));

      // restart projectSide

      const projectsMainDiv = document.querySelector(".projects-main");
      const parentDiv = projectsMainDiv.parentNode;
      parentDiv.replaceChild(_appendProjects(), projectsMainDiv);

      // if there is a project remaining, restart todoSide too with the last project active,
      // if no projects are left, restart todoSide saying please add a new project
      if (projectList.getProjects().length !== 0) {
        const projectIndex = projectList.getProjects().length - 1;
        // console.log('projectindex' + projectIndex);
        document.querySelectorAll(".project").forEach((project) => {
          project.classList.remove("active");
        });
        document
          .querySelector(`#project-${projectIndex}`)
          .classList.add("active");
        addProjectDeleteBtn();
        initialize.restartTodoSide(projectIndex);
      } else {
        initialize.noProjectsLeftPage();
      }
    });
  };
  const _appendProjects = () => {
    const projectsMainDiv = dom.createDiv("projects-main");

    const projects = projectList.getProjects();
    let i = 0;
    projects.forEach((project) => {
      // append projects currently in projectList into projectDiv
      const projectDiv = dom.createDiv("project");
      projectDiv.id = `project-${i}`;
      i++;
      const projectTitle = dom.createDiv("project-title");
      projectTitle.innerHTML = project.getTitle();
      projectDiv.append(projectTitle);

      projectsMainDiv.appendChild(projectDiv);

      // add eventlistener for choosing the project if not active, or changing to rename/delete if active
      projectTitle.addEventListener("click", () => {
        if (!projectDiv.classList.contains("active")) {
          document.querySelectorAll(".project").forEach((project) => {
            project.classList.remove("active");
          });
          projectDiv.classList.add("active");

          addProjectDeleteBtn();

          const projectIndex = projectDiv.id[projectDiv.id.length - 1];
          initialize.restartTodoSide(projectIndex);
        } else {
          const projectRenameInput = document.createElement("input");
          projectRenameInput.setAttribute(
            "placeholder",
            `${project.getTitle()}`
          );
          projectRenameInput.id = "project-rename-input";
          const projectRenameBtn = dom.createBtn("project-rename-btn");
          projectRenameBtn.innerHTML = "✓";
          projectDiv.innerHTML = "";
          projectDiv.append(projectRenameInput, projectRenameBtn);
          projectRenameInput.focus();

          // add eventlistener for projectRenameBtn to update the project title
          projectRenameBtn.addEventListener("click", () => {
            const projectIndex = projectDiv.id[projectDiv.id.length - 1];
            project.updateTitle(
              projectRenameInput.value || `${project.getTitle()}`
            );

            // save new projectList to localStorage
            // projectList.projects[projectDiv.id[projectDiv.id.length - 1]].title = projectRenameInput.value || `${project.getTitle()}`;
            projectList.projects[projectIndex].title =
              projectRenameInput.value || `${project.getTitle()}`;

            localStorage.setItem("projectList", JSON.stringify(projectList));

            // restart projectSide + todoSide
            const projectsMainDiv = document.querySelector(".projects-main");
            const parentDiv = projectsMainDiv.parentNode;
            parentDiv.replaceChild(_appendProjects(), projectsMainDiv);
            initialize.restartTodoSide(projectIndex);
            document
              .querySelector(`#project-${projectIndex}`)
              .classList.add("active");
            addProjectDeleteBtn();
          });
        }
      });
    });

    return projectsMainDiv;
  };

  // const _auth = () => {
  //   const authDiv = dom.createDiv("auth-container");
  //   const userPic = dom.createDiv("auth-user-pic");
  //   const userName = dom.createDiv("auth-user-name");
  //   const signInBtn = dom.createBtn("auth-sign-in-btn");
  //   signInBtn.innerHTML = "Sign-in";


  //   authDiv.append(userPic, userName, signInBtn);

  //   return authDiv;
  // };

  const _createProjectSideDiv = () => {
    const projectSideDiv = dom.createDiv("project-side");

    const projectsContainer = dom.createDiv("projects-container");
    projectsContainer.append(_headerDiv());
    projectsContainer.append(_appendProjects());
    projectsContainer.append(_newProjectDiv());

    projectSideDiv.append(projectsContainer);
    projectSideDiv.append(auth());

    return projectSideDiv;
  };

  return { start, addProjectDeleteBtn };
})();

export default projectSide;
