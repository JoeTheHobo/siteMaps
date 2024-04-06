let os = new fileSystem("J",{
    display: $("fileSystem"),
    pathDisplay: $("path"),
    goBack: $('goBack'),
    addMenu: $(".addMenu"),
});

os.kids = ls.get("kids",[])

os.open();