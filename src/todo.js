const Todo = (title, description, due, priority, checked) => {
    let index;
    const getIndex = () => index;
    const updateIndex = (i) => {index = i};
    const getTitle = () => title;
    const updateTitle = (i) => {title = i};
    const getDescription = () => description;
    const updateDescription = (i) => {description = i};
    const getDue = () => due;
    const updateDue = (i) => {due = i};
    const getPriority = () => priority;
    const updatePriority = (i) => {priority = i};
    const getCheckStatus = () => checked;
    const toggleCheck = () => {
        if (!checked) {
            checked = true;
        } else {
            checked = false;
        };
    }
    return {getIndex, updateIndex, getTitle, updateTitle, getDescription, updateDescription, 
            getDue, updateDue, getPriority, updatePriority, getCheckStatus, toggleCheck,
            title, description, due, priority, checked, index};
};

export default Todo;