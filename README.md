# NanoCanvas, portable JavaScript vector graphics engine.

![](images/screenshot.png)

NanoCanvas is a portable vector graphics engine using JavaScript binding of NanoVG.
NanoCanvas is build on top of Duktape, NanoVG and OpenGL2(or GLESv2).

## Platform

* Mac OS X
* Linux(TODO)
* Windows(TODO)
* iOS/Android(TODO)

## Requirements

* OpenGL2
  * GLESv2
* premake4
* glfw3
* glew

## Build

### Linux and MacOSX

    $ premake4 gmake
    $ cd build
    $ make

## Example

See `example/main.cc` and `example/input.js`.

## TODO

* [ ] Expressive error handling.
* [ ] Expressive error report of parsing JavaScript code.
* [ ] Refactor source code.
* [ ] Text paragraph
* [ ] Mouse interaction

