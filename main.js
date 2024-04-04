class fileSystem {
    constructor(obj) {

        this.kids = [];
        this.templateFolder = new folder("Template_Folder",false);
        this.templateFolder.add(new template({
            name: "basic",
        }))
        this.templateFolderIcon = "img/pinningChart.png";
        this.templateFolderTitle = "Templates";
        this.background = obj.background ? obj.background : "rgb(144, 113, 201)";
    }
    add = function(toAdd) {
        this.kids.push(toAdd);
    }
}
class folder {
    constructor(name,isKillable = true) {
        this.name = name;
        this.kids = [];
        this.isKillable = isKillable;
        this.iconSRC = "img/folder.png"
    }
    add = function(toAdd) {
        this.kids.push(toAdd);
    }
}
class building {
    constructor(obj) {
        this.template = obj.template;
        this.name = obj.name;
        this.address = obj.address;
        this.doors = [];
        this.iconSRC = "img/church.png"
    }
}
class door {
    constructor(obj) {
        this.iconSRC = "img/siteMap.png"

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
    }
}
class template {
    constructor(obj) {
        this.iconSRC = "img/book.png"
        this.name = obj.name;
        
        this.location = obj.location ? obj.location : false;
        this.type = obj.type ? obj.type : false;
        this.brand = obj.brand ? obj.brand : false;
        this.remarks = obj.remarks ? obj.remarks : false;
        this.discription = obj.discription ? obj.discription : false;
        this.keyedTo = obj.keyedTo ? obj.keyedTo : false;
        this.finish = obj.finish ? obj.finish : false;
    }
}

function render(file,dom) {
    let folderSize = ((window.innerWidth-80)/4) * fileSize;
    let folderImageSize = (((window.innerWidth-80)/4)*0.625) * fileSize;
    let ids = 0;

    dom.innerHTML = '';
    if (file.templateFolder) {
        ids++;
        dom.innerHTML += createFileDom(file.templateFolderIcon,file.templateFolderTitle,folderSize,folderImageSize,ids);
        
    }
    console.log(file);
    for (let i = 0; i < file.kids.length; i++) {
        ids++;
        dom.innerHTML += createFileDom(file.kids[i].iconSRC,file.kids[i].name,folderSize,folderImageSize,ids);
        
    }
    for (let i = 0; i < ids; i++) {
        $('folderIMG' + i).file = file.kids[i];
    }
}
function createFileDom(src,name,width1,width2,id) {
    return `
        <div style="max-width: ${width1}px;width:${width1}px" class="folder">
            <img id="folderIMG${id}" onclick="openFolder(this)" style="width:${width2}px" class="folderImage" src=${src}>
            <div style="width:${width1}px" class="folderTitle">${name}</div>
        </div>
    `;
}

function openFolder(element) {
    render(element.file,$('fileSystem'));
}

var fileSize = 1;
var operatingSystem = false;

let os = new fileSystem({});
operatingSystem = os;
let og = new folder("Ey");
og.add(new building("hey"));
os.add(og);
os.add(new building("Testinggggggggggg"));
os.add(new door("Testinggggggggggg"));
render(os,$("fileSystem"))