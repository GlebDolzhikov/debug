/*
* Debugger ver 1.0 by Gleb
*
* debug.log method show massage in DOM element
* accept:
* @param {String}
*
* debug.error method show error massage in DOM element with red color
* accept:
* @param {String}
*
* for manual test uncomment string 17
*
* param names showOffLine debug
* */

function Debugger (){
    var manualDebug = false;
    var manualDebug = true;
    this.init = function (){
        var conf = adapi.getConfiguration();
        //conf.param["showOffLine"] = true;
        if (conf.param["showOffLine"]) {
            $(function () {
                var connection;
                $("body").append("<div id='connetction' style='background: red; z-index: 10001;color: white; display: none; position: absolute; top:0; padding: 20px;font-size: 50px';>Connection problem!</div>")
                setInterval(function () {
                    if (!connection) {
                        $("#connetction").show();
                        $("#connect").text("NO");
                    } else {
                        $("#connetction").hide();
                        $("#connect").text("OK");
                    }
                    connection = false;
                }, timeout * 4); //timeout * 4  must be include success request but if connection unstable that excludes flicker

                $(document).bind("ajaxSuccess", connectionOn)
                           .bind("ajaxError", connectionOff );

                function connectionOn(){
                    $("#connect").text("OK");
                    $("#connetction").hide();
                    connection = true;
                }

                function connectionOff(){
                    $("#connect").text("NO");
                    $("#connetction").show();
                    connection = false;
                }
            });
        }

        if (!conf.param["debug"]&&!manualDebug) return;
        this.starttime = new Date().getTime();
        $(function(){
            window.onerror = function(e) {
                debug.error(e);
            };
            $('body').prepend("<div id='debug' style='top:0;background-color: white;color:black;position:absolute; z-index: 10000;font-size:25px;width:1920px'></div>")

            $('#debug')
                .append("<ol id='debug-toolbar' style='border: 1px black solid;	padding: 20px;margin:10px 35px ;'</ol>")
                .append("<ol id='debug-list' style=';padding-left: 60px; list-style-type:decimal; display:block;float: left' type='1' ></ol>");

            $("#debug-toolbar")
                .append("<li style='display: inline;padding: 15px 40px'>Internet connetion: <span id='connect'></span> </li>")
                .append("<li style='display: inline;padding: 15px 40px'>Current IP: <span id='ip'></span> </li>")
                .append("<li style='display: inline;padding: 15px 40px'>Player ID: <span id='playerID'></span> </li>")
                .append("<li style='display: inline;padding: 15px 40px'>Player time:"+ new Date() +"</li>");

            $.ajax({
                url: 'http://widgets01.cms-ds.com/getip.php',
                type: 'GET',
                success: function (response) {
                    if (response) {
                        var data = JSON.parse(response);
                        if (data) {
                            $("#connect").text("OK");
                            $("#ip").text(data.ip);
                            $("#playerID").text("123456789");
                        }
                    }
                },
                error: function (data,errorType) {
                    var error = (errorType == "abort" ? "NO" : errorType);
                    $("#connect").text(error);
                }
            });
        })
    };
    this.log = function (text){
        if (!conf.param["debug"]&&!manualDebug) return;
        $('#debug-list').append("<li>"+text+" milisec from star: "+((new Date).getTime()-this.starttime)+"</li>");
    };
    this.error = function (text){
        if (!conf.param["debug"]&&!manualDebug) return;
        $('#debug-list').append("<li style='color: red'>"+text+" milisec from star: "+((new Date).getTime()-this.starttime)+"</li>");
    };
}

var debug = new Debugger();
debug.init();