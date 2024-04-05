/*
    Possible Class Types
    autherizedPeoples - Txt (Name, Number, Position)
    Keys - (Names, Cuts)
    Contacts - (Names, Numbers)
    Images - (images)
*/
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
            background: tern(obj.cssBackground,"black"),
            color: tern(obj.cssColor,"white"),
        }
        this.cssBackground = 
        this.goBack = obj.goBack;
        this.addMenu = obj.addMenu;
        this.addList = [folder,building,door];

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
    updateCSS = function() {
        this.display.style.background = this.css.background;
        this.display.style.color = this.css.color;

    }
}
class folder {
    constructor(name,obj = {}) {
        this.name = name;
        this.kids = [];
        this.isKillable = obj.isKillable ? obj.isKillable : true;
        this.iconSRC = "img/fullFolder.png"

        this.display = null; //To Be Set From OS;
        this.pathDisplay = null; //To Be Set From OS;
        this.path = null; //To Be set From OS:
        this.goBack = null;//To Be set From OS:
        this.parent = obj.parent ? obj.parent : null; //To Be Set From OS;
        this.addMenu = null; //To Be Set From OS;
        this.addList = obj.addList ? obj.addList : [folder,building,door];
        this.headers = obj.headers ? obj.headers : [];


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

        
        buildAddMenu(this.addMenu,this.addList,this);
        

        render(this,this.display);
        if (this.pathDisplay) this.pathDisplay.innerHTML = getPathName(this.path,this.pathDisplay);
        return this.path;
    }
    createScreen = function() {
        
        $('addFolderScreen').style.display = "flex";
        $('afsInput').value = "";
        $('afsInput').placeholder = "Untitled " + findUntitleds();
        $('afsCreate').addList = this.addList;
        $('afsCreate').onclick = function() {
            let name = $('afsInput').value;
            if (name == "") name = $('afsInput').placeholder;

            let dir = findDirectory(os);
            let newFolder = new folder(name);
            dir.add(newFolder)
            

            for (let i = 0; i < this.addList.length; i++) {
                if ($("afsCheckBox" + i).style.background !== "") {
                    let a = new this.addList[i]("Untitled " + (i+1));
                    newFolder.add(a)
                }
            }

            dir.open();
            $('addFolderScreen').style.display = "none";
        }
        
        let div = '';
        for (let i = 0; i < this.addList.length; i++) {
            div += `<div class="aiCheckGroup">
                <div class="aiCheckTitle">${this.addList[i].name.charAt(0).toUpperCase() + this.addList[i].name.substring(1,this.addList[i].name.length)}</div>
                <div id="afsCheckBox${i}" class="aiCheckBox"></div>
            </div>`
        }
        $('.afsOptionList').innerHTML = div;

        for (let i = 0; i < this.addList.length; i++) {
            $("afsCheckBox" + i).Class = this.addList[i];
            $("afsCheckBox" + i).onclick = function() {
                if (this.style.background !== "") {
                    this.style.background = "";
                } else {
                    this.style.background = "url(img/checkbox.png) no-repeat center center";
                    this.style.backgroundSize = "33px 33px";
                }
            }
        }
    }
}
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
class building {
    constructor(name,obj = {}) {
        this.template = obj.template;
        this.name = name;
        this.address = obj.address;
        this.doors = [];
        this.iconSRC = "img/church.png"
        this.kids = [];

        this.display = null; //To Be Set From OS;
        this.path = null; //To Be set From OS:
        this.pathDisplay = null; //To Be Set From OS;
        this.goBack = null;//To Be set From OS:
        this.parent = obj.parent ? obj.parent : null; //To Be Set From OS;
        this.addMenu = null; //To Be Set From OS;
        this.addList = obj.addList ? obj.addList : [folder,door];
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
    open = function(skipPathTest) {
        testForwardAndBackDOM();
        
        let parent = this.parent;
        let addMenu = this.addMenu;
        let path = this.path;
        
        if (!skipPathTest) if (path !== forwardPath[0]) forwardPath = [];
        testForwardAndBackDOM();
        this.goBack.onclick = function() {
            if (forwardPath[0] !== path)
                forwardPath.unshift(path);
            testForwardAndBackDOM();
            console.log(forwardPath)
            parent.open();
            addMenu.style.display = 'none';
        }

        buildAddMenu(this.addMenu,this.addList,this);
        

        
        render(this,this.display);
        if (this.pathDisplay) this.pathDisplay.innerHTML = this.path;
        return this.path;
    }
}
class door {
    constructor(name,obj) {
        this.iconSRC = "img/siteMap.png"

        this.name = name;
        this.floor = obj.floor;
        this.number = obj.number;
        this.quantity = obj.quantity;
        
        this.location = obj.location;
        this.type = obj.type;
        this.brand = obj.brand;
        this.remarks = obj.remarks;
        this.discription = obj.discription;
        this.keyedTo = obj.keyedTo;
        this.finish = obj.finish;

        this.display = null; //To Be Set From OS;
        this.path = null; //To Be set From OS:
        this.pathDisplay = null; //To Be Set From OS;
        this.goBack = null;//To Be set From OS:
        this.parent = obj.parent ? obj.parent : null; //To Be Set From OS;
        this.addMenu = null; //To Be Set From OS;
    }
    open = function() {
        
    }
}
function buildAddMenu(addMenuDom,addList,parent) {
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

var fileSize = 1;
let filePath = "";
let isDoubleClick = false;
let forwardPath = [];
testForwardAndBackDOM(false);

let os = new fileSystem("J",{
    display: $("fileSystem"),
    pathDisplay: $("path"),
    goBack: $('goBack'),
    addMenu: $(".addMenu"),
});

os.add(new folder("Untitled 1",{
    headers: ["Santaquin City Police Department","346 N 100 E, Santaquin"],
}))

os.open();