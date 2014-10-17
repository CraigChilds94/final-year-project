import 'dart:html';
import 'dart:math' as Math;
import 'dart:async';
import 'dart:io' as IO;
import 'dart:convert';

import 'package:vector_math/vector_math.dart';
import 'package:three/extras/controls/first_person_controls.dart';
import 'package:three/three.dart';
import 'inputs.dart';

class Game {

    Element container;
    PerspectiveCamera camera;
//    FirstPersonControls controls;
    Scene scene;
    WebGLRenderer renderer;
    Keyboard keyboard;
    Mouse mouse;
    PointLight light;

    WebSocket ws;

    double width, height;
    double speed;
    
    ///
    /// Construct a new [Game] object
    /// 
    /// Takes a [width] and a [height] for the desired
    /// game panel.
    ///
    Game(this.width, this.height)
    {
        print("Starting Game");
        _init();
        _update(0);
    }

    ///
    /// Initialise the game and any
    /// components.
    ///
    void _init()
    {
        renderer = new WebGLRenderer(antialias:true)
            ..setSize(width.toInt(), height.toInt())
            ..shadowMapEnabled = true
            ..shadowMapType    = PCFSoftShadowMap;

        keyboard = new Keyboard();
        container = new DivElement()
            ..focus()
            ..setAttribute('width', width.toString())
            ..setAttribute('height', height.toString())
            ..nodes.add(renderer.domElement);

        mouse = new Mouse()
            ..attachTo(container)
            ..click(_handleMouseClick);

        document.body.nodes.add(container);

        _createCamera();

        var fog = new Fog()
            ..color = new Color(0x000000);
        scene = new Scene()
            ..fog = fog;

        camera.lookAt(scene.position);
        camera.translateY(50.0);

        _generateCubes();
        _createFloor();
        _createLight();
    }
    
    ///
    /// Initialise the network system for
    /// the game.
    /// 
    /// If it cannot connect to the local [ws] then
    /// become the host.
    ///
    void _initNetwork() 
    {
        ws = new WebSocket('ws://127.0.0.1:1672/ws')
            ..onOpen.first.then(_onConnect)
            ..onError.first.then(_onFail);
    }
    
    ///
    /// Create the server instance
    ///
    void _createServer()
    {
        IO.HttpServer.bind(IO.InternetAddress.ANY_IP_V4, 8080).then((IO.HttpServer server) {
            print("HttpServer listening...");
            server.serverHeader = "DartEcho (1.0) by James Slocum";
            server.listen((IO.HttpRequest request) {
                if (IO.WebSocketTransformer.isUpgradeRequest(request)){
                    IO.WebSocketTransformer.upgrade(request).then(_handleWebSocketInbound);
                } else {
                    print("Regular ${request.method} request for: ${request.uri.path}");
                    _serveRequest(request);
                }
            });
        });
    }
    
    ///
    /// What do we do with a connected client [socket]?
    /// 
    void _handleWebSocketInbound(IO.WebSocket socket)
    {
        print('Client connected!');
        socket.listen((String s) {
            if(s == "givemecubes") {
                socket.add("I'll give you some cubes");
            } else {
                socket.add("I don't know what you mean?");
            }
        },
        onDone: () {
            print('Client disconnected');  
        });
    }
    
    /// 
    /// Handle the non Web Socket [request]'s
    /// 
    void _serveRequest(request)
    {
        request.response.statusCode = HttpStatus.FORBIDDEN;
        request.response.reasonPhrase = "WebSocket connections only";
        request.response.close();
    }
    
    ///
    /// When connected to the server we want to listen
    /// on the [ws] and handle any data that is sent
    /// to this client.
    /// 
    /// We also take some information about the socket : [_]
    ///
    void _onConnect(_)
    {
        print("Connected to server.");
        ws.onMessage.listen((e) {
            _handleMessage(e.data);
        });
        
        ws.send("givemecubes");
    }
    
    ///
    /// We call this if we can't connect to an existing 
    /// host, therefore we need to become the host
    /// 
    /// We also take some information about the socket : [_]
    ///
    void _onFail(_)
    {
        print("Unable to connect, becoming host.");
        _createServer();
    }
    
    ///
    /// What do we do when we get the [data] from our host?
    /// 
    void _handleMessage(data)
    {
        print(data);
    }
    
    ///
    /// Create a new [camera] so that we can see things
    ///
    void _createCamera()
    {
        camera = new PerspectiveCamera(45.0, width / height, 1.0, 10000.0);
//        controls = new FirstPersonControls(camera)
//            ..lookSpeed = 0.4
//            ..movementSpeed = 20
//            // ..noFly = true
//            ..lookVertical = true
//            ..constrainVertical = true
//            ..verticalMin = 1.0
//            ..verticalMax = 2.0;
//            // ..lon = -150
//            // ..lat = 120;
    }
    
    ///
    /// Create a new [light] and add it to the scene
    ///
    void _createLight()
    {
        light = new PointLight(0xffffff);
        scene.add(light);
    }

    ///
    /// Event handler for a mouse click
    /// 
    /// This takes a [MouseEvent]
    ///
    void _handleMouseClick(MouseEvent e)
    {
        print(e);
    }
    
    /// 
    /// Handler for [keyboard] input
    /// 
    void _handleKeyboardInput()
    {
        if(keyboard.isPressed(KeyCode.SHIFT)) {
            speed = 2.0;
        } else {
            speed = 1.0;
        }

        if(keyboard.isPressed(KeyCode.W)) {
            camera.translateZ(-speed);
        } else if(keyboard.isPressed(KeyCode.S)) {
            camera.translateZ(speed);
        }

        if(keyboard.isPressed(KeyCode.A)) {
            camera.translateX(-1.0);
        } else if(keyboard.isPressed(KeyCode.D)) {
            camera.translateX(1.0);
        }

        if(keyboard.isPressed(KeyCode.LEFT)) {
            camera.rotation.add(new Vector3(0.0, 0.05, 0.0));
        } else if(keyboard.isPressed(KeyCode.RIGHT)) {
            camera.rotation.add(new Vector3(0.0, -0.05, 0.0));
        }
    }
    
    ///
    /// The games update function, it takes an
    /// argument which is the delta [time]
    ///
    dynamic _update(num time)
    {
        _handleKeyboardInput();
//        controls.update(time);
        camera.position.copyInto(light.position);
        window.requestAnimationFrame(_update);
        _render();
    }
    
    /// 
    /// Render the [scene] through the [camera]
    /// 
    void _render()
    {
        renderer.render(scene, camera);
    }
    
    ///
    /// Generate a floor
    /// 
    void _createFloor()
    {
        var geometry = new CubeGeometry(2000.0, 1.0, 2000.0);
        var material = new MeshLambertMaterial(color: 0x99FF99, overdraw: true);
        var floor = new Mesh(geometry, material)
            ..position.setValues(0.0, 0.0, 0.0);
        scene.add(floor);
    }
    
    ///
    /// Generate some cubes
    /// 
    void _generateCubes()
    {
        var geometry = new CubeGeometry(50.0, 50.0, 50.0);
        var material = new MeshLambertMaterial(color: 0xff3030, overdraw: true);

        var rnd = new Math.Random();

        for (int i = 0; i < 100; i ++) {

            var cube = new Mesh(geometry, material);
            cube.scale.y = rnd.nextInt(2) + 1.0;
            cube.position.x = ((rnd.nextInt(1000) - 500.0) / 50.0).floor() * 50.0 + 25.0;
            cube.position.y = (cube.scale.y * 50.0) / 2.0;
            cube.position.z = ((rnd.nextInt(1000) - 500.0) / 50.0).floor() * 50.0 + 25.0;

            scene.add(cube);
        }
    }
    
    ///
    /// Update the [camera] projection
    ///
    void _refreshCameraProjection()
    {
        camera.updateProjectionMatrix();
    }
}
