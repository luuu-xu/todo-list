import dom from "./dom";

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

export default headerSide;