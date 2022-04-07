const dom = (() => {
  const createDiv = (name) => {
    const div = document.createElement("div");
    div.className = name;
    return div;
  };
  const createBtn = (name) => {
    const btn = document.createElement("button");
    btn.id = name;
    return btn;
  };
  const _createInput = (name) => {
    const input = document.createElement("input");
    input.id = name;
    input.className = "todo-detail-input";
    return input;
  };
  const _createOption = (name) => {
    const option = document.createElement("option");
    option.setAttribute("value", name);
    option.innerHTML = name;
    return option;
  };
  const _createSelect = (name) => {
    const select = document.createElement("select");
    select.id = name;
    select.className = "todo-detail-input";
    const now = _createOption("now!");
    const later = _createOption("later");
    const eventually = _createOption("eventually");
    select.append(now, later, eventually);
    return select;
  };
  const createLabel = (name, todo) => {
    const label = document.createElement("label");
    label.innerHTML = `${name}: `;
    let input;
    if (name === "title") {
      input = _createInput(`todo-detail-${name}`);
      input.value = todo.getTitle() || "";
    } else if (name === "description") {
      input = _createInput(`todo-detail-${name}`);
      input.value = todo.getDescription() || "";
    } else if (name === "due") {
      input = _createInput(`todo-detail-${name}`);
      input.setAttribute("type", "date");
      input.value = todo.getDue() || "";
    } else if (name === "priority") {
      input = _createSelect(`todo-detail-${name}`);
      input.value = todo.getPriority() || "eventually";
    }
    label.append(input);
    return label;
  };
  return { createDiv, createBtn, createLabel };
})();

export default dom;
