function babc(GetCryptoPaymentData) {
    // BA -----------------------------------------------------------------------------
    var audio = document.querySelector("audio");
    var synth = new Tone.MembraneSynth().toMaster();
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
        $(".modal-body").css("background-color", "#" + s + n);
        $(".modal-content").css("box-shadow", "0px 10px 20px" + "#" + s + n);

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

    };
    playseq();
    
    // BA --------------------------------------------------------------------------
    // BC --------------------------------------------------------------------------
    pp.addEventListener('click', makeWallpaper);
    pp.addEventListener('click', makeWallpaperModal);
    gw.addEventListener('click', getWallpaper);
    $("canvas").remove();
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
}
