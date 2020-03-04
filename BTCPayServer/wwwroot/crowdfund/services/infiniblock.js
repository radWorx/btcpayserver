function kyoob(blockinfostring) {
    // BA -----------------------------------------------------------------------------
    var audio = document.querySelector("audio");
    var synth = new Tone.MembraneSynth().toMaster();
    var synth2 = new Tone.AMSynth().toMaster();

    //EFFECTS-----------------------------------------------------------

    //var pingPong = new Tone.PingPongDelay("16n", 0.2).toMaster();
    //var drum = new Tone.MembraneSynth().connect(pingPong);

    var Reverb = new Tone.Reverb("4n", 0.1).toMaster();
    var drum = new Tone.MembraneSynth().connect(Reverb);

    //EFFECTS-----------------------------------------------------------

    var actx = Tone.context;
    var dest = actx.createMediaStreamDestination();
    var recorder = new MediaRecorder(dest.stream);
    //var blockinfostring = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";
    synth.connect(dest);
    synth.toMaster();

    var chunks = [];
    var start = -1;
    var end = start + 2;
    var timeout;
    function stoptimeout() {
        clearTimeout(timeout);
    }
    function slicestrg() {
        var s = blockinfostring;
        var slice = s.slice(start, end);

        return slice;
    }
    function nextslice() {
        var nextstart = start++;
        var nextend = end++;
        var nextindex = slicestrg(nextstart, nextend);
        return nextindex;
    }
    function wholeslice() {
        var wslice = nextslice();
        start++;
        end++;
        return wslice;
    }
    function playstr() {
        var s = slicestrg();
        try {

            synth.triggerAttackRelease(s, "4n");
            synth2.triggerAttackRelease(wholeslice(), "16n");
            drum.triggerAttackRelease(s, "4n");
        }

        catch (err) {
            //    //
        }

        console.log("from playstr " + s);

    }
    function playcolorstr(cc) {
        //var s = blockinfostring.slice(0, 2);
        //var n = blockinfostring.slice(2, 4); 
        //var w = blockinfostring.slice(4, 6);
        var s = slicestrg();
        var n = nextslice();
        var w = wholeslice();


        cc = "#" + s + n + w;
        console.log("from playcolorstr " + cc);
        return cc;
    }

    function playseq() {
        var n = nextslice();
        timeTime = 150;
        timeout = setTimeout(playseq, timeTime);
        playstr();
        //playcolorstr();
        playBAC();
        if (n === "") {
            stoptimeout();
            recorder.stop();
        }
    }

    function resetslice() {
        start = -1;
        end = start + 2;

        playstr();
    }

    function loopseq() {
        start = -1;
        end = start + 2;
        playseq();
    }

    recorder.ondataavailable = function (e) {
        chunks.push(e.data);

    };
    recorder.onstop = function () {

        var blob = new Blob(chunks, { type: 'audio/mpeg' });
        audio.src = URL.createObjectURL(blob);
        blob.name = blockinfostring;
    };


    // BA --------------------------------------------------------------------------
    // BC END ----------------------------------------------------------------------------------

    // Babylon ---------------------------------------------------------------------

    var canvas = document.getElementById("renderCanvas");
    var engine = null;
    var scene = null;
    var createDefaultEngine = function () { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true }); };
    var createScene = function () {

        var scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(1, 1, 1);
        var camera = new BABYLON.ArcRotateCamera("camera1", -Math.PI / 2, 1.2, 125, new BABYLON.Vector3(0, 30, 0), scene);
        // This positions the camera
        //camera.setPosition(new BABYLON.Vector3(0, 0, 0));

        //camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);

        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), scene);
        light.groundColor = new BABYLON.Color3(0, 0, 0);
        var basecolor = "#000000";
        var color = new BABYLON.Color3(1, 0, 0);
        var innercolor = "#c397f7";
        var cubecolor = playcolorstr();
        //playseq();
        console.log("cubecolor from scene = " + cubecolor);

        // INNER CUBE---------------------------------------------------------------------
        var innerBox = BABYLON.MeshBuilder.CreateBox("innerBox", { height: 21, width: 21, depth: 21 }, scene);
        innerBox.position = new BABYLON.Vector3(0, 50.5, 0);
        innerBox.enableEdgesRendering();
        innerBox.edgesWidth = 25.0;
        innerBox.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
        var mat0 = new BABYLON.StandardMaterial("mat0", scene);
        mat0.diffuseColor = new BABYLON.Color3.FromHexString(cubecolor);
        innerBox.material = mat0;
        mat0.alpha = 0.5;

        // KyooB---------------------------------------------------------------------
        var kyooB = BABYLON.MeshBuilder.CreateBox("kyoob", { height: 21, width: 21, depth: 21 }, scene);
        kyooB.position = new BABYLON.Vector3(0, 29, 0);
        kyooB.rotation = new BABYLON.Vector3(0, 0, -Math.PI / 2);
        var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
        backgroundMaterial.diffuseTexture = new BABYLON.Texture("/images/kyoob-logo-round-orange.png", scene);
        backgroundMaterial.diffuseTexture.uScale = 1.0;
        backgroundMaterial.diffuseTexture.vScale = 1.0;
        kyooB.material = backgroundMaterial;

        //OUTER CUBE------------------------------------------------------------------
        var outterBox = BABYLON.MeshBuilder.CreateBox("outterBox", { height: 36, width: 36, depth: 36 }, scene);
        outterBox.position = new BABYLON.Vector3(0, 58, 0);
        outterBox.enableEdgesRendering();
        outterBox.edgesWidth = 25.0;
        outterBox.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
        var mat1 = new BABYLON.StandardMaterial("mat0", scene);
        mat1.diffuseColor = new BABYLON.Color3.FromHexString(cubecolor);
        mat1.alpha = 0.4;
        outterBox.material = mat1;

        //BASE CUBE--------------------------------------------------------------------------
        var BaseBoxMaker = function (name, size, material, edges, scene) {
            var gizmo = BABYLON.Mesh.CreateBox(name, 0.1, scene, true);
            gizmo.position = new BABYLON.Vector3(0, 40, 0);
            //gizmo.showBoundingBox = false;
            //gizmo.isPickable = false;

            gizmo.slaves = [];
            for (var i = 0; i < 6; i++) {
                gizmo.slaves[i] = BABYLON.Mesh.CreatePlane(name + i, size, scene, true);
                gizmo.slaves[i].parent = gizmo;
                if (edges) {
                    gizmo.slaves[i].enableEdgesRendering();
                    gizmo.slaves[i].edgesWidth = 25.0;
                    gizmo.slaves[i].edgesColor = new BABYLON.Color4(0, 0, 0, 1);
                }
                gizmo.slaves[i].material = new BABYLON.StandardMaterial("mat", scene);
                gizmo.slaves[i].material.diffuseColor = new BABYLON.Color3.FromHexString(basecolor);
                gizmo.slaves[i].material.alpha = 1;


            }

            gizmo.slaves[0].position = new BABYLON.Vector3(-size / 2, size / 2, 0);
            gizmo.slaves[0].rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);

            var texture0 = new BABYLON.Texture("/images/basemap-btcpay-logo-WH.png", scene);
            gizmo.slaves[0].material.opacityTexture = texture0;

            // Create and tweak the background material.
            //var side0Material = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
            //side0Material.diffuseTexture = new BABYLON.Texture("/images/basemap-btcpay-logo-WH.png", scene);
            //side0Material.diffuseTexture.uScale = 1;//Repeat on the Vertical Axes
            //side0Material.diffuseTexture.vScale = 1;//Repeat on the Horizontal Axes
            //gizmo.slaves[0].material = side0Material;


            //BACK
            gizmo.slaves[1].position = new BABYLON.Vector3(0, size / 2, size / 2);
            gizmo.slaves[1].rotation = new BABYLON.Vector3(0, Math.PI, 0);
            // Create and tweak the background material.
            var side1Material = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
            side1Material.diffuseTexture = new BABYLON.Texture("/images/Bitcoin2020-Glyph-dark-pattern 1.png", scene);
            side1Material.diffuseTexture.uScale = 1;//Repeat  on the Vertical Axes
            side1Material.diffuseTexture.vScale = 1;//Repeat  on the Horizontal Axes
            gizmo.slaves[1].material = side1Material;



            gizmo.slaves[2].position = new BABYLON.Vector3(size / 2, size / 2, 0);
            gizmo.slaves[2].rotation = new BABYLON.Vector3(0, -Math.PI / 2, 0);
            var texture2 = new BABYLON.Texture("/images/basemap-infiniblock-logo-wh.png", scene);
            gizmo.slaves[2].material.opacityTexture = texture2;
            // Create and tweak the background material.
            //var side2Material = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
            //side2Material.diffuseTexture = new BABYLON.Texture("/images/images/kyoob-logo-sqr-orange.png", scene);
            //side2Material.diffuseTexture.uScale = 1;//Repeat 5 times on the Vertical Axes
            //side2Material.diffuseTexture.vScale = 1;//Repeat 5 times on the Horizontal Axes
            //gizmo.slaves[2].material = side2Material;
            // TOP
            gizmo.slaves[3].position = new BABYLON.Vector3(0, size, 0);
            gizmo.slaves[3].rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
            //BOTTOM
            gizmo.slaves[4].position = new BABYLON.Vector3(0, 0, 0);
            gizmo.slaves[4].rotation = new BABYLON.Vector3(-Math.PI / 2, 0, 0);

            //FRONT
            gizmo.slaves[5].position = new BABYLON.Vector3(0, size / 2, -size / 2);
            gizmo.slaves[5].rotation = new BABYLON.Vector3(0, 0, 0);

            //var texture5 = new BABYLON.Texture("/images/basemap.png", scene);
            //gizmo.slaves[5].material.opacityTexture = texture5;

            // Create and tweak the background material.
            var side5Material = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
            side5Material.diffuseTexture = new BABYLON.Texture("/images/basemap-sponsor_logo_2.png", scene);
            side5Material.diffuseTexture.uScale = 1.0;//Repeat on the Vertical Axes
            side5Material.diffuseTexture.vScale = 1.0;//Repeat on the Horizontal Axes
            gizmo.slaves[5].material = side5Material;
            //side5Material.alpha = 0.5;


            return gizmo;
        };

        var basebox = BaseBoxMaker("mybase", 40, null, true, scene);
        basebox.position = new BABYLON.Vector3(0, 0, 0);

        scene.onPointerObservable.add(function (evt) {
            switch (evt.type) {
                case BABYLON.PointerEventTypes.POINTERDOWN:

                    console.log("evt.pickInfo:", evt.pickInfo);
                    if (evt.pickInfo.pickedMesh) {
                        console.log("evt.pickInfo.pickedMesh:", evt.pickInfo.pickedMesh.name);
                        //evt.pickInfo.pickedMesh.material.diffuseColor = BABYLON.Color3.Random();

                       // document.addEventListener("click", playBAC());
                         //document.addEventListener("click", playseq());
                    }

                    break;
                case BABYLON.PointerEventTypes.POINTERUP:
                    break;
                case BABYLON.PointerEventTypes.POINTERTAP:
                    break;
                case BABYLON.PointerEventTypes.POINTERDOUBLETAP:
                    kyoob();

            }
        });

        return scene;
    };

    function playBAC() {
        var cubecolor = playcolorstr();
        var inner = scene.getMeshByID("innerBox");
        inner.material.diffuseColor = new BABYLON.Color3.FromHexString(cubecolor);
        var outterBox = scene.getMeshByID("outterBox");
        outterBox.material.diffuseColor = new BABYLON.Color3.FromHexString(cubecolor);

    }


    engine = createDefaultEngine();
    if (!engine) throw 'engine should not be null.';
    scene = createScene();

    engine.runRenderLoop(function () {
        if (scene) {

            scene.render();
            playBAC();
            playseq();
        }
    });


    // Resize
    window.addEventListener("resize", function () {
        engine.resize();

    });
    // Babylon END ---------------------------------------------------------------------
    //attach a click listener to a play button
    document.querySelector('#playbutton').addEventListener('click', async () => {

        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://kyoob.local:5000/genesis", true);
        xhttp.send();
        recorder.start();
        playseq();
        console.log('audio is ready');
    });
}
//getstring(searchstr);
kyoob();

