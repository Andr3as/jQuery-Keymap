#Keymap

Create your own keymap to display the keybinings of your software with jQuery.

##Installation/Quickstart

- Download the zip file and unzip it to your server directory.
- Include the file: ``<script src="/js/keymap.js"></script>``
- Call the plugin on the ``div`` you want to place the keymap.
  - ``$('.keymap').keymap();``
- Creating your keybings by calling ``$('.shortcut').createShortcut('.keymap', ["ctrl", "s"], {},":first");``
- For more details: Check the [wiki](https://github.com/Andr3as/jQuery-Keymap/wiki)

##Examples

####[Live preview](http://andrano.de/Plugins/#keymap)

![Example](http://andrano.de/Plugins/img/keymap.jpg "Example")