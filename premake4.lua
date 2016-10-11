
local action = _ACTION or ""

solution "nanocanvas"
   projectRootDir = os.getcwd() .. "/example/"
   dofile ("example/findOpenGLGlewGlut.lua")
   initOpenGL()
   initGlew()

	location ( "build" )
	configurations { "Debug", "Release" }
	platforms {"native", "x64", "x32"}
	
   	project "nanocanvas"
		language "C"
		kind "StaticLib"
		includedirs { "src" }
		files { "src/*.c" }
		targetdir("build")
		defines { "_CRT_SECURE_NO_WARNINGS" } 
		
		configuration "Debug"
			defines { "DEBUG" }
			flags { "Symbols", "ExtraWarnings"}

		configuration "Release"
			defines { "NDEBUG" }
			flags { "Optimize", "ExtraWarnings"}

	project "example"

		kind "ConsoleApp"
		language "C++"
		files { "example/main.cc", "example/perf.c" }
		includedirs { "src", "example" }
		targetdir("build")
		links { "nanocanvas" }

		configuration { "linux" }
         files {
            "example/OpenGLWindow/X11OpenGLWindow.cpp",
            "example/OpenGLWindow/X11OpenGLWindows.h"
            }
         links {"X11", "pthread", "dl"}

		configuration { "windows" }
         defines { "NOMINMAX" }
         buildoptions { "/W4" } -- raise compile error level.
         files{
            "example/OpenGLWindow/Win32OpenGLWindow.cpp",
            "example/OpenGLWindow/Win32OpenGLWindow.h",
            "example/OpenGLWindow/Win32Window.cpp",
            "example/OpenGLWindow/Win32Window.h",
            }

		configuration { "macosx" }
			buildoptions { "-fsanitize=address" }
			linkoptions { "-fsanitize=address" }
         links {"Cocoa.framework"}
         files {
                "example/OpenGLWindow/MacOpenGLWindow.h",
                "example/OpenGLWindow/MacOpenGLWindow.mm",
               }

		configuration "Debug"
			defines { "DEBUG" }
			flags { "Symbols", "ExtraWarnings"}

		configuration "Release"
			defines { "NDEBUG" }
			flags { "Optimize", "ExtraWarnings"}

