/**
 * Created by Rakesh M on 27-Sep-16.
 */
$(document).ready(function(){
    $("#button").click(function(){
        //alert("Data: " + $("#filetype").val());
        var filetype = $("#filetype").val();
        var filepathinput = $("#filepathinput").val();
        //console.log("type: " +filetype );

        //console.log("PAth: " +filepathinput );



        $.ajax({url:'files',
            type:"GET",
            data: {"filepathinput":filepathinput, "filetype":filetype },
            success:gotData,
            beforeSend : function(){
                $("#data").hide();
               // $("#filename").hide();
                waitingDialog.show('Loading Data ...');
            },
            complete: function(){
                waitingDialog.hide();
            }
        });

    });






});

function gotData(data){
    //alert("Data: " + data + "\nStatus: " + status);
    if(!data.error) {
        //console.log("Data: " + JSON.stringify(data.length));
        $("#data").show();

        $("#heading").html('<h1>Here are all <span id="filename"></span> files in <span id="path"></span></h1><h2>There are <span id="nos"></span> files.</h2>');
        $("#filename").text(data[0].type);
        $("#path").text(data[0].path);
        $("#nos").text(data.length-1);
        var string = '';
        if(data.length<=1){
            string = "No files to show";
        }else {
            for (var i = 1; i < data.length; i++) {
                string += '<a class="links" href="' + data[i].file[1] + '">' + data[i].file[0] + '</a>' + '<br>';
            }
        }
        $('#files').html(string);
        $("#filetype").val('');
        $("#filepathinput").val('');
    }else{
        alert("Error: " + data.error);
    }

}