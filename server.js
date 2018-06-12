
const express=require('express');
const bodyParser=require('body-parser');

const {mongoose}=require('./server/db/mongoose');
var {Todo}=require('./server/models/todo');
var {Users}=require('./server/models/user');


// const hbs=require('hbs');
 const fs=require('fs');

var app=express();
var port=process.env.PORT||3000;

//hbs.registerPartials(__dirname+'/views/partials');
//app.set('view-engine','hbs');


// hbs.registerHelper('getCurrentYear',()=>{
//     return new Date().getFullYear();
// });

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



app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    console.log("Body",req.body);
    var todo=new Todo({
        text:req.body.text
    });

    todo.save().then((result)=>{
        console.log("Saved successfully");

        res.send(result);
    },(err)=>{
        console.log("Error",err);
        res.status(400).send(err);
    })
});

app.get('/todos',(req,res)=>{
    var todo=new Todo();

    Todo.find().then((result)=>{
         res.send({
             "todos":result
         });
     },
     (err)=>{
         console.log("Error",err);
         res.status(400).send(err);
     }
)
});

// app.use((req,res,next)=>{
//    res.render('maintenance.hbs',{
//        pageTitle:'Maintenance'
//    })
// });

app.use(express.static(__dirname+'/public'));

// app.get('/',(req,res)=>{
//    // res.send('Hello Express');
//   res.render('home.hbs',{
//       pageTitle:'Home',
//   })
// });

// app.get('/projects',(req,res)=>{
//     // res.send('Hello Express');
//    res.render('projects.hbs',{
//        pageTitle:'Project Dashboard',
//    })
//  });

// app.get('/about',(req,res)=>{
//     res.render('about.hbs',{
//         pageTitle:'About',
//     });
// });

// app.get('/bad',(req,res)=>{
//     res.send({
//         errorMessage:'Bad Request'
//     });
// });

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);              
});


module.export={app};