const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.set("view engine","ejs");

mongoose.connect("mongodb://localhost:27017/wikiapi");

const articleSchema={
    title:String,
    desc:String
}

const Article=mongoose.model("Article",articleSchema);

const port=3000;


app.get("/",(req,res)=>{
    res.send("This is home route");
})

app.route("/articles")
    .get((req,res)=>{
    Article.find((err,result)=>{
        if(err) res.send("you got an error");
        else res.send(result);
    })
})

    .post((req,res)=>{
    let newArticle=new Article({
        title:req.body.title,
        desc:req.body.desc
    });
    newArticle.save();
    res.redirect("/articles");
})

    .delete((req,res)=>{
    Article.deleteMany((err)=>{
        if(err) console.log(err);
        else res.send("deleted successfully");
    })
});

app.route("/articles/:name")
    .get((req,res)=>{
        Article.findOne({title:req.params.name},(err,result)=>{
            if(err) console.log(err);
            else{
                if(!result)
                    res.send("not found");
                else
                    res.send(result);
            }
        })
    })
    .put((req,res)=>{
        let updated=req.body.update;
        let updateddesc=req.body.desc;
        Article.updateOne({title:req.params.name},{title:updated,desc:updateddesc},(err,result)=>{
            if(err) console.log(err);
            else {
                if(!result) res.send("not found");
                else res.send(result);
            }
        })
    })
    .patch((req,res)=>{
        Article.updateOne(
            {title:req.params.name},{$set:req.body},(err,result)=>{
            if(err) console.log(err);
            else {
                if(!result) 
                    res.send("Not found");
                else   
                    res.send(result);
            }
        })
    })
    .delete((req,res)=>{
        Article.deleteOne({title:req.params.name},(err)=>{
            if(err) console.log("not found");
            else res.send("deleted succesfully");
        })
    })
app.listen(port,function(){
    console.log("wiki server has started in port"+port);
})