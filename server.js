
const express=require('express');
const hbs=require('hbs');
const fs=require('fs');

var app=express();
var port=process.evt.PORT||3000;

hbs.registerPartials(__dirname+'/views/partials');
app.set('view-engine','hbs');


hbs.registerHelper('getCurrentYear',()=>{
    return new Date().getFullYear();
});

app.use((req,res,next)=>{
    var now=new Date().toString();
    var log=`${now}: ${req.method}  ${req.url}`;
    fs.appendFile('server.log',log+'\n',(err)=>{
        if(err){
            console.log("unable to append");
        }
    });
    console.log(`${now}: ${req.method}  ${req.url}` );
    next();
});

// app.use((req,res,next)=>{
//    res.render('maintenance.hbs',{
//        pageTitle:'Maintenance'
//    })
// });

app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{
   // res.send('Hello Express');
  res.render('home.hbs',{
      pageTitle:'Home',
  })
});

app.get('/about',(req,res)=>{
    res.render('about.hbs',{
        pageTitle:'About',
    });
});

app.get('/bad',(req,res)=>{
    res.send({
        errorMessage:'Bad Request'
    });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);              
});