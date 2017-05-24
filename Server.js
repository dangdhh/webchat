var express = require("express"); //goi module express
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");
var server = require("http").Server(app);
var io = require("socket.io")(server); //goi module socket
server.listen(process.env.PORT || 3000);

var mangUser= []; //mang de luu Username khidang ky
//lang nghe co ket noi
io.on("connection", function(socket){
  console.log("co nguoi ket noi thanh cong"+ socket.id); //neu co ket noi den server console

  socket.on("disconnect", function(){
    //neu nguoi dung tat trinh duyet ngung ket noi
    console.log(socket.username + "vua ngat ket noi");
    mangUser.splice(mangUser.indexOf(socket.username),1); //tim toi username ng dung ngat ket noi va xoa di 1 phan tu
    socket.broadcast.emit("server-send-listUser", mangUser); //tra mang danh sach ve cho nguoi dung con lai de cap nhap lai danh sach thanh vien
  })

  socket.on("Client-send-data", function(data){ //server lang nghe client send data dang ki
    if(mangUser.indexOf(data)>=0){
      //neu da ton tai trong mangUser
      socket.emit("Server-send-fail");
    }else{
      //neu chua ton tai
      mangUser.push(data);
      socket.username = data; //username la tu tao cho no 1 thuoc tinh gán nó bang data(ten dang ki)
      socket.emit("Server-send-success", data); //tra ve co client dang ki thanh cong kem theo data(ten dang ki)
      io.sockets.emit("server-send-listUser", mangUser); //tra va cho tat ca nguoi dung list danh sach thanh vien
    }
  });

  socket.on("logout", function(){ //khi client nhan nut logout server lang nghe
    mangUser.splice(mangUser.indexOf(socket.username),1); //tim username nguoi dung logout va xoa di 1 phan tu
    socket.broadcast.emit("server-send-listUser", mangUser); //cap nhap lai danh sach
  });

  socket.on("Client-send-message", function(data){//lang nghe client gui tin nhan len server
    io.sockets.emit("Server-send-message", {
      //gui 1 JSON ve cho client id, uername, message tu dat. thich dat j cũng dc
      id: socket.id,
      username: socket.username,
      message: data
    });
  });

  socket.on('client-send-typing', function() {
    socket.broadcast.emit('server-send-typing');
  });

  socket.on("client-stop-typing", function(){
    socket.broadcast.emit("server-send-stop-typing");
  })

});


app.get("/", function(req, res){ //khi ng dung truy cap vao Route  "/" render ve trang home
  res.render("home");//trang home.ejs
});
