const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const posts = {};
    
const handleEvent=(type,data)=>{
  if (type == "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type == "CommentCreated") {
    const { id, content, postId,status } = data;
    const post = posts[postId];
    post.comments.push({ id, content ,status});
  }
  if (type == "CommentUpdated") {
    const { id, content, postId,status } = data;
    const post = posts[postId];
    const comment=post.comments.find(comment=>{
      return comment.id==id;
    })
    comment.status=status;
    comment.content=content;
  }

}
app.get("/posts", (req, res) => {
  console.log(posts,"posts")
  res.send(posts);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  handleEvent(type,data);
    
  res.send({});
});

app.listen(4002, async() => {
  console.log("Listening on 4002");
  const  res =await axios.get('http://event-bus-srv:4005/events').catch(err=>console.log(err.message))
  for(let event of res.data){
    console.log('Processing events:', event.type)
    handleEvent(event.type,event.data);
  }
});
/**
 * In this course we are assumeing  that pods and containers are same 
 * But actually they are not read about pod and difference between pod and container 
 * what is reserve proxy and proxy in server 
 */