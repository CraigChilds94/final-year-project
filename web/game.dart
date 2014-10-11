import 'dart:html';
import 'dart:math' as Math;

import 'package:vector_math/vector_math.dart';
import 'package:three/three.dart';
import 'package:three/extras/renderers/canvas_renderer.dart';

import 'keyboard.dart';

class Game {

    Element container;
    OrthographicCamera camera;
    Scene scene;
    CanvasRenderer renderer;
    Keyboard keyboard;

    num width, height;

    Game(this.width, this.height)
    {
        print("Starting Game");
        _init();
        _update(0);
    }

    void _init()
    {
        _refreshWindowSize();
        keyboard = new Keyboard();
        container = new Element.tag('div');
        document.body.nodes.add(container);

        _createCamera();

        scene = new Scene();
        camera.lookAt(scene.position);

        _generateGrid(20, 500.0);
        _generateCubes();
        _createLight();

        renderer = new CanvasRenderer();
        renderer.setSize(width, height);
        container.nodes.add(renderer.domElement);

        window.onResize.listen(_onWindowResize);
    }

    void _createCamera()
    {
        camera = new OrthographicCamera(-width/2, width/2, height/2, -height/2, -2000.0, 1000.0)
            ..position.setValues(0.0, 200.0, 0.0);
    }

    void _createLight()
    {
        var light = new PointLight(0xFF0000);
        scene.add(light);
    }

    void _handleKeyboardInput()
    {
        if(keyboard.isPressed(KeyCode.W)) {
            camera.translateY(1.0);
        } else if(keyboard.isPressed(KeyCode.S)) {
            camera.translateY(-1.0);
        }

        if(keyboard.isPressed(KeyCode.A)) {
            camera.translateX(-1.0);
        } else if(keyboard.isPressed(KeyCode.D)) {
            camera.translateX(1.0);
        }

    }

    dynamic _update(num time)
    {
        _handleKeyboardInput();
        window.requestAnimationFrame(_update);
        _render();
    }

    void _render()
    {
        renderer.render(scene, camera);
    }

    void _generateGrid(var squares, double size)
    {
        var geometry = new Geometry()
            ..vertices.add(new Vector3(-size, 0.0, 0.0))
            ..vertices.add(new Vector3(size, 0.0, 0.0));

        var squareSize = size / squares;
        print(squareSize);
        print(500 / 20);

        for(var i = 0; i <= squares; i++) {
            var line = new Line(geometry, new LineBasicMaterial(color: 0x000000, opacity: 0.2));
            line.position.z = i * squareSize;
            scene.add(line);

            line = new Line(geometry, new LineBasicMaterial(color: 0x000000, opacity: 0.2));
            line.position.x = i * squareSize;
            line.rotation.y = 90.0 * Math.PI / 180.0;
            scene.add(line);
        }

//        double a = size / squares;
//
//        for (var i = 0; i <= squares; i++) {
//            var line = new Line(geometry, new LineBasicMaterial(color: 0x000000, opacity: 0.2));
//            line.position.z = (a * i) - size;
//            scene.add(line);
//
//            line = new Line(geometry, new LineBasicMaterial(color: 0x000000, opacity: 0.2));
//            line.position.x = (a * i) - size;
//            line.rotation.y = 90.0 * Math.PI / 180.0;
//            scene.add(line);
//        }
    }

    void _generateCubes()
    {
        var geometry = new CubeGeometry(50.0, 50.0, 50.0);
        var material = new MeshLambertMaterial(color: 0xffffff, overdraw: true);

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

    void _refreshWindowSize()
    {
//        windowHalfX = window.innerWidth / 2;
//        windowHalfY = window.innerHeight / 2;
    }

    void _refreshCameraProjection()
    {
//        camera.left = -windowHalfX;
//        camera.right = windowHalfX;
//        camera.top = windowHalfY;
//        camera.bottom = -windowHalfY;
        camera.updateProjectionMatrix();
    }

    void _onWindowResize(event)
    {
        _refreshWindowSize();
        _refreshCameraProjection();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
