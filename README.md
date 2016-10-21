# NanoCanvas, portable JavaScript vector graphics engine.

![](images/screenshot.png)
![](images/screenshot-win.jpg)
![](images/screenshot-linux.png)

NanoCanvas is a portable vector graphics engine using JavaScript binding of NanoVG.
NanoCanvas is build on top of Duktape, NanoVG and OpenGL2(or GLESv2).

## Platform

* Mac OS X
* Linux
* Windows
* iOS/Android(TODO)

## Requirements

* OpenGL2
  * GLESv2
* premake5

## Build

### Linux and MacOSX

    $ premake5 gmake
    $ cd build
    $ make

### Windows

Visual Studio 2015 is required to build an example.

    > premake5.exe vs2015
    > cd build

Open solution file and build it with Visual Studio 2015.

Visual Studio 2013 may work. To compile with Visual Studio 2013 use the following premake flag.

    > premake5.exe vs2013

## Example

See `example/main.cc` and `example/input.js`.

### NanoVG demo

    $ cd build
    $ ./example

### Game demo

    $ cd build
    $ ./example ../game/game.js

## License

NanoCanvas example code is licensed under MIT license.
NanoCanvas uses third party libraries. See `LICENSES` file for more details.

### Game example

Game assets are by Hyptosis. Licensed under CC-BY 3.0.
http://opengameart.org/content/lots-of-free-2d-tiles-and-sprites-by-hyptosis

## TODO

* [ ] More HTML5 compatible APIs.
* [ ] Expressive error handling.
* [ ] Expressive error report of parsing JavaScript code.
* [ ] Refactor source code.
* [ ] Text paragraph
* [x] Mouse interaction

