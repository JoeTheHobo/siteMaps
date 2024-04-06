
class textFile extends application {
    constructor(name,obj = {}) {
        obj.createARR = [textFile,[
            {
                type: "title",
                text: "Add Text File",
            },
            {
                type: "titleInput",
                text: "File Name:",
                value: "name",
            },
            {
                type: "create",
            }
        ]]; //Requiered
        super(name,obj); //Requiered

        this.iconSRC = "img/textFile.png"; //
        this.tags = [1]; //Requiered
        this.untiteldName = "Text File"; //
        this.creation = textFile; //Requiered
    }
    open = function() {
        let dom = this.application({header: true});
        let Class = this;

        dom.css({
            background: "white",
            overflow: "hidden",
        })



        let textArea = dom.create("textarea");
        if (this.storage !== null) textArea.value = this.storage;
        textArea.css({
            width: "100%",
            height: "100%",
            outline: "none",
            border: "none",
            fontSize: "20px",
        })

        textArea.addEventListener("input",function() {
            Class.storage = textArea.value;
            Class.save();
        })

    }
} 

fileSets.push(new textFile()); //Requiered