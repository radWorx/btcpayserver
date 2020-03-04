function babc(GetCryptoPaymentData) {
    //GetCryptoPaymentData = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";
    // BA -----------------------------------------------------------------------------
    var audio = document.querySelector("audio");
    var synth = new Tone.MembraneSynth().toMaster();
    var synth2 = new Tone.AMSynth().toMaster();

    //EFFECTS-----------------------------------------------------------
    //var pingPong = new Tone.PingPongDelay("16n", 0.2).toMaster();
    //var drum = new Tone.MembraneSynth().connect(pingPong);

    var Reverb = new Tone.Reverb("8n", 0.1).toMaster();
    var drum = new Tone.MembraneSynth().connect(Reverb);

    //EFFECTS-----------------------------------------------------------

    //AUDIO CONTEXT
    var actx = Tone.context;
    var dest = actx.createMediaStreamDestination();
    var recorder = new MediaRecorder(dest.stream);


    var pp = document.getElementById("playpads");
    var gw = document.getElementById("getwallpaper");
    var txid = document.getElementById("txidTBModal");

    txid.value = GetCryptoPaymentData;
    pp.disabled = false;
    gw.disabled = false;
    synth.connect(dest);
    synth.toMaster();
    recorder.start();
    var chunks = [];
    var start = -1;
    var end = start + 2;
    var colorstart = -1;
    var colorend = start + 2;
    var timeout;
    function stoptimeout() {
        clearTimeout(timeout);
    }

    //AUDIO STRING
    function slicestrg() {
        var payid = GetCryptoPaymentData;
        var slice = payid.slice(start, end);
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
    //COLOR STRING
    function slicecolorstrg() {
        var payid = GetCryptoPaymentData;
        var slice = payid.slice(colorstart, colorend);
        return slice;
    }
    function nextcolorslice() {
        var nextstart = colorstart++;
        var nextend = colorend++;
        var nextindex = slicestrg(nextstart, nextend);
        return nextindex;
    }
    function wholecolorslice() {
        var wslice = nextcolorslice();
        colorstart++;
        colorend++;
        return wslice;
    }

    function playstr() {
        var s = slicestrg();        
        try {
            synth.triggerAttackRelease(s, "4n");
            synth2.triggerAttackRelease(s, "8n");
            drum.triggerAttackRelease(s, "16n");
        }

        catch (err) {
            //    //
        }
            
        
    }

   
    function colorstr(cc) {
        //var s = blockinfostring.slice(0, 2);
        //var n = blockinfostring.slice(2, 4); 
        //var w = blockinfostring.slice(4, 6);
        var s = slicecolorstrg();
        var n = nextcolorslice();
        var w = wholecolorslice();

        cc = "#" + s + n + w;
        console.log("from playcolorstr " + cc);

        $(".card").css("box-shadow", "0px 10px 20px" + "#" + s + n);
        //$("body").css("background-color", "#" + s + n);
        $(".modal-body").css("background-color", "#" + s + n);
        $(".modal-content").css("box-shadow", "0px 10px 20px" + "#" + s + n);
        return cc;
    }


    function playseq() {
        var s = nextslice();
        timeTime = 150;
        timeout = setTimeout(playseq, timeTime);
        
        playBAC();
        if (s === "") {
            stoptimeout();
            recorder.stop();
        }

    }
    function playcolorstr() {
        var s = nextslice();
        timeTime = 150;
        timeout = setTimeout(playcolorstr, timeTime);
        playstr();
        if (s === "") {
            stoptimeout();
            
        }

    }
    recorder.ondataavailable = function (e) {
        chunks.push(e.data);

    };
    recorder.onstop = function () {

        var blob = new Blob(chunks, { type: 'audio/mpeg' });
        audio.src = URL.createObjectURL(blob);
        blob.name = GetCryptoPaymentData;
    };
    
    
    // BA --------------------------------------------------------------------------
    // BC --------------------------------------------------------------------------
    pp.addEventListener('click', makeWallpaperModal);
    gw.addEventListener('click', getWallpaper);
    function makeWallpaperModal() {
        $("canvas").remove();
        var payid = GetCryptoPaymentData;
        var cstart = 0;
        var cend = cstart + 6;
        var ht = 50;
        var wt = 50;
        for (let i = 0; i < 64; i++) {
            var cp = document.getElementById("colorpadsModal");
            var canvas = document.createElement("canvas");
            var color = payid.slice(cstart, cend);
            var ctx = canvas.getContext("2d");
            canvas.addEventListener('mouseover', playcolor);
            canvas.addEventListener('click', playcolor);
            canvas.id = color;
            canvas.width = wt;
            canvas.height = ht;
            ctx.fillStyle = "#" + color;
            ctx.fillRect(0, 0, wt, ht);
            canvas.innerHTML = color;
            cp.appendChild(canvas);
            cstart++;
            cend++;
        }

    }
    function playcolor() {
        var colorstart = 0;
        var colorend = colorstart + 2;
        var c = this.id;
        var s = c.slice(colorstart, colorend);
        try {
            var synth = new Tone.Synth().toMaster();
            synth.triggerAttackRelease(s, "4n");
            $(".colorpadsModal").css("background-color", "#" + s);
        }
        catch (err) {
            this.height = 0;
            this.weight = 0;
            synth.dispose();
        }
    }
    function getWallpaper() {

        var element = document.getElementById("colorpadsModal");
        
        html2canvas(element, { backgroundColor: "null", imageTimeout: "0" }).then(canvas => {
            $("canvas").remove();
            element.appendChild(canvas);           
        });
        
    }

    // BC --------------------------------------------------------------------------

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
        var cubecolor = colorstr();
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
        kyooB.enableEdgesRendering();
        kyooB.edgesWidth = 25.0;
        kyooB.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
        var backgroundMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
        backgroundMaterial.diffuseTexture = new BABYLON.Texture("/images/kyoob-logo-sqr-orange.png", scene);
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
            // Create and tweak the background material.
            var basetopMaterial = new BABYLON.BackgroundMaterial("backgroundMaterial", scene);
            basetopMaterial.diffuseColor = new BABYLON.Color3.FromHexString("#ffffff");

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

                        //document.addEventListener("click", playBAC());
                        // document.addEventListener("click", playseq());
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
        var cubecolor = colorstr();
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
        }
    });
    // Resize
    window.addEventListener("resize", function () {
        engine.resize();

    });
    // Babylon END ---------------------------------------------------------------------

    document.querySelector('#closemodal').addEventListener('click', async () => {

        //var xhttp = new XMLHttpRequest();
        //xhttp.open("GET", "http://kyoob.local:5000/genesis", true);
        //xhttp.send();
        //recorder.start();
        //playseq();
        babc();
        console.log('audio is ready');
    });

    playseq();
    playcolorstr();
    }

