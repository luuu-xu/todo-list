import { collection, doc, getFirestore, setDoc, addDoc } from 'firebase/firestore';

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
  console.log(projectListFirestore);

  try {
    await setDoc(doc(getFirestore(), 'projectList', 'projects'), projectListFirestore);
  }
  catch(error) {
    console.error('Error writing new projectList to Firestore', error);
  }
}

export { saveDataToFirestore };