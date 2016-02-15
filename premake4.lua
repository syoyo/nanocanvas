
local action = _ACTION or ""

solution "nanocanvas"
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
			 linkoptions { "`pkg-config --libs glfw3`" }
			 links { "GL", "GLU", "m", "GLEW" }
			 defines { "NANOVG_GLEW" }

		configuration { "windows" }
			 links { "glfw3", "gdi32", "winmm", "user32", "GLEW", "glu32","opengl32", "kernel32" }
			 defines { "NANOVG_GLEW", "_CRT_SECURE_NO_WARNINGS" }

		configuration { "macosx" }
         includedirs { "/usr/local/include" }
         libdirs { "/usr/local/lib" }
			links { "glfw3" }
			linkoptions { "-framework OpenGL", "-framework Cocoa", "-framework IOKit", "-framework CoreVideo" }

		configuration "Debug"
			defines { "DEBUG" }
			flags { "Symbols", "ExtraWarnings"}

		configuration "Release"
			defines { "NDEBUG" }
			flags { "Optimize", "ExtraWarnings"}

