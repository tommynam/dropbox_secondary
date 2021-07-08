var newFile = require("./../app.js");


$("#submit").click(()=>{

    console.log(newFile.token);
    

    $("a").attr("href", `local:8080/files/${newFile.token}`);

});

