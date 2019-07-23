function babc(GetCryptoPaymentData) {
    // BA -----------------------------------------------------------------------------
    var audio = document.querySelector("audio");
    var synth = new Tone.MembraneSynth().toMaster();
    var actx = Tone.context;
    var dest = actx.createMediaStreamDestination();
    var recorder = new MediaRecorder(dest.stream);
    var gw = document.getElementById("getwallpaper");
    var sw = document.getElementById("savewallpaper");
    gw.disabled = false;
    sw.disabled = false;
    synth.connect(dest);
    synth.toMaster();
    recorder.start();
    var chunks = [];
    var start = 0;
    var end = start + 2;
    var timeout;
    function stoptimeout() {
        clearTimeout(timeout);
    }
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
    function playstr() {
        var s = slicestrg();
        var n = nextslice();
        try {
            synth.triggerAttackRelease(s, "4n");
        }
        catch (err) {
            //    //
        }
        $(".card").css("box-shadow", "0px 10px 20px" + "#" + s + n);
        $("body").css("background-color", "#" + s + n);
    }
    function playseq() {
        var n = nextslice();
        timeTime = 90;
        timeout = setTimeout(playseq, timeTime);
        playstr();
        if (n === "") {
            stoptimeout();
            recorder.stop();
        }
    }
    recorder.ondataavailable = function (e) {
        chunks.push(e.data);

    };
    recorder.onstop = function () {

        var blob = new Blob(chunks, { type: 'audio/mpeg' });
        audio.src = URL.createObjectURL(blob);
        blob.name = GetCryptoPaymentData;

        console.log("Your audio file" + "," + blob.name);
    };
    playseq();
    // BA --------------------------------------------------------------------------
    // BC --------------------------------------------------------------------------
    gw.addEventListener('click', makeWallpaper);
    sw.addEventListener('click', saveWallpaper);
    function makeWallpaper() {
        var payid = GetCryptoPaymentData;
        var cstart = 0;
        var cend = cstart + 6;
        var ht = 60;
        var wt = 60;
        for (let i = 0; i < 64; i++) {            
            var cp = document.getElementById("colorpads");
            var canvas = document.createElement("canvas");
            var color = payid.slice(cstart, cend);
            var ctx = canvas.getContext("2d");
            canvas.addEventListener('mouseover', playcolor);
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
        }
        catch (err) {
            this.height = 0;
            this.weight = 0;
            synth.dispose();
        }
    }

    function saveWallpaper() {
        var element = document.getElementById("colorpads-container");
       

        html2canvas(element, { backgroundColor: "null", imageTimeout: "0" }).then(canvas => {
            element.appendChild(canvas);            
        });
    }

        // BC --------------------------------------------------------------------------
}
