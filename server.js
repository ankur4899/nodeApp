const _= require('lodash');
const express=require('express');
const bodyParser=require('body-parser');

const {mongoose}=require('./server/db/mongoose');
var {Todo}=require('./server/models/todo');
var {User}=require('./server/models/user');


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

app.post('/users',(req,res)=>{
   console.log("Req",req.body);
   var body=_.pick(req.body,['email','password']);
   console.log("boyd",body);
   var user=new User(body);
      
   user.save().then((data)=>{
       console.log("dsad",data);
       return user.generateAuthToken();

   }).then((token)=>{
    res.header('x-auth',token).status(200).send(user);
   }).catch((err)=>{
       console.log("Error",err.code);
       const errMsg=`${req.body.email} already exists!!`;
       if(err.code===11000){
        return res.status(400).send(errMsg);
       }
    res.status(400).send(err);
   });

});


app.delete('/todos/:id',(req,res)=>{
  var todo=new Todo();

  console.log("ID",req.params.id);
  Todo.findOneAndRemove({_id:req.params.id}).then((result)=>{
       res.status(201).send(result);
  },
 (err)=>{
     console.log("Error",err);
     res.status(400).send(err);
 }
)
});


app.patch('/todos/:id',(req,res)=>{
    var id=req.params.id;
    var todo=new Todo();
    var body=_.pick(req.body,['text','completed']);

    if(_.isBoolean(body.completed) && body.completed){
          body.completedAt=new Date().getTime();
    }
    else{
        body.completed=false;
        body.completedAt=null;
    }

    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
              
        if(!todo){
            res.status(404).send();
        }
        res.send(todo);
    },
    (err)=>{
        console.log("Error",err);
        res.status(400).send();
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