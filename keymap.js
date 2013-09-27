/*
 * Copyright (c) Andr3as
 * as-is and without warranty under the MIT License.
 * See http://opensource.org/licenses/MIT for more information. 
 * This information must remain intact.
 */
 
var scripts = document.getElementsByTagName('script'),
    path = scripts[scripts.length-1].src.split('?')[0],
    curpath = path.split('/').slice(0, -1).join('/')+'/';

(function ( $ ) {
    keyMap = {
        css: {
            key: {}
        },
        selector: ""
    };
    
    $.fn.keymap = function(opt) {
        if (typeof(opt) == 'undefined') {
            opt = {};
        }
        if (opt.type == "reset") {
            this.styleKeymap(opt.css);
        } else {
            this.createKeymap(opt);
        }
        return this;
    };
    
    $.fn.styleKeymap = function(css) {
        //Style keyboard
        if (typeof(css) != 'undefined') {
            if (typeof(css.key) != 'undefined') {
                if (typeof(css.key.color) != 'undefined') {
                    $(this.selector+' .keymap-key').css("color", css.key.color);
                } else {
                    $(this.selector+' .keymap-key').css("color", "");
                }
                if (typeof(css.key.background) != 'undefined') {
                    $(this.selector+' .keymap-key').css("background-color", css.key.background);
                } else {
                    $(this.selector+' .keymap-key').css("background-color", "");
                }
                if (typeof(css.key.class) != 'undefined') {
                    $(this.selector+' .keymap-key').addClass(css.key.class);
                }
            }
        }
        return this;
    };
    
    $.fn.deleteKeymap = function() {
        this.html("");
        return this;
    };
    
    /*
        opt = {layout: qwerty, css: {key: {background: #123456 || white || rgb(120,120,120), color: ebenso}}}
    */
    
    $.fn.createKeymap = function(opt) {
        var _this = this;
        //Check options
        if (typeof(opt) == 'undefined') {
            opt = {};
        }
        //Load layout
        if (typeof(opt.layout) == 'undefined') {
            opt.layout = "qwerty";
        }
        $.getJSON(curpath+"layouts/"+opt.layout+".json", function(json){
            //Delete old content
            $(_this).html("");
            var keyWidth = _this.width() / json.line;
            var keys = json.keys;
            var key, width, height, offset, span, p, value;
            var div = document.createElement("div");
            $(div).addClass("line");
            for(var i = 0; i < keys.length; i++) {
                key = keys[i];
                span = document.createElement("span");
                if (typeof(key.width) == 'undefined') {
                    $(span).css("width", keyWidth -2+"px");
                } else {
                    $(span).css("width", (keyWidth * key.width)-2+"px");
                }
                if (typeof(key.height) == 'undefined') {
                    $(span).css("height", keyWidth -2+"px");
                } else {
                    $(span).css("height", (keyWidth * key.height)+"px");
                }
                if (typeof(key.offset) == 'undefined') {
                    $(span).css("margin-left", 1+"px");
                } else {
                    $(span).css("margin-left", (keyWidth * key.offset)+"px");
                }
                if (typeof(key.value) == 'undefined') {
                    $(span).attr("data-value", key.name);
                } else {
                    $(span).attr("data-value", key.value);
                }
                
                if ($(span).height() > keyWidth) {
                    $(span).attr("data-height", $(span).height());
                    $(span).attr("data-key", key.code);
                    $(span).height(keyWidth-2);
                    $(span).addClass("keymap-key");
                } else if (key.type == "space") {
                    //Insert space
                } else if (key.type == "break") {
                    //Insert new line
                    span = document.createElement("span");
                    _this.append(div);
                    div = document.createElement("div");
                    $(div).addClass("line");
                } else {
                    //Insert key
                    $(span).addClass("keymap-key");
                    $(span).attr("data-key", key.code);
                }
                
                if (typeof(key.name) != 'undefined') {
                    //Insert Text
                    p = document.createElement("p");
                    $(p).text(key.name);
                    span.appendChild(p);
                }
                
                if (typeof(key['z-index']) != 'undefined') {
                    //Add index class
                    $(span).attr("data-index", key['z-index']);
                }
                div.appendChild(span);
            }
            _this.append(div);
            //Color keyboard
            _this.styleKeymap(opt.css);
            $(_this.selector+' span').css("display", "block");
            $(_this.selector+' .line').css("display", "flex");
            $(_this.selector+' p').attr("align", "center");
            $(_this.selector+' span').css("margin-right", "1px");
            $(_this.selector+' span').css("margin-bottom", "1px");
            $(_this.selector+' span').css("margin-top", "1px");
            //Set font size
            var scale = _this.width() / 1440 * 100;
            _this.css("font-size", scale+"%");
            //Special keys
            $(_this.selector+' span[data-height]').each(function(){
                $(this).css("position", "absolute");
                $(this).css("z-index", 2);
                $(this).height($(this).attr("data-height")-2);
            });
            //Overlay keys
            $(_this.selector+' span[data-index]').each(function(){
                $(this).css("position", "absolute");
                $(this).css("z-index", 3);
            });
            //Save selector and style
            keyMap.selector = this.selector;
            keyMap.css      = opt.css;
        });
        return this;
    };
    
    $.fn.getKeymap = function() {
        return keyMap.selector;
    };
    
    /* selector : Selector of the keymap, keys: Array of key to link together or just one key f.e. [88,89,90],
        css: {background-color or class to add}
        special: Special selector, f.e. :last or :first
        element function called by: element wich to click or hover to show shortcut */
    $.fn.createShortcut = function(selector, keys, css, special) {
        var _this = this;
        var setClass;
        if (typeof(keys) == 'undefined') {
            return false;
        }
        if (typeof(selector) == 'undefined') {
            selector = keyMap.selector;
        }
        if (typeof(css) == 'undefined') {
            css = {};
        }
        
        if (typeof(css.class) == 'undefined') {
            setClass = false;
            if (typeof(css.background) == 'undefined') {
                css.background = "red";
            }
            if (typeof(css.color) == 'undefined') {
                css.color = "black";
            }
        } else {
            setClass = true;
        }
        if (typeof(special) == 'undefined') {
            special = "";
        }
        
        var style = function(sel) {
            if (setClass) {
                $(sel).addClass(css.class);
            } else {
                $(sel).css("background-color", css.background);
                $(sel).css("color", css.color);
            }
        };        
        var reset = function() {
            //Reset Keymap
            if (typeof(keyMap.css) == 'undefined') {
                console.log('undef');
                if (setClass) {
                    $(selector+" .keymap-key").removeClass(css.class);
                }
                $(selector+" .keymap-key").css("color", "");
                $(selector+" .keymap-key").css("background-color", "");
            } else {
                $(selector).styleKeymap(keyMap.css);
            }
        };
        var fn = function(){
            reset();
            if ($.isArray(keys)) {
                for (var i = 0; i < keys.length; i++) {
                    if ($.isNumeric(keys[i])) {
                        style(selector+' [data-key='+keys[i]+']'+special);
                    } else {
                        style(selector+' [data-value='+keys[i]+']'+special);
                    }
                }
            } else if ($.isNumeric(keys)) {
                style(selector+' [data-key='+keys+']'+special);
            } else {
                style(selector+' [data-value='+keys+']'+special);
            }
        };
        
        this.click(function(){
            if ($('.keymap-clicked').length === 0) {
                fn();
                _this.addClass('keymap-clicked');
            } else {
                reset();
                $('.keymap-clicked').removeClass('keymap-clicked');
            }
        });
        this.hover(fn, function(){
            if ($('.keymap-clicked').length === 0) {
                reset();
            }
        });
        return this;
    };
}( jQuery ));