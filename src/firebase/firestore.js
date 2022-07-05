import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { Project, ProjectList } from '../Project';
import Todo from '../Todo';
import welcome from '../welcome';
import { getFirebaseConfig } from './firebase-config';

// Saves projectList data onto Cloud Firestore.
async function saveDataToFirestore(projectList) {
let projectListFirestore = {};
  let i = 0;

  projectList.projects.forEach((project) => {
    let projectFirestore = {};
    let todoListFirestore = [];

    project.todoList.map((todo) => {
      const todoFirestore = {
        title: todo.title || null,
        description: todo.description || null,
        due: todo.due || null,
        priority: todo.priority || null,
        checked: todo.checked || false,
      };
      todoListFirestore.push(todoFirestore);
    });

    projectFirestore['title'] = project.title;
    projectFirestore['todos'] = todoListFirestore;

    projectListFirestore[i] = projectFirestore;

    i++;
  });

  try {
    await setDoc(doc(getFirestore(), 'projectList', 'projects'), projectListFirestore);
  }
  catch(error) {
    console.error('Error writing new projectList to Firestore', error);
  }
}

// Reads and listens to Cloud Firestore projectList.
async function loadDataFromFirestore() {
  let projectList;

  // Create the getDoc to load projectList and listen for updates.
  try {
    const docSnap = await getDoc(doc(getFirestore(), 'projectList', 'projects'));

    // Use welcomeProjects if Firestore does not have data, otherwise convert data back to projectList.
    if (!docSnap.exists()) {
      console.log('Firestore does not have data.')
      projectList = welcome.createWelcomeProjects();
      await saveDataToFirestore(projectList);
      return projectList;
    } else {
      console.log('Firestore has data.')
      
      if (Object.keys(docSnap.data()).length === 0) {
        console.log('Firestore has data but no projects.')
        projectList = welcome.createWelcomeProjects();
        await saveDataToFirestore(projectList);
        return projectList;
      } else {
        console.log('Firestore has data and projects too.')
        projectList = ProjectList();
        const storedProjectList = docSnap.data();
        Object.keys(storedProjectList).map((storedProjectIndex) => {
          const storedProject = storedProjectList[storedProjectIndex];
          const project = Project(storedProject.title);
          storedProject.todos.forEach((storedTodo) => {
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
        return projectList;  
      }
    }
  }
  catch(error) {
    console.error('Error reading projectList from Firestore', error);
  }
}

const firebaseAppConfig = getFirebaseConfig();
initializeApp(firebaseAppConfig);

const projectList = await loadDataFromFirestore();

export { saveDataToFirestore, projectList, loadDataFromFirestore };