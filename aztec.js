//WebGL Global Variables
	var gl;
	var canvas;
	// programs
	var progTex;
	var progCol;
	var progFBO;
	//for drawing
	var vertices;
	var theta = 0;
	var spherevertices;
	var originlightSource = vec3(0.0,0.3,0.4);
	var screenwidth = 1000;
	var screenhight = 600;
	// mouse inreraction
	var originX,originY;
	var lightSource = originlightSource;
	var MouseModelMatrix = mat4();
	// FBO
	var offscreenwidth = 1024;
	var offscreenhight = 1024;

function start(){
// setup webGL
	canvas = document.getElementById("glcanvas");
	gl = WebGLUtils.setupWebGL(canvas);
	gl.viewport(0, 0, screenwidth,screenhight);
	gl.clearColor(13/255, 50/255, 120/255, 1.0);

// for mouse interaction
	mouse();

// initialize the shader
	progTex = initShaders( gl, "tex_vertexShader", "tex_fragmentShader");
	progCol = initShaders( gl, "col_vertexShader", "col_fragmentShader");
	progFBO = initShaders( gl, "fbo_vertexShader", "fbo_fragmentShader");

// Get attribute & uniform location
gl.useProgram(progTex);
	progTex.a_vPosition = gl.getAttribLocation(progTex, "vPosition");
	progTex.vBuffer = gl.createBuffer();
	ArrayBuffer_BindPointEnable(progTex.vBuffer, progTex.a_vPosition, 3);

	progTex.a_texCoord = gl.getAttribLocation(progTex, "texCoord");
	progTex.texBuffer = gl.createBuffer();
	ArrayBuffer_BindPointEnable(progTex.texBuffer, progTex.a_texCoord, 2);
	progTex.ul_texture = gl.getUniformLocation(progTex, "texture");
	progTex.ul_depthCubeMap = gl.getUniformLocation(progTex, "depthCubeMap");

	progTex.ul_ModelMatrix = gl.getUniformLocation(progTex,"ModelMatrix");
	progTex.ul_PerspMatrix = gl.getUniformLocation(progTex,"PerspMatrix");
	progTex.ul_LookAtMatrix = gl.getUniformLocation(progTex,"LookAtMatrix");
	progTex.ul_lightSource = gl.getUniformLocation(progTex,"lightSource");
	progTex.ul_scale = gl.getUniformLocation(progTex,"scale");

gl.useProgram(progCol);
	progCol.a_vPosition = gl.getAttribLocation(progTex, "vPosition");
	progCol.vBuffer = gl.createBuffer();
	ArrayBuffer_BindPointEnable(progCol.vBuffer, progCol.a_vPosition, 3);

	progCol.ul_ModelMatrix = gl.getUniformLocation(progCol,"ModelMatrix");
	progCol.ul_PerspMatrix = gl.getUniformLocation(progCol,"PerspMatrix");
	progCol.ul_LookAtMatrix = gl.getUniformLocation(progCol,"LookAtMatrix");
	progCol.ul_lightSource = gl.getUniformLocation(progCol,"lightSource");
	progCol.ul_scale = gl.getUniformLocation(progCol,"scale");
	progCol.ul_FragColor = gl.getUniformLocation(progCol,"FragColor");

gl.useProgram(progFBO);
	progFBO.a_vPosition = gl.getAttribLocation(progFBO, "vPosition");
	progFBO.vBuffer = gl.createBuffer();
	ArrayBuffer_BindPointEnable(progFBO.vBuffer, progFBO.a_vPosition, 3);

	progFBO.ul_ModelMatrix = gl.getUniformLocation(progFBO,"ModelMatrix");
	progFBO.ul_PerspMatrix = gl.getUniformLocation(progFBO,"PerspMatrix");
	progFBO.ul_LookAtMatrix = gl.getUniformLocation(progFBO,"LookAtMatrix");
	progFBO.ul_scale = gl.getUniformLocation(progFBO,"scale");

// prepare vertices and texturecoord of ground, pyramid, sphere,..
	vertices = [   -3.0, 0.0, 1.0, 	//ground vertices
							3.0, 0.0, 1.0,
							-3.0, 0.0, -1.0,
							3.0, 0.0, -1.0,
							0.0, 1.0, 0.0,  // pyramid vertices
							-1.0, 0.0, 1.0,
							1.0, 0.0, 1.0,
							1.0, 0.0, -1.0, 
							-1.0, 0.0, -1.0,
							-1.0, 0.0, 1.0,
							-1.0, -1.0, 0.999, //background vertices
							1.0, -1.0, 0.999,
							-1.0, 1.0, 0.999,
							1.0, 1.0, 0.999 ];
	var texcoord = [0, 0, 	//ground texcoord
					3, 0,
					0, 3,
					3, 3,
					1, 1,   //pyramid texcoord
					0, 0,
					1, 0,
					0, 0,
					1, 0,
					0, 0,
					0, 0, 	//background texcoord
					1, 0,
					0, 1,
					1, 1,];
	// sphere vertices
	spherevertices = sphere(4);  								//returns sphere in array of array form [[],[],...,[]]
	spherevertices = [].concat.apply([], spherevertices); 		//make it into one array
	vertices = vertices.concat(spherevertices); 				// continue vertices array with spherevertices
	// cylinder vertices
	cylindervertices = [
				cylinderVertex(30).topVertices,
				cylinderVertex(30).bottomVertices,
				cylinderVertex(30).sideVertices
				];
	cylindervertices = [].concat.apply([], cylindervertices); 	//make it into one array
	vertices = vertices.concat(cylindervertices); 				// continue vertices array with spherevertices
	vertices = vertices.concat(cubevertices()); 				// continue vertices array with spherevertices

// buffer the vertices and texturecoordinates of ground, pyramid, sphere into respective buffer
gl.useProgram(progTex);
	ArrayBuffer_BindPointEnable(progTex.vBuffer, progTex.a_vPosition, 3);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	ArrayBuffer_BindPointEnable(progTex.texBuffer, progTex.a_texCoord, 2);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(texcoord), gl.STATIC_DRAW);

gl.useProgram(progCol);
	ArrayBuffer_BindPointEnable(progCol.vBuffer, progCol.a_vPosition, 3);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

// prepare FBO for shadowcubemap
gl.useProgram(progFBO);
	//create empty cubemap
	initCubeMap();
	// Allocate a framebuffer object
	gl.framebuffer = gl.createFramebuffer();
	gl.renderbuffer = gl.createRenderbuffer();
	gl.bindRenderbuffer(gl.RENDERBUFFER, gl.renderbuffer);
	gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, offscreenwidth, offscreenhight);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	// buffer vertices ground, pyramid, cylinder into FB
	ArrayBuffer_BindPointEnable(progFBO.vBuffer, progFBO.a_vPosition, 3);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);


// load images for cubemap --> then continue in callback function
	urls = ['img/floor.png',
			'img/pyramid.png',
			'img/background.png'];
	loadImages(urls,callback);
}

function callback(images){
	progTex.images = images;
	gl.useProgram(progTex);
	// init ground texture
	initTexture(progTex.images[0] ,gl.groundtex ,gl.TEXTURE1 ,1 , progTex.ul_texture);
	// init pyramid texture
	initTexture(progTex.images[1] ,gl.pyramidtex ,gl.TEXTURE2 ,2 , progTex.ul_texture);
	// init background tex
	initTexture(progTex.images[2] ,gl.backgroundtex ,gl.TEXTURE3 ,3 , progTex.ul_texture);
	// draw
	drawScene();
}

function drawScene(){
	setTimeout(function() {
		render();
		requestAnimFrame(drawScene);
	}, 100);
	theta+=2;
}


function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	var PerspMatrix = perspective(90,screenwidth/screenhight,0.1,10); 	 // field of view, aspect, near, far
	var LookAtMatrix = lookAt(vec3(0.0,1.0,1.0),vec3(0,0,0),vec3(0,1,0)); 				// place, look at point, rotation

	lightSource = vec3(mult(MouseModelMatrix, vec4(originlightSource, 1.0)));

// draw shadow cube map
	ShadowMap(lightSource);


gl.useProgram(progTex);
// draw background
	gl.uniform3fv(progTex.ul_lightSource,vec3(0.15,1.1,1.05));
  	gl.uniformMatrix4fv(progTex.ul_PerspMatrix,false,flatten(mat4()));
	gl.uniformMatrix4fv(progTex.ul_LookAtMatrix,false,flatten(mat4()));
	gl.uniform1f(progTex.ul_scale, 1);
	gl.uniformMatrix4fv(progTex.ul_ModelMatrix,false,flatten(mat4()));

	gl.drawArrays(gl.TRIANGLE_STRIP, 10, 4);

//prepare matrices for scene
	gl.uniformMatrix4fv(progTex.ul_PerspMatrix,false,flatten(PerspMatrix));
	gl.uniformMatrix4fv(progTex.ul_LookAtMatrix,false,flatten(LookAtMatrix));

	gl.uniform3fv(progTex.ul_lightSource,lightSource);
	// bind shadowCubeMap
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, gl.ShadowCubeMap);
	gl.activeTexture(gl.TEXTURE0);
	gl.uniform1i(progTex.ul_depthCubeMap, 0);

// draw ground
	gl.uniform1f(progTex.ul_scale, 0.7);
	var ModelMatrix = mat4();
		gl.uniformMatrix4fv(progTex.ul_ModelMatrix,false,flatten(ModelMatrix));
	// tex stuff
	gl.activeTexture(gl.TEXTURE1);
	gl.uniform1i(progTex.ul_texture, 1);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

// draw pyramid
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	gl.uniform1f(progTex.ul_scale, 3);
	var ModelMatrix = mult( translate(vec3(0.7,0,-0.2)), rotate(0,vec3(0,1,0)) );
		gl.uniformMatrix4fv(progTex.ul_ModelMatrix,false,flatten(ModelMatrix));
	// tex stuff
	gl.activeTexture(gl.TEXTURE2);
	gl.uniform1i(progTex.ul_texture, 2);

	gl.drawArrays(gl.TRIANGLE_FAN, 4, 6);
	gl.disable(gl.CULL_FACE);

	// tex stuff for the ground activated after second run
	gl.activeTexture(gl.TEXTURE3);
	gl.uniform1i(progTex.ul_texture, 3);

gl.useProgram(progCol);
	gl.uniformMatrix4fv(progCol.ul_PerspMatrix,false,flatten(PerspMatrix));
	gl.uniformMatrix4fv(progCol.ul_LookAtMatrix,false,flatten(LookAtMatrix));
	gl.uniform3fv(progCol.ul_lightSource,lightSource);

// draw cylinder
	gl.uniform1f(progCol.ul_scale, 5);
	var ModelMatrix = mult(translate(-0.5,0.0,0.0),rotate(200,vec3(0,1,0)));
		gl.uniformMatrix4fv(progCol.ul_ModelMatrix,false,flatten(ModelMatrix));

	// Bottom is yellow
 	var FragColor = vec4(255/255,255/255,255/255,1.0);
		gl.uniform4fv(progCol.ul_FragColor,FragColor);
	gl.drawArrays(gl.TRIANGLE_FAN, 14 + spherevertices.length/3+32, 31);

	// Side
	var FragColor = vec4(255/255,207/255,102/255,1.0);
		gl.uniform4fv(progCol.ul_FragColor,FragColor);
	gl.drawArrays(gl.TRIANGLE_STRIP, 14 + spherevertices.length/3+62,62);

	// Top
	var FragColor = vec4(245/255,190/255,50/255,1.0);
		gl.uniform4fv(progCol.ul_FragColor,FragColor);
	gl.drawArrays(gl.TRIANGLE_FAN, 14 + spherevertices.length/3, 31);

// draw cube
	gl.uniform1f(progCol.ul_scale, 10);
	var FragColor = vec4(255/255,0/255,0/255,1.0);
		gl.uniform4fv(progCol.ul_FragColor,FragColor);
	var ModelMatrix = translate(vec3(0.0,0.0,0.7));
		gl.uniformMatrix4fv(progCol.ul_ModelMatrix,false,flatten(ModelMatrix));
	for( var i=0; i < 24; i += 4){

		gl.drawArrays(gl.TRIANGLE_STRIP, 14 + spherevertices.length/3+124+i, 4);
	}

// draw sphere
	gl.enable(gl.CULL_FACE);
	gl.cullFace(gl.BACK);
	gl.uniform1f(progCol.ul_scale, 8);
	var FragColor = vec4(30.0/255.0,0.0,0.0,0.1);
		gl.uniform4fv(progCol.ul_FragColor,FragColor);
	var ModelMatrix = translate(lightSource);
		gl.uniformMatrix4fv(progCol.ul_ModelMatrix,false,flatten(ModelMatrix));

	for( var i=0; i < spherevertices.length/3; i+=3){
		gl.drawArrays(gl.TRIANGLES, i + 14, 3);
	}

	gl.disable(gl.CULL_FACE);
}




function ArrayBuffer_BindPointEnable(Buffer, Attrib, AttribCount){
	gl.bindBuffer(gl.ARRAY_BUFFER, Buffer);
	gl.vertexAttribPointer(Attrib, AttribCount, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(Attrib);
}


/*   gl.texImage2D(gl.TEXTURE_2D,
                0,                 // level
                gl.RGBA,           // internalFormat
                this.width,        // width
                this.height,       // height
                0,                 // border
                gl.RGBA,           // format
                gl.FLOAT,          // type
                null);             // data */
