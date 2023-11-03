const express=require("express");
const app=express();
const multer=require("multer");
const path=require("path");
app.use(express.urlencoded({extends:true}));
app.use(express.static("public"));
app.set("view engine","ejs");

const cookieparser=require("cookie-parser");
const session=require("express-session");
const { render } = require("ejs");
app.use(cookieparser());
app.use(session({
    saveUninitialized:true,
    resave:false,
    secret:"29387xojw37849362*#^$&(",
    cookie:{maxAge:3489639}
    
}))
app.get("/",(req,res)=>{
    // res.sendFile(path.join(__dirname,"upload.html"));
    if(req.session.username){
        res.redirect("/dashboard");
    }
    else{
        res.redirect("/login");
    }
    
})   
let mstorage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./public/files");
    },
    filename:(req,file,cb)=>{
        //cb(null,"test.jpg");
        console.log(file)
        let ext=file.mimetype.split("/")[1];
        cb(null,req.session.username+"."+ext);     
    }
})
let filter=(req,file,cb)=>{
    let ext=file.mimetype.split("/")[1];
    console.log(ext);
    if(ext=='png' || ext=="jpeg"){
        cb(null,true);
    }
    else{
        cb(new Error("This File is Not Supported"),false);
    }
}
let upload=multer({storage:mstorage,fileFilter:filter,limits:454543453476376})


app.post("/uploadfile",upload.single("pic"),(req,res)=>{
    // res.end();
    res.render("dashboard",{name:req.session.username});
})
app.get("/uploadfile",(req,res)=>{
    // res.end();
    res.render("upload");
})



app.get("/login",(req,res)=>{
    // res.sendFile(path.join(__dirname,"./public/login.html"))
    res.render("login")
})
app.post("/login",(req,res)=>{
    if(req.body.username==req.body.password){
        req.session.username=req.body.username;
        //res.render("dashboard",{name:req.body.username});
        res.render("dashboard",{name:req.session.username});
    }
    else{
        res.redirect("./login");
    }
})
app.get("/dashboard",(req,res)=>{
    if(req.session.username){
        // res.sendFile(path.join(__dirname,"./public/dashboard.html"))
        //res.render("dashboard",{name:req.body.username});
        res.render("dashboard",{name:req.session.username});

    }
    else{
        res.redirect("/login");
    }
})
app.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/login");
})

app.listen(3000,(err)=>{
    console.log("Server Started..");
})