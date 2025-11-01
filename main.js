import blessed from "blessed";

const colors = {
    foreground: "#84FFFF",
    background: "#292D3E",
}

const screen = blessed.screen({
    smartCSR: true,
    title: "TermAPI - Tab/Shift+Tab to navigate | Enter to select | 1-4 for tabs | q to quit",
    mouse: true,
    sendFocus: true,
    warnings: false,
    forceUnicode: true,
    fullUnicode: true
});

const header = blessed.box({
    parent: screen,
    top: 0,
    left: 0,
    width: "100%",
    height: 3,
    content: "{center}Term-API{/center}\n{center}{gray-fg}Tab/Shift+Tab: Navigate | Enter: Select | 1-4: Switch Tabs | q: Quit{/gray-fg}{/center}",
    tags: true,
    border: { type: "line" },
    style: {
        border: { fg: colors.foreground },
        fg: "white",
        bg: colors.background,
        bold: true
    }
});

const body = blessed.box({
    parent: screen,
    top: 3,
    left: 0,
    width: "100%",
    height: "100%-3",
    border: { type: "line" },
    style: {
        border: { fg: colors.foreground },
        fg: "white",
        bg: colors.background
    },
    scrollable: true,
    alwaysScroll: true,
    scrollbar: { style: { bg: colors.foreground } }
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
        selected: { 
            bg: colors.foreground, 
            fg: "black" 
        },
        border: { fg: "yellow" },
        focus: {
            border: { fg: "magenta" },
        }
    },
    items: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    keys: true,
    vi: true,
    mouse: true,
    tags: true,
    clickable: true,
    interactive: true
});

const urlBar = blessed.textbox({
    parent: body,
    top: 0,
    left: "10%",
    width: "89%",
    height: 3,
    label: "{cyan-fg}URL{/cyan-fg}",
    border: { type: "line" },
    style: {
        fg: "white",
        bg: colors.background,
        border: { fg: colors.foreground },
        focus: {
            border: { fg: "magenta" }
        }
    },
    inputOnFocus: true,
    tags: true,
    mouse: true,
    clickable: true
});

const tabBar = blessed.listbar({
    parent: body,
    top: 3,
    left: 0,
    width: "100%",
    height: 3,
    style: {
        bg: colors.background,
        item: {
            fg: "white",
            bg: colors.background,
            hover: {
                fg: "black",
                bg: colors.foreground
            }
        },
        selected: {
            fg: "black",
            bg: colors.foreground
        }
    },
    commands: {
        "Params": { keys: ["1"] },
        "Auth": { keys: ["2"] },
        "Headers": { keys: ["3"] },
        "Body": { keys: ["4"] }
    },
    mouse: true,
    autoCommandKeys: true
});

const tabContent = blessed.box({
    parent: body,
    top: 4,
    left: 0,
    width: "99%",
    height: "70%-9",
    border: { type: "line" },
    style: {
        border: { fg: colors.foreground },
        fg: "white",
        bg: colors.background
    },
    scrollable: true,
    alwaysScroll: true,
    mouse: true,
    keys: true,
    vi: true,
    padding: 1
});

const statusBar = blessed.box({
    parent: body,
    bottom: 0,
    left: 0,
    width: "99%",
    height: 3,
    content: "{center}{green-fg}Ready{/green-fg}{/center}",
    tags: true,
    border: { type: "line" },
    style: {
        border: { fg: colors.foreground },
        fg: "white",
        bg: colors.background
    }
});

const paramsBox = blessed.box({
    parent: tabContent,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    content: "Enter query parameters here...\n\nExample:\nkey1=value1\nkey2=value2\n\nPress 'i' to edit, Escape when done",
    tags: true,
    scrollable: true,
    style: {
        fg: "white",
        bg: colors.background
    },
    mouse: true,
    keys: true,
    vi: true
});

const authBox = blessed.box({
    parent: tabContent,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    content: "Configure authentication here...\n\nExample:\nBearer token\nAPI Key\nBasic Auth\n\nPress 'i' to edit, Escape when done",
    tags: true,
    scrollable: true,
    style: {
        fg: "white",
        bg: colors.background
    },
    hidden: true,
    mouse: true,
    keys: true,
    vi: true
});

const headersBox = blessed.box({
    parent: tabContent,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    content: "Add request headers here...\n\nExample:\nContent-Type: application/json\nAccept: application/json\nAuthorization: Bearer token\n\nPress 'i' to edit, Escape when done",
    tags: true,
    scrollable: true,
    style: {
        fg: "white",
        bg: colors.background
    },
    hidden: true,
    mouse: true,
    keys: true,
    vi: true
});

const bodyBox = blessed.box({
    parent: tabContent,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    content: "Enter request body here...\n\nExample:\n{\n  \"key\": \"value\",\n  \"name\": \"test\"\n}\n\nPress 'i' to edit, Escape when done",
    tags: true,
    scrollable: true,
    style: {
        fg: "white",
        bg: colors.background
    },
    hidden: true,
    mouse: true,
    keys: true,
    vi: true
});

const tabs = {
    "Params": paramsBox,
    "Auth": authBox,
    "Headers": headersBox,
    "Body": bodyBox
};

let currentTab = "Params";
let activeTab = 0;

// Handle tab switching
tabBar.on("select", (item) => {
    const selectedTab = item.content;
    
    Object.values(tabs).forEach(tab => {
        tab.hide();
    });
    
    if (tabs[selectedTab]) {
        tabs[selectedTab].show();
        currentTab = selectedTab;
        statusBar.setContent(`{center}{green-fg}Tab: ${selectedTab}{/green-fg}{/center}`);
    }
    
    screen.render();
});

// Initialize first tab as selected
setTimeout(() => {
    tabBar.selectTab(0);
    paramsBox.show();
    screen.render();
}, 100);

const focusables = [methodList, urlBar, tabBar, tabContent];
let focusIndex = 0;

methodList.on("focus", () => {
    methodList.setLabel("{magenta-fg}Method (↑↓){/magenta-fg}");
    statusBar.setContent(`{center}{yellow-fg}Use ↑↓ arrows to select method, Enter to confirm{/yellow-fg}{/center}`);
    screen.render();
});

methodList.on("blur", () => {
    methodList.setLabel("{yellow-fg}Method{/yellow-fg}");
    screen.render();
});

methodList.on("select", (item, index) => {
    statusBar.setContent(`{center}{green-fg}Method: ${item.content}{/green-fg}{/center}`);
    screen.render();
});

urlBar.on("focus", () => {
    urlBar.setLabel("{magenta-fg}URL (type and press Enter){/magenta-fg}");
    statusBar.setContent(`{center}{yellow-fg}Enter URL and press Enter{/yellow-fg}{/center}`);
    screen.render();
});

urlBar.on("blur", () => {
    urlBar.setLabel("{cyan-fg}URL{/cyan-fg}");
    screen.render();
});

tabBar.on("focus", () => {
    statusBar.setContent(`{center}{yellow-fg}Use ←→ arrows or 1-4 keys to switch tabs{/yellow-fg}{/center}`);
    screen.render();
});

tabContent.on("focus", () => {
    statusBar.setContent(`{center}{yellow-fg}Editing ${currentTab} - Press Escape when done{/yellow-fg}{/center}`);
    screen.render();
});

// Click handlers
methodList.on("click", () => {
    focusIndex = 0;
    methodList.focus();
    screen.render();
});

urlBar.on("click", () => {
    focusIndex = 1;
    urlBar.focus();
    screen.render();
});

tabBar.on("click", () => {
    focusIndex = 2;
    tabBar.focus();
    screen.render();
});

tabContent.on("click", () => {
    focusIndex = 3;
    tabContent.focus();
    screen.render();
});

screen.on("mouse", (data) => {
    if (data.action === "mousedown") {
        screen.render();
    }
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

urlBar.on("submit", (value) => {
    header.setContent(`{center}Term-API{/center}\n{center}{green-fg}URL: ${value}{/green-fg}{/center}`);
    statusBar.setContent(`{center}{green-fg}URL set: ${value}{/green-fg}{/center}`);
    screen.render();
});

// Fixed number keys for tab switching
screen.key(["1"], () => {
    // Hide current tab
    switch (activeTab) {
        case 0:
            paramsBox.hide();
            break;
        case 1:
            authBox.hide();
            break;
        case 2:
            headersBox.hide();
            break;
        case 3:
            bodyBox.hide();
            break;
    }
    
    // Set new tab
    activeTab = 0;
    tabBar.selectTab(0);
    paramsBox.show();
    screen.render();
});

screen.key(["2"], () => {
    // Hide current tab
    switch (activeTab) {
        case 0:
            paramsBox.hide();
            break;
        case 1:
            authBox.hide();
            break;
        case 2:
            headersBox.hide();
            break;
        case 3:
            bodyBox.hide();
            break;
    }
    
    // Set new tab
    activeTab = 1;
    tabBar.selectTab(1);
    authBox.show();
    screen.render();
});

screen.key(["3"], () => {
    // Hide current tab
    switch (activeTab) {
        case 0:
            paramsBox.hide();
            break;
        case 1:
            authBox.hide();
            break;
        case 2:
            headersBox.hide();
            break;
        case 3:
            bodyBox.hide();
            break;
    }
    
    // Set new tab
    activeTab = 2;
    tabBar.selectTab(2);
    headersBox.show();
    screen.render();
});

screen.key(["4"], () => {
    // Hide current tab
    switch (activeTab) {
        case 0:
            paramsBox.hide();
            break;
        case 1:
            authBox.hide();
            break;
        case 2:
            headersBox.hide();
            break;
        case 3:
            bodyBox.hide();
            break;
    }
    
    // Set new tab
    activeTab = 3;
    tabBar.selectTab(3);
    bodyBox.show();
    screen.render();
});

// Additional keyboard shortcuts
screen.key(["m"], () => {
    focusIndex = 0;
    methodList.focus();
});

screen.key(["u"], () => {
    focusIndex = 1;
    urlBar.focus();
});

// Help info
statusBar.setContent(`{center}{green-fg}Ready - Press 'm' for method, 'u' for URL, 1-4 for tabs{/green-fg}{/center}`);

methodList.focus();
screen.key(["q", "C-c"], () => process.exit(0));
screen.render();