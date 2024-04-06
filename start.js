let os = new fileSystem("J",{
    display: $("fileSystem"),
    pathDisplay: $("path"),
    goBack: $('goBack'),
    addMenu: $(".addMenu"),
});

os.add(new folder("Untitled 1",{
    headers: ["Santaquin City Police Department","346 N 100 E, Santaquin"],
}))
os.add(new contactFile("Untitled 2"));

os.open();