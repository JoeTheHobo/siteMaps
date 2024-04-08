
class contactFile extends application {
    constructor(name,obj = {}) {
        obj.createARR = [contactFile,[
            {
                type: "title",
                text: "Add Contacts",
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
        this.untiteldName = "Contact File"; //
        this.creation = contactFile; //Requiered
    }
    open = function() {
        let dom = this.application({header: true});
        let Class = this;
        let storage = this.storage == null ? [] : this.storage;

        dom.css({
            background: "white",
            overflow: "hidden",
        })

        let table = dom.create("table");
        table.css({
            tableLayout: "fixed",
            width: "100%",
        })

        let contactTextList = ["Name","Phone Number"];
        renderList();

        let center = dom.create('center');
        let add = center.create("div");
        add.innerHTML = "+";
        add.css({
            borderRadius: "50px",
            background: "green",
            textAlign: "center",
            width: "50px",
            height: "50px",
            lineHeight: "50px",
            color: "white",
            fontWeight: "bold",
            fontSize: "30px",
            marginTop: "20px",
        })
        add.onclick = function() {
            storage.push(new Array(contactTextList.length))
            renderList();
        }

        function renderList() {
            console.log(storage)
            table.innerHTML = "";
            for (let i = -1; i < storage.length; i++) {
                let row = table.insertRow(-1);
                for (let j = 0; j < contactTextList.length; j++) {
                    let cell = row.insertCell(-1);
                    cell.css({
                        width: (100/contactTextList.length) + "%",
                        textAlign: "center",
                        height: "25px",
                        borderTop: "1px solid black",
                    })
                    if (i == -1) {
                        cell.innerHTML = contactTextList[j];
                    } else {
                        let input = cell.create("input");
                        input.css({
                            border: "none",
                            outline: "none",
                            height: "30px",
                            fontSize: "15px",
                        })
                        input.i = i;
                        input.j = j;
                        if (storage[i][j]) input.value = storage[i][j];
                        input.addEventListener("input",function() {
                            storage[this.i][j] = this.value;
                            Class.storage = storage;
                            Class.save();
                        })
                        input.type = 'number'
                        input.placeholder = contactTextList[j] + "..."
                    }
                }
            }
        }
        
    }
} 

fileSets.push(new contactFile()); //Requiered