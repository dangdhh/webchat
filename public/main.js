var socket = io("https://rainnovember.herokuapp.com");

socket.on("server-send-listUser", function(data){
  $('#listMem').html("");
  data.forEach(function(i){
    $('#listMem').append("<li class='list-group-item'>"+ i +"<i class='fa fa-check-circle-o'></i></li>");
  });
});
//neu tai khoan da co nguoi su dung gửi về client va alert ra man hinh
socket.on("Server-send-fail",function(){
  alert("Tài khoản đã tồn tại");
});
//dang nhap thanh cong dgan tên vào currentUser và ẩn login show chatbox
socket.on("Server-send-success", function(data){
  $('#currentUser').html(data);
  $('#login').hide(2000);
  $('#chatbox').show(1000);
});

//realtime như facebook .khi nguoi dung nhap vao khung chat ben ngkhac se hien co ng dang nhap van ban
socket.on("server-send-typing",function(){
  $('#inputmessage').show();
});
//khi click chuot ra khoi input bao len server ngung nhap van ban
socket.on("server-send-stop-typing", function(){
  $('#inputmessage').hide();
});
//server trả message ve cho ng dung
socket.on("Server-send-message",function(data){
   //$('#listMessage').append("<div class='you' id='talkbubble_you'>"+data.un+ ": " + data.nd +"<div class='time'>12:15</div></div>");

   sendMessage(data);
});

function sendMessage(data){
    var lastUsername = $( "#listMessages > div.message-group:last" ).attr("username");
    sameLastMessage = false;
    if(lastUsername === data.username){
      const html = '<div class="including"><div class="message">' + data.message + '</div></div>';

        $("#listMessages > div.message-group:last").find('.message:last').addClass('bottom');
        $("#listMessages > div.message-group:last").find('#messages').append(html);

        sameLastMessage = true;
    }else{
      if (data.username == socket.username) {
            // tin nhan cua toi
            const html = `
                <div class="message-group me" username="` + data.username + `">
                    <div class="message-body">
                        <div id="messages">
                            <div class="including">
                                <div class="message">` + data.message + `</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $('#listMessages').append(html);
        }else {
            // tin nhan cua nguoi khac
            const html =
            `<div class="message-group" username="` + data.username + `">
                <img src="images/no-avatar.png" class="message-avatar" />
                <div class="message-body">
                    <h4 class="message-username">` + data.username + `</h4>
                    <div id="messages">
                        <div class="including">
                            <div class="message">` + data.message + `</div>
                        </div>
                    </div>
                </div>
            </div>`;
            $('#listMessages').append(html);
        }
    }
    if (sameLastMessage) {
        $( "#listMessages > div.message-group:last" ).find('.message:last').removeClass('bottom');
        $( "#listMessages > div.message-group:last" ).find('.message:last').addClass('top');
    }

    $('#listMessages').scrollTop($('#listMessages').prop('scrollHeight'));
};


$(document).ready(function(){
  //click vao dang ki
  $('#btn-submit').click(function(){
    var username = $('#yourName').val();
    if(username == ""){
      alert("Vui lòng nhập tên");
    }else{
      socket.emit("Client-send-data",username );
      socket.username = username;
    }

  });
  //enter dang ki
  $('#yourName').keyup(function(e){
    if(e.which == 13){
      var username = $('#yourName').val();
      if(username == ""){
        alert("Vui lòng nhập tên");
      }else{
        socket.emit("Client-send-data",username );
        socket.username = username;
      }
    }
  });
  //button logout
  $('#btn-logout').click(function(){
      socket.emit("logout");
      $('#chatbox').hide(2000);
      $('#login').show(1000);

  });
  //enter de gui tin nhan len server
  $('#textMessage').keyup(function(e){
    if(e.which == 13){
      var message = $('#textMessage').val();
      socket.emit("Client-send-message",message );
      $('#textMessage').val("");
    }
  });
  //button click gui tin nhan len server
  $('#btn-send').click(function(){
    var message = $('#textMessage').val();
    socket.emit("Client-send-message",message );
    $('#textMessage').val("");
  });
  //khi nhap chuot vao o nhap message gui len server
  $('#textMessage').focusin(function(){
    socket.emit("client-send-typing");
  });
  //khi nhap chuot ra ngoai o message gui len server
  $('#textMessage').focusout(function(){
    socket.emit("client-stop-typing");
  })
});
