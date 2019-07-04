
var hubListener = function(){
   
    var connection = new signalR.HubConnectionBuilder().withUrl(srvModel.hubPath).build();

    connection.onclose(function(){
        eventAggregator.$emit("connection-lost");
        console.error("Connection was closed. Attempting reconnect in 2s");
        setTimeout(connect, 2000);
    });
    connection.on("PaymentReceived", function(amount, cryptoCode, type, GetCryptoPaymentData){
        eventAggregator.$emit("payment-received", amount, cryptoCode, type, GetCryptoPaymentData);
        // BA -----------------------------------------------------------------------------
        var audio = document.querySelector("audio");
        var synth = new Tone.MembraneSynth().toMaster();
        var actx = Tone.context;
        var dest = actx.createMediaStreamDestination();
        var recorder = new MediaRecorder(dest.stream);
        var gw = document.getElementById("getwallpaper");
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
        }
        function playseq() {
            var n = nextslice();
            timeTime = 60;
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
        function makeWallpaper() {
            var payid = GetCryptoPaymentData;
            var cstart = 0;
            var cend = cstart + 6;
            var ht = 60;
            var wt = 60;
            for (let i = 0; i < 64; i++) {
                var w = document.getElementById("wallpaper");
                var canvas = document.createElement("canvas");
                var color = payid.slice(cstart, cend);
                var ctx = canvas.getContext("2d");
                canvas.addEventListener('mouseover', playcolor);
                // canvas.addEventListener('mouseleave', stopSynth);
                //$(".center").css("background-color", "#" + color);
                canvas.id = color;
                canvas.width = wt;
                canvas.height = ht;
                //ctx.fillText("#" + f, 5, 50);
                ctx.fillStyle = "#" + color;
                //ctx.font = "bold 15px Arial";
                ctx.fillRect(0, 0, wt, ht);
                canvas.innerHTML = color;
                w.appendChild(canvas);
                cstart++;
                cend++;
                if (cstart === 64) {
                    console.log("from if");
                }

                console.log("from wallPaper");
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
            console.log(count);
        }

        // BC --------------------------------------------------------------------------
    });
    connection.on("InvoiceCreated", function(invoiceId){
        eventAggregator.$emit("invoice-created", invoiceId);
    });
    connection.on("InvoiceError", function(error){
        eventAggregator.$emit("invoice-error", error);
    });
    connection.on("InfoUpdated", function(model){
        eventAggregator.$emit("info-updated", model);
    });
    
    function connect(){

        eventAggregator.$emit("connection-pending");
        connection
            .start()
            .then(function(){
                connection.invoke("ListenToCrowdfundApp", srvModel.appId);
                
            })
            .catch(function (err) {
                eventAggregator.$emit("connection-failed");
                console.error("Could not connect to backend. Retrying in 2s", err );
                setTimeout(connect, 2000);
            });
    }


    eventAggregator.$on("contribute", function(model){
        connection.invoke("CreateInvoice", model);
    });
    
    
    return {
        connect: connect
    };
}();

