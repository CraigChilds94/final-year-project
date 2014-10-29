import 'dart:html';
import 'dart:math' as Math;
import 'dart:async';

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
    
    List players; 
    Mesh player;

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
        init();
        update(0);
    }

    ///
    /// Initialise the game and any
    /// components.
    ///
    void init()
    {   
        players = new List();
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
            ..click(handleMouseClick);

        document.body.nodes.add(container);
    
//        spawnPlayer(0.0, 0.0, 0.0);
        createCamera();

        var fog = new Fog()
            ..color = new Color(0x000000);
        scene = new Scene()
            ..fog = fog;

        camera.lookAt(scene.position);
        camera.translateY(50.0);

//        generateCubes();
        createFloor();
        createLight();

        initNetwork();
    }

    ///
    /// Initialise the network system for
    /// the game.
    ///
    /// If it cannot connect to the local [ws] then
    /// become the host.
    ///
    void initNetwork()
    {
        ws = new WebSocket('ws://127.0.0.1:1672/ws')
            ..onOpen.first.then(onConnect)
            ..onError.first.then(onFail);
    }


    ///
    /// When connected to the server we want to listen
    /// on the [ws] and handle any data that is sent
    /// to this client.
    ///
    /// We also take some information about the socket : []
    ///
    void onConnect(_)
    {
        print("Connected to server.");
        ws.onMessage.listen((e) {
            handleMessage(e.data);
        });
    }

    ///
    /// We call this if we can't connect to an existing
    /// host, therefore we need to become the host
    ///
    /// We also take some information about the socket : []
    ///
    void onFail(_)
    {
        print("Unable to connect. Reattempting connection.");
        new Timer(new Duration(seconds:2), () {
            initNetwork();
        });
    }

    ///
    /// What do we do when we get the [data] from our host?
    ///
    void handleMessage(String data)
    {
        var chunks = data.split(':');
        var action = chunks[0];

        if(action == "makecube") {
            var pos = chunks[1].split(',');
            int x = int.parse(pos[0]);
            int y = int.parse(pos[1]);
            int z = int.parse(pos[2]);
            createCube(x.toDouble(), y.toDouble(), z.toDouble());
        }
    }

    ///
    /// Create at cube at the position [x][y][z]
    ///
    void createCube(double x, double y, double z)
    {
        var geometry = new CubeGeometry(50.0, 50.0, 50.0);
        var material = new MeshLambertMaterial(color: 0x99FF99, overdraw: true);
        var cube = new Mesh(geometry, material)
            ..position.setValues(x, y, z);
        scene.add(cube);
    }

    ///
    /// Create a new [camera] so that we can see things
    ///
    void createCamera()
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
    void createLight()
    {
        light = new PointLight(0xffffff);
        scene.add(light);
    }

    ///
    /// Event handler for a mouse click
    ///
    /// This takes a [MouseEvent]
    ///
    void handleMouseClick(MouseEvent e)
    {
        print(e);
        ws.send("givemecubes");
    }

    ///
    /// Handler for [keyboard] input
    ///
    void handleKeyboardInput()
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
    dynamic update(num time)
    {
        handleKeyboardInput();
//        controls.update(time);
        camera.position.copyInto(light.position);
        window.requestAnimationFrame(update);
        render();
    }

    ///
    /// Render the [scene] through the [camera]
    ///
    void render()
    {
        renderer.render(scene, camera);
    }

    ///
    /// Generate a floor
    ///
    void createFloor()
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
    void generateCubes()
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
    
    void spawnPlayer(double x, double y, double z, [bool networked = false])
    {
        var geometry = new CubeGeometry(10.0, 50.0, 10.0);
        var material = new MeshLamberMaterial(color: 0x00FF00, overdraw: true);
        var mesh = new Mesh(geometry, material)
            ..position.setValues(x, y, z);
        
        if(!networked) {
            player = mesh;
            return;
        } 
        
        players.add(mesh);
    }

    ///
    /// Update the [camera] projection
    ///
    void refreshCameraProjection()
    {
        camera.updateProjectionMatrix();
    }
}
