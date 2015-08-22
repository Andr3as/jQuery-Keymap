#Keymap

Create your own keymap to display the keybinings of your software with jQuery.

##Version **2.0.0**

Introducing second and third levels of keyboards to keymap. Allows to display additional information such as {, } or @.

##Installation/Quickstart

- Download the zip file and unzip it.
- Include `keymap.js` and `keymap.css`  
```HTML
<!--
    Include Keymap
-->
<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
<script src="keymap.js"></script>
<link href=keymap.css" rel="stylesheet">
```
- Initiate the plugin
```Javascript
$(document).ready(function(){
    $.getJSON('layouts/qwerty.json', function(json){
        $('.keymap').keymap({"css": {"key": {"background": "white", "color": "black"}}});
        $('.shortcut').createShortcut('.keymap', ["ctrl", "s"], {}, ":first");
    });
});
```
- For more details: Check the [wiki](https://github.com/Andr3as/jQuery-Keymap/wiki)

##Examples

![Example](http://andrano.de/Plugins/img/screenshot.png "Example")
#####[Live preview on Andrano.de](https://andrano.de/Keymap)

##Contribute
You want to contribute a new layout or some fixes create a pull request or send an email to [andranode[at]gmail.com](mailto://andranode@gmail.com)