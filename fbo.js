function ShadowMap(lightSource){
	gl.useProgram(progFBO);
	gl.bindFramebuffer(gl.FRAMEBUFFER, gl.framebuffer);
	gl.bindRenderbuffer(gl.RENDERBUFFER, gl.renderbuffer);
	gl.viewport(0, 0, offscreenhight,offscreenwidth);
	
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, gl.ShadowCubeMap);
	gl.activeTexture(gl.TEXTURE0);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER, gl.NEAREST);


		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_X, gl.ShadowCubeMap, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.renderbuffer);
		renderfbo(lightSource,0);

		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, gl.ShadowCubeMap, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.renderbuffer);
		renderfbo(lightSource,1);
		
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, gl.ShadowCubeMap, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.renderbuffer);
		renderfbo(lightSource,2);
		
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, gl.ShadowCubeMap, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.renderbuffer);
		renderfbo(lightSource,3);
		
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, gl.ShadowCubeMap, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.renderbuffer);
		renderfbo(lightSource,4);
		
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, gl.ShadowCubeMap, 0);
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, gl.renderbuffer);
		renderfbo(lightSource,5);
	
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	gl.viewport(0, 0, screenwidth,screenhight);
}


function renderfbo(lightSource,side){
	var ENV_CUBE_LOOK_DIR = [
		vec3(1.0, 0.0, 0.0),
		vec3(-1.0, 0.0, 0.0),
		vec3(0.0, 0.0, 1.0),
		vec3(0.0, 0.0, -1.0),
		vec3(0.0, 1.0, 0.0),
		vec3(0.0, -1.0, 0.0)
	];

	var ENV_CUBE_LOOK_UP = [
		vec3(0.0, -1.0, 0.0),
		vec3(0.0, -1.0, 0.0),
		vec3(0.0, -1.0, 0.0),
		vec3(0.0, -1.0, 0.0),
		vec3(0.0, 0.0, -1.0),
		vec3(0.0, 0.0, -1.0)
	];
	var PerspMatrix = perspective(90,1,0.1,5); 
	
	// render
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	LookAtMatrix = lookAt(lightSource, add(lightSource, ENV_CUBE_LOOK_DIR[side]), ENV_CUBE_LOOK_UP[side]);

		gl.uniformMatrix4fv(progFBO.ul_PerspMatrix,false,flatten(PerspMatrix));
		gl.uniformMatrix4fv(progFBO.ul_LookAtMatrix,false,flatten(LookAtMatrix));
		
	// draw ground
		gl.uniform1f(progFBO.ul_scale, 0.7);
		var ModelMatrix = mat4();
			gl.uniformMatrix4fv(progFBO.ul_ModelMatrix,false,flatten(ModelMatrix));	
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		
	// draw pyramid
		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);
		gl.uniform1f(progFBO.ul_scale, 3);
		var ModelMatrix = mult( translate(vec3(0.7,0,-0.2)), rotate(0,vec3(0,1,0)) );
			gl.uniformMatrix4fv(progFBO.ul_ModelMatrix,false,flatten(ModelMatrix));
		gl.drawArrays(gl.TRIANGLE_FAN, 4, 6);
		gl.disable(gl.CULL_FACE);
		
	// draw cylinder
		gl.uniform1f(progFBO.ul_scale, 5);
		var ModelMatrix = translate(-0.5,0.0,0.0);
			gl.uniformMatrix4fv(progFBO.ul_ModelMatrix,false,flatten(ModelMatrix));
		// Top
		gl.drawArrays(gl.TRIANGLE_FAN, 14 + spherevertices.length/3+32, 31);
		// Side
		gl.drawArrays(gl.TRIANGLE_STRIP, 14 + spherevertices.length/3+62,62);
		// bottom 
		gl.drawArrays(gl.TRIANGLE_FAN, 14 + spherevertices.length/3, 31);
		
	// draw cube
	gl.uniform1f(progFBO.ul_scale, 10);
	var ModelMatrix = translate(vec3(0.0,0.0,0.7));
		gl.uniformMatrix4fv(progFBO.ul_ModelMatrix,false,flatten(ModelMatrix));
	for( var i=0; i < 24; i += 4){
		
		gl.drawArrays(gl.TRIANGLE_STRIP, 14 + spherevertices.length/3+124+i, 4);
	}
}

function initCubeMap(){
	//init cubemap
	gl.ShadowCubeMap = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, gl.ShadowCubeMap);
	//gl.activeTexture(gl.TEXTURE0);
	//gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

	gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	//gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
	// gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);


	// DEPTH_COMPONENT16
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X ,0, gl.RGBA, offscreenwidth, offscreenhight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X ,0, gl.RGBA, offscreenwidth, offscreenhight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z ,0, gl.RGBA, offscreenwidth, offscreenhight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z ,0, gl.RGBA, offscreenwidth, offscreenhight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y ,0, gl.RGBA, offscreenwidth, offscreenhight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y ,0, gl.RGBA, offscreenwidth, offscreenhight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	
	//gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER,gl.NEAREST);
	//gl.uniform1i(TexUniformLoc, 0); //link texture to sampler
	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
}
