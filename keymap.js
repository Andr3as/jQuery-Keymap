/**
 *  @author Andr3as <andranode@gmail.com>
 *  @license https://github.com/Andr3as/jQuery-Keymap/blob/master/LICENSE.md MIT
 *  @version 2.0.0
 *  @date 15/08/2015
 */

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
    
    var keyMap = {
        css: {
            key: {}
        },
        selector: ""
    };
    
    /**
     *  @name $().keymap
     *  @this {HTML div} - Div element to create keymap in
     *  @param {Object{}} [options] - All options as an object
     *  @param {(Object{}|string)} [options.layout=qwerty] - Either parsed json data of the layout or name of layout
     *  @param {Object{}} [options.css] - Style you want to apply with js to the keys
     *  @param {Object{}} [options.css.key] - CSS styles for the keys
     *  @param {string} [options.css.key.color] - Text color of keys
     *  @param {string} [options.css.key.background] - Background color of keys
     *  @param {string} [options.css.key.class] - Aditional classes you want to add to the keys
     */
    $.fn.keymap = function(options) {
        options = options || {};
        var _this = this;
        
        var create, error, parse, style, createElement;
        
        create = function() {
            options.layout = options.layout || "qwerty";
            if (typeof(options.layout) == 'object') {
                parse();
            } else if (typeof(options.layout) == 'string') {
                $.getJSON(curpath+"layouts/"+options.layout+".json", function(json){
                    options.layout = json;
                    parse();
                }).fail(function(e){
                    error('Failed to load layout! Check <a href="https://github.com/Andr3as/jQuery-Keymap/wiki/Troubleshooting">error #1</a> for more details.');
                });
            } else {
                error("Unknown layout type");
            }
        };
        
        error = function(message){
            $(_this).html('<p class="keymap-error">' + message +'</p>');
        };

        createElement = function(value) {
            p = document.createElement("p");
            if (typeof(value) == 'string') {
                $(p).text(value);
            } else if (typeof(value) == 'object') {
                if (typeof(value.name) != 'undefined') {
                    $(p).text(value.name);
                }
                if (typeof(value.class) != 'undefined') {
                    $(p).addClass(value.class);
                }
            }
            return p;
        };
        
        parse = function(){
            //Delete old content
            $(_this).html("");

            layout = options.layout;

            $(_this).addClass("keymap");
            
            var keyWidth = _this.width() / options.layout.line;
            var keys = options.layout.keys;
            var key, width, height, offset, span, p, value, div;
            for (var i = 0; i < keys.length; i++) {
                div = document.createElement("div");
                $(div).addClass("keymap-line");

                for (var j = 0; j < keys[i].length; j++) {
                    key = keys[i][j];
                    span = document.createElement("span");
                    
                    //Width
                    width = ((keyWidth * (key.width || 1)) - 2) + "px";
                    $(span).width(width);
                    //Height
                    height = ((keyWidth * key.height) || (keyWidth - 2)) + "px";
                    $(span).height(height);

                    //Offset
                    offset = ((keyWidth * key.offset) || 1 ) + "px";
                    $(span).css('margin-left', offset);
                    
                    //Value        
                    value = (key.value || key.name);
                    $(span).attr('data-value', value);

                    //Other
                    if ($(span).height() > keyWidth) {
                        $(span).attr("data-height", $(span).height() - 2);
                        $(span).height(keyWidth);
                    }

                    if (typeof(key.code) != 'undefined') {
                        //Insert key
                        $(span).addClass("keymap-key");
                        $(span).attr("data-key", key.code);
                    }
                    
                    if (typeof(key.second) != 'undefined') {
                        p = createElement(key.second);
                        $(p).addClass("second");
                        span.appendChild(p);
                        $(span).addClass("hasSecond");
                    }

                    if (typeof(key.name) != 'undefined') {
                        //Insert Text
                        p = createElement(key.name);
                        $(p).addClass("first");
                        span.appendChild(p);
                        $(span).addClass("hasFirst");
                    }
                    
                    if (typeof(key.third) != 'undefined') {
                        p = createElement(key.third);
                        $(p).addClass("third");
                        span.appendChild(p);
                        $(span).addClass("hasThird");
                    }

                    if (typeof(key['z-index']) != 'undefined') {
                        //Add index class
                        $(span).attr("data-index", key['z-index']);
                    }
                    div.appendChild(span);
                }

                _this.append(div);
            }


            //Color keyboard
            style(options.css);
            //Set font size
            $(_this.selector + ' span p').css("font-size", keyWidth / 4 + "px");
            //Special keys
            $(_this.selector+' span[data-height]').each(function(){
                $(this).height($(this).attr("data-height"));
            });
            //Save selector and style
            keyMap.selector = _this.selector;
            keyMap.css      = options.css;
        };
        
        style = function(css) {
            css = css || options.css;
            //Style keyboard
            if (typeof(css) != 'undefined') {
                if (typeof(css.key) != 'undefined') {
                    if (typeof(css.key.color) != 'undefined') {
                        $(_this.selector+' .keymap-key').css("color", css.key.color);
                    } else {
                        $(_this.selector+' .keymap-key').css("color", "");
                    }
                    if (typeof(css.key.background) != 'undefined') {
                        $(_this.selector+' .keymap-key').css("background-color", css.key.background);
                    } else {
                        $(_this.selector+' .keymap-key').css("background-color", "");
                    }
                    if (typeof(css.key.class) != 'undefined') {
                        $(_this.selector+' .keymap-key').addClass(css.key.class);
                    }
                }
            }
        };

        this.keymap.style = style;
        
        if (options.action == 'reset') {
            style();
        } else if (options == 'delete') {
            this.html("");
        } else {
            create();
        }
        return this;
    };
    
    //////////////////////////////////////////////////////////
    //
    //  Create a shortcut
    //
    //  Parameters
    //
    //  selector - (Required) - {String} - Selector of the keymap
    //  keys - (Required) - {Array} - Array of keys for the keybinding
    //          Format: Number - keyCode of the key f.e. [88,89,90] or String - Value of the key given in the layout f.e. ["ctrl","alt","f"]
    //  css - (optional) - {Object} - Attributes to style the active keys
    //                  Either
    //                      class - {String} - Class to add every active key, usable to style the keybinging with a stylesheet
    //                      color - {String}/{Number} - Font color
    //                      background - {String}/{Number} - Background color
    //  special - (optional) - {String} - Special selector, f.e. :last or :first
    //
    //  Result
    //
    //  obj - {Object} - Dom object
    //
    //////////////////////////////////////////////////////////
    
    /**
     * @name $().createShortcut
     * @this {HTML element} - HTML element to control hightlighting by hovering over it
     * @param {string} selector - Selector of the alread created keymap
     * @param {Object[]} keys - Array of keys to be highlighted
     * @param {Object{}} [css] - Style you want apply highlighted keys
     * @param {string} [css.class] - Either a class to apply highlighted keys
     * @param {string} [css.color] - Or a color to apply
     * @param {string} [css.background] - AND background color to apply
     * @param {string} [special] - jQuery selector to select one out of several, f.e. :first, :last
     */
    $.fn.createShortcut = function(selector, keys, css, special) {
        var _this = this;
        var setClass;
        if (typeof(keys) == 'undefined') {
            return false;
        }
        
        selector    = selector || keyMap.selector;
        css         = css || {};
        
        if (typeof(css.class) == 'undefined') {
            setClass = false;
            css.background = css.background || "red";
            css.color = css.color || "black";
        } else {
            setClass = true;
        }
        special = special || "";
        
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
                if (setClass) {
                    $(selector+" .keymap-key").removeClass(css.class);
                }
                $(selector+" .keymap-key").css("color", "");
                $(selector+" .keymap-key").css("background-color", "");
            } else {
                $(selector).keymap.style(keyMap.css);
            }
        };
        var fn = function(){
            reset();
            var values;
            String.prototype.capitalizeFirstLetter = function() {
                return this.charAt(0).toUpperCase() + this.slice(1);
            };

            if ($.isArray(keys)) {
                for (var i = 0; i < keys.length; i++) {
                    if ($.isNumeric(keys[i])) {
                        style(selector+' [data-key='+keys[i]+']'+special);
                    } else {
                        //Check for uppercase, lowercase, First uppercase other lowercase and original value
                        values = [keys[i], keys[i].toLowerCase(), keys[i].toUpperCase(), keys[i].capitalizeFirstLetter()];
                        $.each(values, function(j, item){
                            style(selector+' [data-value='+item+']'+special);
                        });
                    }
                }
            } else if ($.isNumeric(keys)) {
                style(selector+' [data-key='+keys+']'+special);
            } else {
                values = [keys, keys.toLowerCase(), keys.toUpperCase(), , keys.capitalizeFirstLetter()];
                $.each(values, function(i, item){
                    style(selector+' [data-value='+item+']'+special);
                });
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