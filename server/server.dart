import 'dart:async';
import 'dart:io';
import 'dart:convert';

List<WebSocket> sockets = new List();

///
/// The main for the server program
///
void main()
{
    createServer(1672);
}

///
/// Create a new server which listens on the
/// provided [port]
///
void createServer(port)
{
    HttpServer.bind(InternetAddress.ANY_IP_V4, port).then((HttpServer server) {
        print("HttpServer listening...");
        server.listen((HttpRequest request) {
            if (WebSocketTransformer.isUpgradeRequest(request)){
                WebSocketTransformer.upgrade(request).then(handleWebSocketInbound);
            } else {
                print("Regular ${request.method} request for: ${request.uri.path}");
                serveRequest(request);
            }
        });
    });
}

///
/// Serve a non-websocket request with a 
/// forbidden status
///
void serveRequest(request)
{
    request.response.statusCode = HttpStatus.FORBIDDEN
        ..response.reasonPhrase = "WebSocket connections only"
        ..response.close();
}

///
/// Handle incoming data from a [socket]
///
void handleWebSocketInbound(WebSocket socket)
{   
    sockets.add(socket);
    print('Client connected!');
    socket.listen((String s) {
        if(s == "givemecubes") {
            sockets.forEach((s) {
                s.add("makecube:0,100,0");
            });
        } else {
            socket.add("I don't know what you mean?");
        }
    },
    onDone: () {
        print('Client disconnected');  
    });
}