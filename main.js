
var fileSize = 1;
let filePath = "";
let isDoubleClick = true;
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

        
        this.display = $("fileSystem"); //To Be Set From OS;
        this.pathDisplay = $('path'); //To Be Set From OS;
        this.path = null; //To Be set From OS:
        this.goBack = $("goBack");//To Be set From OS:
        this.parent = obj.parent ? obj.parent : null; //To Be Set From OS;
        this.addMenu = $(".addMenu"); //To Be Set From OS;
        this.headers = obj.headers ? obj.headers : [];
        this.className = tern(obj.className,null); //To Be Set In Creation Screen
    }
    changeName = function(name) {
        this.name = name;
        let dirPath = findDirectory(os).path;
        this.path = dirPath + name + "/";

        let kids = [...this.kids];
        this.kids = [];

        setKids(this,kids);

        this.open();
        os.save();
    }
    pathChange = function(reloading) {
        let Class = this;
        $("goBack").onclick = function() {
            Class.pathReverse();
        }

        if (reloading) return;

        let path = this.path;
        if (path == forwardPath[0]) forwardPath.shift();
        else forwardPath = [];

        testForwardAndBackDOM();
    }
    pathReverse = function() {
        let parent = this.parent;
        let addMenu = $('.addMenu');
        let path = this.path;

        forwardPath.unshift(path);
        testForwardAndBackDOM();
        parent.open(true);
        addMenu.style.display = 'none';
    
    }
    
    deleteItem(name) {
        
        for (let i = 0; i < this.kids.length; i++) {
            if (this.kids[i].name == name) {
                this.kids.splice(i,1);
            }
        }
        
        this.open(true);
        os.save();
    }
    delete() {
        this.createScreen(
            [false,[
                {
                    type: "title",
                    text: "Delete Selected Files?"
                },
                {
                    type: "doubleDelete",
                    text1: "No!",
                    text2: "Delete!"
                }
            ]]
        )
    }
    alreadyExists(Class,alreadyExists,fakeName) {
        console.log("---------Already Exists--------");
        this.createScreen(
            [false,[
                {
                    type: "title",
                    text: "File " + Class.name + " Already Exists",
                },
                {
                    type: "replaceRename",
                    class: Class,
                    alreadyExists: alreadyExists,
                    fakeName: Class.name,
                }
            ]
            ]
        );
        console.log("First Kid In DIR: ",findDirectory(os).kids[0].name)
    }
    rename(Class,alreadyExists) {
        console.log("-------Rename------------")
        console.log("First Kid In DIR: ",findDirectory(os).kids[0].name)
        console.log("Class:",Class,"Already Exists:",alreadyExists)
        this.createScreen(
            [false,[
                {
                    type: "titleInput",
                    text: "New Name:",
                    value: "name",
                },
                {
                    type: "rename",
                    class: Class,
                    alreadyExists: alreadyExists,
                }
            ]
            ]
        );
    }
    createScreen = function(arr) {
        this.createDOM.style.display = "flex";
        this.createDOM.innerHTML = '';
        /*
            createARR Types
            title - Title Of 

            create - Create Button
        */

        let useARR = arr ? arr : this.createARR;

        let div = ``;
        for (let i = 0; i < useARR[1].length; i++) {
            let item = useARR[1][i];
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
            
            
            if (item.type == "doubleDelete") {
                div += `
                <div>
                    <div id="aiDeleteNo${i}" class="aiDelete">${tern(item.text1,"No!")}</div>
                    <div id="aiDelete${i}" class="aiDelete">${tern(item.text2,"Delete!")}</div>
                </div>
                `
            }
            if (item.type == "replaceRename") {
                div += `
                <div>
                    <div id="aiReplace2${i}" class="aiDelete">${tern(item.text1,"Replace!")}</div>
                    <div id="aiRename2${i}" class="aiDelete">${tern(item.text2,"Rename!")}</div>
                </div>
                `
            }
            if (item.type == "create") {
                div += `
                    <div id="aiCreate${i}" class="aiCreate">${tern(item.text,"Create!")}</div>
                `
            }
            if (item.type == "rename") {
                div += `
                    <div id="aiRename${i}" class="aiCreate">${tern(item.text,"Rename!")}</div>
                `
            }
        }

        this.createDOM.innerHTML += div;
        for (let i = 0; i < useARR[1].length; i++) {
            let item = useARR[1][i];

            if (item.type == 'titleInput') {
                $("aiInput" + i).result = useARR[1][i].value;
            }

            if (item.type == 'checklist') {
                $("checklistGroup" + i).addList = useARR[1][i].addList;
                for (let j = 0; j < useARR[1][i].addList.length; j++) {
                    $("aisCheckBox" + i + "a" + j).Class = useARR[1][i].addList[j];
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

            if (item.type == 'doubleDelete') {
                $('aiDeleteNo' + i).onclick = function() {

                    $('.addItemScreen').style.display = "none";
                }
                $('aiDelete' + i).onclick = function() {
                    
                    let dir = findDirectory(os);
                    let count = selectedElements.length;
                    for (let j = 0; j < count; j++) {
                        dir.deleteItem(selectedElements[j].name);
                    }
                    selectedElements = [];
                    
                    $('.addItemScreen').style.display = "none";

                }
            }
            if (item.type == 'replaceRename') {
                $('aiRename2' + i).class = item.class;
                $('aiRename2' + i).alreadyExists = item.alreadyExists;
                item.class.skip = true;
                $('aiReplace2' + i).fakeName = item.fakeName;
                $('aiReplace2' + i).class = item.class;
                $('aiReplace2' + i).alreadyExists = item.alreadyExists;
                $('aiReplace2' + i).onclick = function() {
                    let dir = findDirectory(os);
                    for (let i = 0; i < dir.kids.length; i++) {
                        if (dir.kids[i].name == this.fakeName && !dir.kids[i].skip) {
                            dir.kids.splice(i,1);
                        }
                    }
                    this.class.skip = false;

                    
                    if (this.class && !this.alreadyExists) {
                        dir.add(this.class)
                    } else {
                        this.class.changeName(this.fakeName);
                    }


                    dir.open(true);
                    os.save();
                    $('.addItemScreen').style.display = "none";

                    

                }
                $('aiRename2' + i).onclick = function() {
                    console.log("-------Replace rename------")
                    console.log("First Kid In DIR: ",findDirectory(os).kids[0].name)
                    this.class.rename(this.class,this.alreadyExists);

                }
            }

            if (item.type == 'rename') {
                
                console.log("-----CS Rename------")
                console.log(0,"First Kid In DIR: ",findDirectory(os).kids[0].name)
                $("aiRename" + i).amount = useARR[1].length;
                $("aiRename" + i).class = item.class;
                $("aiRename" + i).alreadyExists = item.alreadyExists;
                $('aiRename' + i).onclick = function() {
                    console.log("-----CS Rename Clicked------")
                    console.log(1,"First Kid In DIR: ",findDirectory(os).kids[0].name)
                    let name = "Untitled " + findUntitleds();


                    for (let j = 0; j < this.amount; j++) {
                        try {
                            if ($("aiInput" + j).result == "name") {
                                name = $("aiInput" + j).value == "" ? $("aiInput" + j).placeholder : $("aiInput" + j).value;
                            }
                        } catch {

                        }
                    }
                    console.log("name",name)

                    
                    let isNameAllowed = testNameInDir(name);

                    if (!isNameAllowed) {
                        if (this.class) {
                            this.class.alreadyExists(this.class,this.alreadyExists,name);
                        } else {
                            selectedElements[0].alreadyExists(selectedElements[0],true,name);
                        }
                    } else {
                        console.log(2,"First Kid In DIR: ",findDirectory(os).kids[0].name)
                        let dir = findDirectory(os);
                        if (this.class && !this.alreadyExists) {
                            
                            this.class = Object.assign(Object.create(Object.getPrototypeOf(this.class)), this.class)
                            this.class.name = name;
                            console.log("First Kid In DIR: ",findDirectory(os).kids[0].name)
                            dir.add(this.class)
                            console.log(3,"First Kid In DIR: ",findDirectory(os).kids[0].name)
                        }
                        else {
                            console.log("waddup",this.class.name)
                            if (this.class.newItem) {
                                this.class.name = name;
                                console.log("skat",this.class.skat,"kids",findDirectory(os).kids.length)
                                this.class.newItem = false;
                                dir.add(this.class)
                                console.log("skat",this.class.skat,"kids",findDirectory(os).kids.length)
                            } else {
                                selectedElements[0].changeName(name);
                            }

                        }
    
                        dir.open(true);
                        os.save();
                        $('.addItemScreen').style.display = "none";
                    }
                    
                }
            }
            if (item.type == "create") {
                $("aiCreate" + i).amount = useARR[1].length;
                $("aiCreate" + i).parent = this.createDOM;
                $("aiCreate" + i).Class = useARR[0];
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

                    let isNameAllowed = testNameInDir(name)
                    
                    let dir = findDirectory(os);
                    let newItem = new this.Class(name);
                    newItem.className = newItem.constructor.name;

                    for (let i = 0; i < this.amount; i++) {
                        if ($("checklistGroup" + i)) {
                            for (let j = 0; j < $("checklistGroup" + i).addList.length; j++) {
                                if ($("aisCheckBox" + i + 'a' + j).Class) {
                                    if ($("aisCheckBox" + i + 'a' + j).style.background !== "") {
                                        let Class = $("aisCheckBox" + i + 'a' + j).Class;
                                        let a = new Class("Untitled " + (j+1));
                                        a.className = a.constructor.name;
                                        newItem.add(a)
                                    }
                                }
                            }
                        }
                    }

                    
                    if (!isNameAllowed) {
                        newItem.createScreen(
                            [false,[
                                {
                                    type: "title",
                                    text: "File Already Exists",
                                },
                                {
                                    type: "replaceRename",
                                    class: newItem,
                                }
                            ]
                            ]
                        );
                    } else {

                        dir.add(newItem)

                        dir.open(true);
                        os.save();
                        this.parent.style.display = "none";
                    }

                }
            }
        }
            
        
        
        
    }
}
class application extends file {
    constructor(name,obj) {
        super(name,obj);
        this.storage = tern(obj.storage,null);
    }
    application = function(obj) {
        this.pathChange();
        fileSettingsClose(false);

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
        //this.pathReverse();
    }
    save = function() {
        os.save();
    }
}
function tern(clause,els) {
    if (clause) return clause
    else return els
};
class fileSystem extends file {
    constructor(name,obj={}) {
        super(name,obj);
        this.css = {
            color: tern(obj.cssColor,"white"),
        }
        this.tags = [0];
        this.addList = [1];

        this.path = name + ":";
    }
    add = function(toAdd,start) {
        console.log(toAdd)
        
        if (!start) {
            let isNameAllowed = testNameInDir(toAdd.name);
            if (!isNameAllowed) {
                toAdd.alreadyExists(toAdd,false);
            } else {
                toAdd.display = this.display;
                toAdd.pathDisplay = this.pathDisplay;
                toAdd.path = this.path + toAdd.name + '/';
                toAdd.goBack = this.goBack;
                toAdd.addMenu = this.addMenu;
                toAdd.parent = this;
                this.kids.push(toAdd);
            }
        } else {
            toAdd.display = this.display;
            toAdd.pathDisplay = this.pathDisplay;
            toAdd.path = this.path + toAdd.name + '/';
            toAdd.goBack = this.goBack;
            toAdd.addMenu = this.addMenu;
            toAdd.parent = this;
            this.kids.push(toAdd);
        }
        
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
        if (this.pathDisplay) {
            this.pathDisplay.innerHTML = this.path;
            this.pathDisplay.realPath = this.path;
        }
        fileSettingsClose(false);
        return this.path;
    }
    save = function() {
        removeParents(this);
        localStorage.setItem('kids',JSON.stringify(this));
        addParents(this);
    }
    load = function(obj) {
        obj = JSON.parse(obj);

        let kids = [...obj.kids];
        obj.kids = [];
        let fs = new fileSystem("J",obj);

        setKids(fs,kids,true);
        return fs;

    }
    updateCSS = function() {
        this.display.style.background = this.css.background;
        this.display.style.color = this.css.color;

    }
    
    deleteItem(name) {
        
        for (let i = 0; i < this.kids.length; i++) {
            if (this.kids[i].name == name) {
                this.kids.splice(i,1);
            }
        }
        
        this.open(true);
        os.save();
    }
}
function setKids(dir,kids,start) {
    for (let i = 0; i < kids.length; i++) {
        let newKids = [...kids[i].kids];
        kids[i].kids = [];
        let Class = eval("new " + kids[i].className + "(kids[i].name,kids[i])");
        dir.add(Class,start);
        setKids(Class,newKids,start)
    }
}
document.addEventListener("click",function(e) {
    if (e.target.parentNode) {
        if(e.target.id!="hideME" && e.target.id != "addItemID" && e.target.parentNode.id !== 'hideME') { 
            document.getElementById("hideME").style.display="none";
        }
    }
})
function addParents(Class) {
    for (let i = 0; i < Class.kids.length; i++) {
        Class.kids[i].parent = Class;
        addParents(Class.kids[i])
    }
}
function removeParents(Class) {
    for (let i = 0; i < Class.kids.length; i++) {
        Class.kids[i].parent = false;
        removeParents(Class.kids[i])
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
    add = function(toAdd,start) {
        toAdd.display = this.display;
        toAdd.path = this.path + toAdd.name + '/';
        toAdd.pathDisplay = this.pathDisplay;
        toAdd.goBack = this.goBack;
        toAdd.parent = this;
        toAdd.addMenu = this.addMenu;


        if (start) {
            this.kids.push(toAdd);
        } else {
            let isNameAllowed = testNameInDir(toAdd.name);

            if (!isNameAllowed) {
                this.alreadyExists(this,false,toAdd.name);
            } else {
                this.kids.push(toAdd);
            }
        }



    }
    open = function(reloading) {
        
        this.pathChange(reloading);
        
        buildAddMenu(this.addMenu,this.addList,this);

        render(this,this.display);
        this.pathDisplay.innerHTML = getPathName(this.path,this.pathDisplay);
        this.pathDisplay.realPath = this.path;
        fileSettingsClose(false);
        return this.path;
    }
}
fileSets.push(new folder())
function findUntitleds() {
    let path = $('path').realPath;
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
    $('.addMenu').innerHTML = "<div class='addItemText'>Add Item</div>";
    for (let i = 0; i < addList.length; i++) {
        let div = $('.addMenu').create("div");
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
    dom = $('fileSystem');
    let folderSize = ((window.innerWidth-140)/4) * fileSize;
    let folderImageSize = (((window.innerWidth-140)/4)*1) * fileSize;

    if (folderSize < 0) {
        folderSize = 55;
        setTimeout(function() {
            os.open();
        },100)
    }

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

    for (let i = 0; i < file.kids.length; i++) {
        dom.innerHTML += createFileDom(file.kids[i].iconSRC,file.kids[i].name,folderSize,folderImageSize,ids);
        ids++;
    }
    
    for (let i = 0; i < ids; i++) {
        let img = $('folderIMG' + i);
        img.file = file.kids[i];

        img.css({
            maxWidth: folderImageSize + "px",
        })

        img.onload = function() {
            var width = img.width;
            var height = img.height;
            if (width > height) img.style.width = folderImageSize + 'px';
            else img.style.height = folderImageSize + 'px';
        }
    }
}

function testNameInDir(name) {
    let dir = findDirectory(os);
    for (let i = 0; i < dir.kids.length; i++) {
        if (dir.kids[i].name == name) return false;
    }
    return true;
}
$('.addItem').onclick = function() {
    addMenu(this);
}

$('fileSystem').addEventListener("click",function(e) {
    if (e.target.classList.contains("folderImage")) return;

    if (selectedElements.length > 0) {
        selectedElements.length = [];
        let dir = findDirectory(os);
        for (let i = 0; i < dir.kids.length; i++) {
            if ($('folderIMG' + i).classList.contains("shake")) {
                $('folderIMG' + i).classList.remove("shake");
            }
        }
        
        toggleFileSettings(false,false);
    } else {
        toggleFileSettings();
    }
    
    $('renameIcon').style.display = 'none';
    $('copyIcon').style.display = 'none';
    $('deleteIcon').style.display = 'none';
    $('downloadIcon').style.display = 'none';
    if (copiedElements < 1) $('pasteIcon').style.display = 'none';
    else $('pasteIcon').style.display = 'block';
    $('cutIcon').style.display = 'none';
})
var mylatesttap = new Date().getTime();
var oldEle;
var doubleTapped = false;
let selectedElements = [];
let copiedElements = [];
function doubletap(element) {

    if (!isDoubleClick) {
        openFolder(element);
        return;
    }

    var now = new Date().getTime();
    var timesince = now - mylatesttap;
    if((timesince < 300) && (timesince > 0)) {
        doubleTapped = true;
        if (element == oldEle) 
            openFolder(element);
        

    } else if(mylatesttap) {
        setTimeout(function() {
            if (!doubleTapped) {
                if (element.classList.contains("shake")) {
                    element.classList.remove("shake");
                    let shaking = 0;
                    selectedElements = [];
                    for (let i = 0; i < element.file.parent.kids.length; i++) {
                        if ($('folderIMG' + i).classList.contains("shake")) {
                            shaking++;
                            selectedElements.push($('folderIMG' + i).file);
                        }
                    }

                    if (shaking == 0) toggleFileSettings(false,false);
                    
                    if (shaking > 1) $('renameIcon').style.display = 'none';
                    else $('renameIcon').style.display = 'block';
                    if (copiedElements < 1) $('pasteIcon').style.display = 'none';
                    else $('pasteIcon').style.display = 'block';
                    if (shaking > 0) $('cutIcon').style.display = 'block';
                    else $('cutIcon').style.display = "none";
                    $('deleteIcon').style.display = 'block';
                    $('downloadIcon').style.display = 'block';
                    $('copyIcon').style.display = 'block';
                } else {
                    element.classList.add("shake");
                    
                    let shaking = 0;
                    selectedElements = [];
                    for (let i = 0; i < element.file.parent.kids.length; i++) {
                        if ($('folderIMG' + i).classList.contains("shake")) {
                            shaking++;
                            selectedElements.push($('folderIMG' + i).file);
                        }
                    }
                    if (shaking > 1) $('renameIcon').style.display = 'none';
                    else $('renameIcon').style.display = 'block';
                    if (copiedElements < 1) $('pasteIcon').style.display = 'none';
                    else $('pasteIcon').style.display = 'block';
                    if (shaking > 0) $('cutIcon').style.display = 'block';
                    else $('cutIcon').style.display = "none";
                    $('deleteIcon').style.display = 'block';
                    $('downloadIcon').style.display = 'block';
                    $('copyIcon').style.display = 'block';
                    toggleFileSettings(false,true);
                } 

            }
            doubleTapped = false;
        },300)
            
    }
    
   mylatesttap = new Date().getTime();
   oldEle = element;

}
function displayPopUp(text) {
    $('pupup').innerHTML = text;
    $('pupup').style.opacity = "0";
    $('pupup').style.display = "block";
    setTimeout(function() {
        $('pupup').style.opacity = "1";
        
            setTimeout(function() {
                $('pupup').style.opacity = "0";
                setTimeout(function() {
                    $('pupup').style.display = "none";
                },100)
            },1000)
    },100)
    
}
function classPaste() {
    let list = [...copiedElements];
    let dir = findDirectory(os);
    for (let i = 0; i < list.length; i++) {
        dir.add(list[i]);
    }
    dir.open();
    os.save();
}
function classCopy() {
    copiedElements = [...selectedElements];
    
    displayPopUp("Copied!");
    if (copiedElements < 1) $('pasteIcon').style.display = 'none';
    else $('pasteIcon').style.display = 'block';
    if (copiedElements < 1) $('cutIcon').style.display = 'none';
    else $('cutIcon').style.display = 'block';

}
function classRename() {
    selectedElements[0].rename(false,true);
    
}
function classDelete() {
    selectedElements[0].delete();
}
function createFileDom(src,name,width1,width2,id) {
    return `
        <div style="max-width: ${width1}px;width:${width1}px" class="folder">
            <div style="width: ${width2}px; height: ${width2}px">
                <img id="folderIMG${id}" onclick="doubletap(this)"" class="folderImage" src=${src}>
            </div>
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
    path = path ? path : $('path').realPath;
    let paths = path.split('/');
    let splitColon = paths[0].split(":");
    paths.shift();
    let newPath = splitColon.concat(paths);
    for (let i = 1; i < newPath.length-1; i++) {
        findKidInDir: for (let j = 0; j < dir.kids.length; j++) {
            if (String(dir.kids[j].name) == newPath[i]) {
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

function toggleFileSettings(toggle = false,open) {
    let dom = $('.fileSettings');

    if (toggle) {
        dom.classList.remove("fileSettings3");
        dom.classList.remove("fileSettings2");
        
        dom.css({
            maxHeight: "0px",
        }) 
        return;
    }

    if (dom.classList.contains("fileSettings2") && !open) {
        fileSettingsClose();
    } else {
        fileSettingsOpen();
    } 
}
function fileSettingsClose(doAnimation = true) {
    let dom = $('.fileSettings');

    if (doAnimation) dom.classList.add("fileSettings3");
    setTimeout(function() {
        dom.classList.remove("fileSettings3");
        dom.classList.remove("fileSettings2");
        dom.css({
            maxHeight: "0px",
        }) 
    },140)

}
function clearSelectedElements() {
    selectedElements = [];
    let Class = findDirectory(os)

    if (!Class) {
        console.log("Couldn't Find Class, Reading " + Class + ", clearSelectedElements() failed.")
        return;
    }

    for (let i = 0; i < Class.kids.length; i++) {
        if ($('folderIMG' + i).classList.contains("shake")) {
            $('folderIMG' + i).classList.remove("shake")
        }
    }
}


function fileSettingsOpen() {
    let dom = $('.fileSettings');
    dom.classList.add("fileSettings2");
    setTimeout(function() {
        dom.css({
            maxHeight: "200px",
        }) 
    },140)

}

testForwardAndBackDOM(false);
