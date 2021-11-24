const express = require('express');
const cors = require('cors');
const axios =require("axios");
const app = express();
app.use(express.json());
app.use(cors());
const events=[]
app.post('/events',async(req,res,next)=>{
    const event=req.body;
    events.push(event);
   await  axios.post('http://posts-cluster-srv:4000/events',event).catch(err=>console.log(err.message,"4000"));
   await  axios.post('http://comment-srv:4001/events',event).catch(err=>console.log(err.message,"4001"));
   await  axios.post('http://query-srv:4002/events',event).catch(err=>console.log(err.message,"4002"));
   await  axios.post('http://moderation-srv:4003/events',event).catch(err=>console.log(err.message,"4003"));
   
   res.send({status:"ok"});

});

app.get('/events',(req,res,next)=>{
  res.send(events);
})

app.listen(4005, () => {
  console.log('Listening on 4005');
});
/**
do some reseach about load balancer and ingress */