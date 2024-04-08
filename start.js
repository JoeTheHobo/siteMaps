let os = new fileSystem("J",{
    display: $("fileSystem"),
    pathDisplay: $("path"),
    goBack: $('goBack'),
    addMenu: $(".addMenu"),
});

if (localStorage.getItem("kids") !== null) {
    os = os.load(localStorage.getItem("kids"));
}

os.open();