/* ========================
   THREE.JS - Connected Dot Particles Background
   ======================== */

window.addEventListener("DOMContentLoaded", function () {

    var canvas = document.getElementById("heroCanvas");
    if (!canvas) return;

    // ---- Scene Setup ----
    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(
        60,
        canvas.clientWidth / canvas.clientHeight,
        0.1,
        1000
    );
    camera.position.z = 40;

    var renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ---- Create Dot Particles ----
    var particleCount = 120; // Reduced count because of connections math
    var maxDistance = 16;     // Distance for connecting lines

    var particlesGeo = new THREE.BufferGeometry();
    var particlePositions = new Float32Array(particleCount * 3);
    var velocities = [];

    // Initialize positions and velocities
    for (var i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 100;     // x
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 80;  // y
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 40;  // z

        velocities.push({
            x: (Math.random() - 0.5) * 0.05,
            y: (Math.random() - 0.5) * 0.05,
            z: (Math.random() - 0.5) * 0.05
        });
    }

    particlesGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    // Create circular texture for dots
    var canvasTexture = document.createElement('canvas');
    canvasTexture.width = 16;
    canvasTexture.height = 16;
    var ctx = canvasTexture.getContext('2d');
    ctx.beginPath();
    ctx.arc(8, 8, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#E8724A";
    ctx.fill();
    var dotTexture = new THREE.CanvasTexture(canvasTexture);

    var particlesMat = new THREE.PointsMaterial({
        size: 0.8,
        map: dotTexture,
        transparent: true,
        opacity: 0.8,
        alphaTest: 0.1,
        sizeAttenuation: true,
        color: 0xE8724A
    });

    var particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // ---- Create Lines ----
    var linesGeo = new THREE.BufferGeometry();
    // Maximum possible connections
    var linePositions = new Float32Array(particleCount * particleCount * 6);
    linesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    var linesMat = new THREE.LineBasicMaterial({
        color: 0xE8724A,
        transparent: true,
        opacity: 0.15
    });

    var linesMesh = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(linesMesh);


    // ---- Mouse Interaction ----
    var mouseX = 0;
    var mouseY = 0;
    var targetMouseX = 0;
    var targetMouseY = 0;

    document.addEventListener("mousemove", function (e) {
        targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // ---- Animation Loop ----
    function animate() {
        requestAnimationFrame(animate);

        // Smooth mouse following for camera
        mouseX += (targetMouseX - mouseX) * 0.05;
        mouseY += (targetMouseY - mouseY) * 0.05;
        camera.position.x = mouseX * 8;
        camera.position.y = -mouseY * 8;
        camera.lookAt(scene.position);

        var pPos = particleSystem.geometry.attributes.position.array;
        var lPos = linesMesh.geometry.attributes.position.array;
        
        var vertexPos = 0;

        for (var i = 0; i < particleCount; i++) {
            // Update particle positions
            pPos[i * 3] += velocities[i].x;
            pPos[i * 3 + 1] += velocities[i].y;
            pPos[i * 3 + 2] += velocities[i].z;

            // Wrap around screen bounds
            if (pPos[i * 3] > 50) pPos[i * 3] = -50;
            if (pPos[i * 3] < -50) pPos[i * 3] = 50;
            if (pPos[i * 3 + 1] > 40) pPos[i * 3 + 1] = -40;
            if (pPos[i * 3 + 1] < -40) pPos[i * 3 + 1] = 40;
            if (pPos[i * 3 + 2] > 20) pPos[i * 3 + 2] = -20;
            if (pPos[i * 3 + 2] < -20) pPos[i * 3 + 2] = 20;

            // Check distance for connections
            for (var j = i + 1; j < particleCount; j++) {
                var dx = pPos[i * 3] - pPos[j * 3];
                var dy = pPos[i * 3 + 1] - pPos[j * 3 + 1];
                var dz = pPos[i * 3 + 2] - pPos[j * 3 + 2];
                var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (dist < maxDistance) {
                    lPos[vertexPos++] = pPos[i * 3];
                    lPos[vertexPos++] = pPos[i * 3 + 1];
                    lPos[vertexPos++] = pPos[i * 3 + 2];

                    lPos[vertexPos++] = pPos[j * 3];
                    lPos[vertexPos++] = pPos[j * 3 + 1];
                    lPos[vertexPos++] = pPos[j * 3 + 2];
                }
            }
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
        
        // Update lines
        linesMesh.geometry.setDrawRange(0, vertexPos / 3);
        linesMesh.geometry.attributes.position.needsUpdate = true;
        
        // Slow global rotation
        particleSystem.rotation.y += 0.001;
        linesMesh.rotation.y += 0.001;

        renderer.render(scene, camera);
    }

    animate();

    // ---- Window Resize ----
    window.addEventListener("resize", function () {
        if (!canvas.parentElement) return;
        var w = canvas.parentElement.clientWidth;
        var h = canvas.parentElement.clientHeight;
        
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    });

    // Initial resize
    setTimeout(function() {
        window.dispatchEvent(new Event('resize'));
    }, 100);
});
