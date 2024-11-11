function wrapElement(elem, id) {
    elem.id = id;
    elem.style.gridArea = id;
    elem.classList.add("window");
    elem.style.position = "relative";
    elem.style.display = "flex";
    elem.style.flexDirection = "column";
    elem.setLayout = function (layout) {
        elem.style.display = "grid";
        this.style.gridTemplateAreas = "\"" + layout.map((elem) => elem.join(" ")).join("\" \"") + "\"";
    };
    elem.setLayoutRows = function (row) {
        this.style.gridTemplateRows = row.join(" ");
    };
    elem.setLayoutColumns = function (col) {
        this.style.gridTemplateColumns = col.join(" ");
    };
    return elem;
}
export function createWindow(id) {
    let elem = document.createElement("div");
    return wrapElement(elem, id);
}
const App = wrapElement(document.body, "app");
export function Application(name) {
    document.title = name;
    return App;
}
//# sourceMappingURL=window.js.map