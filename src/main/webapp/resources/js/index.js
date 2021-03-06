$('document').ready(function(){

    var gotoFolder = function (paths) {
        var pth = paths.slice(1).join('/');
        $.ajax({
            url: "/goto",
            data: "path="+pth,
            success: function(data){
                g_curdir = paths;
                updatePathHeader();
                updateFileRecord(data);
            }
        });
    }

    
    function updatePathHeader() { 
        ReactDOM.render(
            <PathHeader gotofunc={gotoFolder} curdir={ g_curdir }/>,
            document.getElementById('pathheader')
        );
    }

    function updateFileRecord(data){
        console.log(data);
        ReactDOM.render(
            <FileRecord gotofunc={gotoFolder} curdir={g_curdir} files={data}/>,
            document.getElementById("filelist")
        );
    }

    function dropHandler(ev) {

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();

        if (ev.dataTransfer.items && ev.dataTransfer.items.length > 0) {
            var fitem = ev.dataTransfer.items[0];
            if (fitem.kind === 'file') {
                var fd = new FormData();
                fd.append('file', fitem.getAsFile());
                fd.append('path', g_curdir.slice(1).join('/'));

                $.ajax({
                    url: '/upload',
                    type: 'post',
                    data: fd,
                    contentType: false,
                    processData: false,
                    enctype: 'multipart/form-data',
                    success: function(response){
                        $("#dropfile").html("success "+response);
                        gotoFolder(g_curdir);
                    }
                });
            }
        }

        removeDragData(ev);
    }

    function dragOverHandler(ev) {
        $("#dropfile").removeClass("droparea");
        $("#dropfile").addClass("dragarea");
        

        // Prevent default behavior (Prevent file from being opened)
        ev.preventDefault();
    }

    function removeDragData(ev) {
        $("#dropfile").removeClass("dragarea");
        $("#dropfile").addClass("droparea");

        if (ev.dataTransfer.items) {
            // Use DataTransferItemList interface to remove the drag data
            ev.dataTransfer.items.clear();
        } else {
            // Use DataTransfer interface to remove the drag data
            ev.dataTransfer.clearData();
        }
    }

    
    // Initialization
    var g_curdir = ["root"];

    gotoFolder(g_curdir);
    updatePathHeader();

});