
var fileSize = 1;
let filePath = "";
let isDoubleClick = false;
let forwardPath = [];
let fileSets = [];
/*
    Possible Class Types
    autherizedPeoples - Txt (Name, Number, Position)
    Keys - (Names, Cuts)
    Contacts - (Names, Numbers)
    Images - (images)
*/
class file {
    constructor(name,obj) {
        this.name = name;
        this.kids = [];
        this.addList = tern(obj.addList,[]);
        this.isKillable = obj.isKillable ? obj.isKillable : true;
        this.createDOM = $('createDiv');
        this.createARR = tern(obj.createARR,[]);

        
        this.display = null; //To Be Set From OS;
        this.pathDisplay = null; //To Be Set From OS;
        this.path = null; //To Be set From OS:
        this.goBack = null;//To Be set From OS:
        this.parent = obj.parent ? obj.parent : null; //To Be Set From OS;
        this.addMenu = null; //To Be Set From OS;
        this.headers = obj.headers ? obj.headers : [];
    }
    pathChange = function(skipPathTest) {
        let parent = this.parent;
        let addMenu = this.addMenu;
        let path = this.path;
        if (!skipPathTest) if (path !== forwardPath[0]) forwardPath = [];
        testForwardAndBackDOM();
        this.goBack.onclick = function() {
            if (forwardPath[0] !== path)
                forwardPath.unshift(path);
            testForwardAndBackDOM();
            parent.open(true);
            addMenu.style.display = 'none';
        }
    }
    createScreen = function() {
        this.createDOM.style.display = "flex";
        this.createDOM.innerHTML = '';
        /*
            createARR Types
            title - Title Of 

            create - Create Button
        */
        let div = ``;
        for (let i = 0; i < this.createARR[1].length; i++) {
            let item = this.createARR[1][i];
            if (item.type == 'title') {
                div += `
                    <div class="addTitle">${item.text}</div>
                `
            }
            if (item.type == 'titleInput') {
                div += `
                    <div class="folderNameInputGroup">
                        <div class="aiInputTitle">${item.text}</div>
                        <input id="${"aiInput" + i}" placeholder="${tern(item.placeholder,"Untitled " + findUntitleds())}" class="aiInput" type="text">
                    </div>
                `
            }
            if (item.type == 'checklist') {
                div += `<div class="afsOptionList" id="checklistGroup${i}">`;
                let list = getAddItems(item.addList);
                for (let j = 0; j < list.length; j++) {
                    div += `<div class="aiCheckGroup">
                        <div class="aiCheckTitle">${list[j].name.charAt(0).toUpperCase() + list[j].name.substring(1,list[j].name.length)}</div>
                        <div id="aisCheckBox${i + "a" + j}" class="aiCheckBox"></div>
                    </div>`
                }
                div += '</div>'

            }
            if (item.type == "create") {
                div += `
                    <div id="aiCreate${i}" class="aiCreate">${tern(item.text,"Create!")}</div>
                `
            }
        }

        this.createDOM.innerHTML += div;
        for (let i = 0; i < this.createARR[1].length; i++) {
            let item = this.createARR[1][i];

            if (item.type == 'titleInput') {
                $("aiInput" + i).result = this.createARR[1][i].value;
            }

            if (item.type == 'checklist') {
                $("checklistGroup" + i).addList = this.createARR[1][i].addList;
                for (let j = 0; j < this.createARR[1][i].addList.length; j++) {
                    $("aisCheckBox" + i + "a" + j).Class = this.createARR[1][i].addList[j];
                    $("aisCheckBox" + i + "a" + j).addEventListener("click",function() {
                        if (this.style.background !== "") {
                            this.style.background = "";
                        } else {
                            this.style.background = "url(img/checkbox.png) no-repeat center center";
                            this.style.backgroundSize = "33px 33px";
                        }
                    });
                }
            } else {
                this.createDOM.addList = [];
            }

            if (item.type == "create") {
                $("aiCreate" + i).amount = this.createARR[1].length;
                $("aiCreate" + i).parent = this.createDOM;
                $("aiCreate" + i).Class = this.createARR[0];
                $("aiCreate" + i).addList = [];
                $('aiCreate' + i).onclick = function() {
                    let name = "Untitled " + findUntitleds();


                    for (let j = 0; j < this.amount; j++) {
                        try {
                            if ($("aiInput" + j).result == "name") {
                                name = $("aiInput" + j).value == "" ? $("aiInput" + j).placeholder : $("aiInput" + j).value;
                            }
                        } catch {

                        }
                    }
                    
                    let dir = findDirectory(os);
                    let newItem = new this.Class(name);
                    dir.add(newItem)

                    for (let i = 0; i < this.amount; i++) {
                        if ($("checklistGroup" + i)) {
                            for (let j = 0; j < $("checklistGroup" + i).addList.length; j++) {
                                if ($("aisCheckBox" + i + 'a' + j).Class) {
                                    if ($("aisCheckBox" + i + 'a' + j).style.background !== "") {
                                        let Class = $("aisCheckBox" + i + 'a' + j).Class;
                                        let a = new Class("Untitled " + (j+1));
                                        newItem.add(a)
                                    }
                                }
                            }
                        }
                    }

                    dir.open();
                    os.save();
                    this.parent.style.display = "none";
                }
            }
        }
            
        
        
        
    }
}
class application extends file {
    constructor(name,obj) {
        super(name,obj);
        this.storage = null;
    }
    application = function(obj) {
        $('screen1').style.display = 'none';
        $('appBody').innerHTML = "";
        $('application').style.display = 'block';

        if (obj.header) {
            let header = $('appBody').create('div');
            header.css({
                width: "100%",
                height: "90px",
                background: "#414141",
            });
            let back = header.create("img");
            back.src = "img/back.png";
            back.css({
                width: "40px",
            })
            back.onclick = this.close;
        }

        return $('appBody');
    }
    close = function() {
        $('screen1').style.display = 'block';
        $('application').style.display = 'none';
    }
    save = function() {
        os.save();
    }
}
function tern(clause,els) {
    if (clause) return clause
    else return els
};
class fileSystem {
    constructor(name,obj={}) {

        this.kids = [];
        this.display = obj.display;
        this.pathDisplay = obj.pathDisplay;
        this.css = {
            color: tern(obj.cssColor,"white"),
        }
        this.goBack = obj.goBack;
        this.addMenu = obj.addMenu;
        this.tags = [0];
        this.addList = [1];

        this.path = name + ":";
    }
    add = function(toAdd) {
        toAdd.display = this.display;
        toAdd.pathDisplay = this.pathDisplay;
        toAdd.path = this.path + toAdd.name + '/';
        toAdd.goBack = this.goBack;
        toAdd.addMenu = this.addMenu;
        toAdd.parent = this;

        this.kids.push(toAdd);
    }
    open = function() {
        this.updateCSS();
        testForwardAndBackDOM(false);
        
        let addMenu = this.addMenu;
        this.goBack.onclick = function() {
            
            testForwardAndBackDOM(false);
            addMenu.style.display = 'none';
        }

        
        buildAddMenu(this.addMenu,this.addList,this);
        

        render(this,this.display);
        if (this.pathDisplay) this.pathDisplay.innerHTML = this.path;
        return this.path;
    }
    save = function() {
        //ls.save("kids",this.kids)
    }
    updateCSS = function() {
        this.display.style.background = this.css.background;
        this.display.style.color = this.css.color;

    }
}
class folder extends file {
    constructor(name,obj = {}) {
        obj.createARR = [folder,[
            {
                type: "title",
                text: "Add Folder",
            },
            {
                type: "titleInput",
                text: "Folder Name:",
                value: "name",
            },
            {
                type: "checklist",
                addList: [1],

            },
            {
                type: "create",
            }
        ]];
        super(name,obj);
        this.tags = [1];
        this.iconSRC = "img/fullFolder.png";
        this.addList = obj.addList ? obj.addList : [1];
        this.untiteldName = "Folder";
        this.creation = folder;
    }
    add = function(toAdd) {
        toAdd.display = this.display;
        toAdd.path = this.path + toAdd.name + '/';
        toAdd.pathDisplay = this.pathDisplay;
        toAdd.goBack = this.goBack;
        toAdd.parent = this;
        toAdd.addMenu = this.addMenu;

        this.kids.push(toAdd);
    }
    open = function(skipPathTest = false) {
        this.pathChange(skipPathTest);
        
        buildAddMenu(this.addMenu,this.addList,this);

        render(this,this.display);
        if (this.pathDisplay) this.pathDisplay.innerHTML = getPathName(this.path,this.pathDisplay);
        return this.path;
    }
}
fileSets.push(new folder())
function testNameInDir(dir,name) {
    for (let i = 0; i < dir.kids.length; i++) {
        if (dir.kids[i].name == name) return false;
    }
    return true;
}
function findUntitleds() {
    let path = $('path').innerHTML;
    let dir = findDirectory(os,path);
    let count = 1;
    for (let i = 0; i < dir.kids.length; i++) {
        if (dir.kids[i].name == "Untitled " + count) count++;
    }
    return count;
}
function getAddItems(arr) {
    let newSet = [];
    for (let i = 0; i < fileSets.length; i++) {
        currentSet: for (let j = 0; j < fileSets[i].tags.length; j++) {
            if (arr.includes(fileSets[i].tags[j])) {
                newSet.push(fileSets[i].creation)
                break currentSet;
            }
        }
    }
    return newSet;
}
function buildAddMenu(addMenuDom,addList) {
    addList = getAddItems(addList);
    addMenuDom.innerHTML = "<div class='addItemText'>Add Item</div>";
    for (let i = 0; i < addList.length; i++) {
        let div = addMenuDom.create("div");
        div.className = "option";
        div.innerHTML = addList[i].name.charAt(0).toUpperCase() + addList[i].name.substring(1,addList[i].name.length);
        div.Class = addList[i];

        div.onclick = function() {
            addMenu();
            let newClass = new div.Class();
            newClass.createScreen();
        }
    }
}
function render(file,dom) {
    let folderSize = ((window.innerWidth-140)/4) * fileSize;
    let folderImageSize = (((window.innerWidth-140)/4)*1) * fileSize;
    let ids = 0;

    dom.innerHTML = '';
    
    if (file.headers) {
        let headers = `<div class="headers">`;
        for (let i  = 0; i < file.headers.length; i++) {
            headers += `<div class='header'>${file.headers[i]}</div>`;
        }
        headers += "</div>";
        dom.innerHTML += headers;
    }
    if (file.templateFolder) {
        dom.innerHTML += createFileDom(file.templateFolderIcon,file.templateFolderTitle,folderSize,folderImageSize,ids);
        ids++;
        
    }
    for (let i = 0; i < file.kids.length; i++) {
        dom.innerHTML += createFileDom(file.kids[i].iconSRC,file.kids[i].name,folderSize,folderImageSize,ids);
        ids++;
        
    }
    dom.innerHTML += getDOMAddButton();
    
    $('addButton').onclick = function() {
        addMenu(this);
    }
    for (let i = 0; i < ids; i++) {
        $('folderIMG' + i).file = file.kids[i];
    }
}
var mylatesttap;
var oldEle;
function doubletap(element) {

    if (!isDoubleClick) {
        openFolder(element);
        return;
    }

   var now = new Date().getTime();
   var timesince = now - mylatesttap;
   if((timesince < 300) && (timesince > 0)){
    if (element == oldEle)
        openFolder(element);

   }else{
            // too much time to be a doubletap
         }

   mylatesttap = new Date().getTime();
   oldEle = element;

}
function createFileDom(src,name,width1,width2,id) {
    return `
        <div style="max-width: ${width1}px;width:${width1}px" class="folder">
            <img id="folderIMG${id}" onclick="doubletap(this)" style="width:${width2}px" class="folderImage" src=${src}>
            <div style="font-size: ${width1*.2}px;width:${width1}px" class="folderTitle">${name}</div>
        </div>
    `;
}
function getTextWidth(txt) { 
    text = document.createElement("span"); 
    document.body.appendChild(text); 
    
    text.style.font = "times new roman"; 
    text.style.fontSize = 16 + "px"; 
    text.style.height = 'auto'; 
    text.style.width = 'auto'; 
    text.style.position = 'absolute'; 
    text.style.whiteSpace = 'no-wrap'; 
    text.innerHTML = txt; 
    
    width = Math.ceil(text.clientWidth); 
    document.body.removeChild(text); 
    return width;
} 
function getPathName(pathString,inputDom) {
    //Get Arrays Of Path
    let pathArray = [];
    let width = inputDom.clientWidth- 50;

    let string = "";
    for (let i = 0; i < pathString.length; i++) {
        if (pathString.charAt(i) == ":" || pathString.charAt(i) == "/") {
            pathArray.push(string);
            string = "";
            continue;
        }
        string += pathString.charAt(i);
    }

    let tooLong = true;
    while (tooLong) {
        //Test If Short Enough
        let returnString = "";
        for (let i = 0; i < pathArray.length; i++) {
            returnString += pathArray[i] + (i == 0 ? ":" : '/');
        }
        let textWidth = getTextWidth(returnString)
        if (textWidth < width) {
            return returnString;
        }


        let madeChange = false;
        //Shorten Any String
        //Find Largest String
        let largestStringI = false;
        let largestNum = 0;
        for (let i = 0; i < pathArray.length; i++) {
            if (pathArray[i].length > largestNum) {
                largestNum = pathArray[i].length;
                largestStringI = i;
            }
        }

        testingString: if (largestStringI) {
            //Length Has To be bigger than 4
            if (largestNum < 5) break testingString;

            let isShortened = false;
            if (pathArray[largestStringI].substring(pathArray[largestStringI].length-3,pathArray[largestStringI].length) == "...") {
                isShortened = true;
            }

            pathArray[largestStringI] = pathArray[largestStringI].substring(0,pathArray[largestStringI].length-4) + "...";
            madeChange = true;

        }

        //Handel If No Changes Are Possible
        if (!madeChange) {
            tooLong = false;
        }
    }
    
}
function getDOMAddButton() {
    return `<div id="addButton" class="addButton">+</div>`;
}
function addMenu(element) {
    element = $('addButton');
    if ($('.addMenu').style.display == "none" || $('.addMenu').style.display == "") {
        $('.addMenu').style.display = "block";
        var rect = element.getBoundingClientRect();

        let left = (rect.left - 65);
        let right = false;
        let top = (rect.bottom + 10);
        let bottom = rect.bottom > window.innerHeight/2 ? (window.innerHeight-rect.bottom)+rect.height + 5 : false;

        if (left < 0) left = 5;
        if ((left + 214) > window.innerWidth) {
            right = 50;
        }

        if (bottom) {
            $('.addMenu').style.bottom = bottom +'px';
            $('.addMenu').style.top = "auto";
        } else {
            $('.addMenu').style.top = top +'px';
            $('.addMenu').style.bottom = 'auto';
        }
        if (right != false) {
            $('.addMenu').style.right = right +'px';
            $('.addMenu').style.left = 'auto';
        } else {
            $('.addMenu').style.left = left +'px';
            $('.addMenu').style.right = 'auto';
        } 
    } else {
        $('.addMenu').style.display = "none";
    }
};

function openFolder(element) {
    element.file.open();
}
$('goForward').addEventListener("click",function() {
    if (forwardPath.length > 0) {
        goInDirectory(os,forwardPath[0]);
        forwardPath.shift();
    }

    testForwardAndBackDOM();
})
function testForwardAndBackDOM(back = true) {
    if (forwardPath.length == 0) {
        $("goForward").classList.add("grayed") 
    } else {
        $("goForward").classList.remove("grayed")
    }

    if (back) {
        $("goBack").classList.remove("grayed");
    } else {
        $("goBack").classList.add("grayed");
    }

}
function findDirectory(dir,path) {
    path = path ? path : $('path').innerHTML;
    let paths = path.split('/');
    let splitColon = paths[0].split(":");
    paths.shift();
    let newPath = splitColon.concat(paths);;
    for (let i = 1; i < newPath.length-1; i++) {
        findKidInDir: for (let j = 0; j < dir.kids.length; j++) {
            if (dir.kids[j].name == newPath[i]) {
                dir = dir.kids[j];
                break findKidInDir;
            }
        }
    }
    return dir;
}
function goInDirectory(dir,path) {
    dir = findDirectory(dir,path);
    dir.open();
}

testForwardAndBackDOM(false);