import 'dart:html';
import 'dart:math' as Math;

import 'package:vector_math/vector_math.dart';
import 'package:three/three.dart';
//import 'package:three/src/renderers/web_gl_renderer.dart';

import 'keyboard.dart';

class Game {

    Element container;
    PerspectiveCamera camera;
    Scene scene;
    WebGLRenderer renderer;
    Keyboard keyboard;

    double width, height;
    double speed;

    Game(this.width, this.height)
    {
        print("Starting Game");
        _init();
        _update(0);
    }

    void _init()
    {
        // speed = 1.0;
        keyboard = new Keyboard();
        container = new DivElement();
        document.body.nodes.add(container);

        container.setAttribute('width', width.toString());
        container.setAttribute('height', height.toString());

        _createCamera();

        scene = new Scene();
        camera.lookAt(scene.position);
        camera.translateY(50.0);

        _generateCubes();
        _createLight();

        renderer = new WebGLRenderer();
        renderer.setSize(width.toInt(), height.toInt());
        container.nodes.add(renderer.domElement);

        container.focus();
    }

    void _createCamera()
    {
        camera = new PerspectiveCamera(45.0, width / height, 1.0, 10000.0);
    }

    void _createLight()
    {
        var light = new PointLight(0xffffff);
        scene.add(light);
    }

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

    void _refreshCameraProjection()
    {
        camera.updateProjectionMatrix();
    }
}
