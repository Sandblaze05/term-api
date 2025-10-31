import blessed from "blessed";

const screen = blessed.screen({
    smartCSR: true,
    title: "TermAPI",
    mouse: true
});

const layout = blessed.layout({
    width: "100%",
    height: "100%",
    layout: "grid"
});

const header = blessed.box({
    width: "100%",
    height: 3,
    content: "Term-API",
    tags: true,
    align: "center",
    valign: "middle",
    border: { type: "line" },
    style: {
        border: { fg: "cyan" },
        fg: "white",
        bg: "black",
        bold: true
    },
    padding: { left: 1, right: 1 }
});

const body = blessed.box({
    width: "100%",
    height: "100%-3",
    border: { type: "line" },
    style: {
        border: { fg: "cyan" },
        fg: "white",
        bg: "black"
    },
    scrollable: true,
    alwaysScroll: true,
    scrollbar: { style: { bg: "cyan" } }
});

const methodList = blessed.list({
    parent: body,
    top: 0,
    left: 0,
    width: "10%",
    height: 3,
    align: "center",
    label: "{yellow-fg}Method{/yellow-fg}",
    border: { type: "line" },
    style: {
        selected: { bg: "cyan" },
        border: { fg: "yellow" },
    },
    items: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    keys: true,
    vi: true,
    mouse: true,
    tags: true
});

const urlBar = blessed.textbox({
    parent: body,
    top: 0,
    right: 0,
    width: "89%",
    height: 3,
    label: "{cyan-fg}URL{/cyan-fg}",
    border: { type: "line" },
    style: {
        fg: "white",
        bg: "black",
        border: { fg: "cyan" },
    },
    inputOnFocus: true,
    tags: true,
    mouse: true
});

layout.append(header);
layout.append(body);
screen.append(layout);

const focusables = [methodList, urlBar];
let focusIndex = 0;


methodList.on("focus", () => {
    methodList.style.border.fg = "magenta";
    methodList.setLabel("{magenta-fg}Method{/magenta-fg}");
    screen.render();
});

methodList.on("blur", () => {
    methodList.style.border.fg = "yellow";
    methodList.setLabel("{yellow-fg}Method{/yellow-fg}");
    screen.render();
});

urlBar.on("focus", () => {
    urlBar.style.border.fg = "magenta";
    urlBar.setLabel("{magenta-fg}URL{/magenta-fg}");
    screen.render();
});

urlBar.on("blur", () => {
    urlBar.style.border.fg = "cyan";
    urlBar.setLabel("{cyan-fg}URL{/cyan-fg}");
    screen.render();
});

methodList.on("click", () => {
    methodList.focus();
});

urlBar.on("click", () => {
    urlBar.focus();
});

function focusNext() {
    focusIndex = (focusIndex + 1) % focusables.length;
    focusables[focusIndex].focus();
    screen.render();
}

function focusPrev() {
    focusIndex = (focusIndex - 1 + focusables.length) % focusables.length;
    focusables[focusIndex].focus();
    screen.render();
}

screen.key(["tab"], (ch, key) => {
    focusNext();
});

screen.key(["S-tab"], (ch, key) => {
    focusPrev();
});

urlBar.key(["tab"], (ch, key) => {
    focusNext();
    return false;
});

urlBar.key(["S-tab"], (ch, key) => {
    focusPrev();
    return false;
});

urlBar.on("submit", (value) => {
    header.setContent(`URL Entered: ${value}`);
    screen.render();
});

methodList.focus();
screen.key(["q", "C-c", "escape"], () => process.exit(0));
screen.render();    