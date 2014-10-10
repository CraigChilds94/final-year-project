import 'dart:html';
import 'dart:math' as Math;

import 'package:vector_math/vector_math.dart';
import 'package:three/three.dart';
import 'package:three/extras/renderers/canvas_renderer.dart';

class Game {
    
    Element container;
    OrthographicCamera camera;
    Scene scene;
    CanvasRenderer renderer;
    
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
        
        container = new Element.tag('div');
        document.body.nodes.add(container);
        
        _createCamera();   
        
        scene = new Scene();
        camera.lookAt(scene.position);
        
        _generateGrid();
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
    
    dynamic _update(num time) 
    {
        window.requestAnimationFrame(_update);
        _render();
    }
    
    void _render() 
    {
        renderer.render(scene, camera);
    }
    
    void _generateGrid() 
    {
        var geometry, material;

        // Grid
        geometry = new Geometry();
        geometry.vertices.add(new Vector3(-500.0, 0.0, 0.0));
        geometry.vertices.add(new Vector3(500.0, 0.0, 0.0));

        for (var i = 0; i <= 20; i++) {
            var line = new Line(geometry, new LineBasicMaterial(color: 0x000000, opacity: 0.2));
            line.position.z = (i * 50.0) - 500.0;
            scene.add(line);
            
            line = new Line(geometry, new LineBasicMaterial(color: 0x000000, opacity: 0.2));
            line.position.x = (i * 50.0) - 500.0;
            line.rotation.y = 90.0 * Math.PI / 180.0;
            scene.add(line);
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