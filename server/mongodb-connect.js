const {MongoClient,ObjectID}=require('mongodb');

const url="mongodb://localhost:27017/TodoApp";

MongoClient.connect(url,(err,client)=>{
    if(err){
      return  console.log("Unable to connect to mongodb");
    }
   
    const db=client.db('TodoApp');
    console.log("Connected Successfully");
    //  db.collection('Todos').insertOne({
    //      text:'Ankur',
    //      completed:false
    //  },(err,result)=>{
    //      if(err){
    //          return console.log("unable to create record",err);
    //      }

    //      console.log(JSON.stringify(result.ops));
    //  })
    // db.collection('Users').insertOne({
    //     name:'Ankur',
    //     age:25,
    //     location:'Infinity Noida'
    // },(err,result)=>{
    //     if(err){
    //         return console.log("Unable to insert user data",err)
    //     }
    //     console.log(JSON.stringify(result.ops));

    // })
   
    db.collection('Users').findOneAndUpdate({
        _id:new ObjectID('5b164f4c678bc66970ac8a97')
    },
    {
        $set:{
            location:'Jaora'
        },
        
            $inc: 
            {  
               age:5
            }       
    },
    {
        returnOriginal:false
    }
).then((result)=>{
    console.log("Result",result);
})


    client.close();
})