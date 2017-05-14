function loadImages(urls, callback) {
	var images = [];
	var imagesToLoad = urls.length;

	// Called each time an image finished loading. 
	var onImageLoad = function() {
		--imagesToLoad; 
		// If all the images are loaded call the callback.
		if (imagesToLoad == 0) {
			callback(images);
		}
	};

	for (var ii = 0; ii < imagesToLoad; ++ii) {
		var image = loadImage(urls[ii], onImageLoad);
		images.push(image);
	}
}
	
function loadImage(url, callback) {
	var image = new Image();
	image.src = url; //call .onload when finished
	image.onload = callback;
	return image;
}

function initTexture(img,Texture,activeTxt, activeTxtInt, TexUniformLoc){ 
// creates a texture in 'Texture' from 'img'.  Activating 'activeTxt' and linking to 'TexUniformLoc' with 'activeTxtInt'.
	Texture = gl.createTexture();
	gl.activeTexture(activeTxt);
	gl.bindTexture(gl.TEXTURE_2D, Texture);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB,	gl.UNSIGNED_BYTE, img);	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	//gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); // set the texture to repreat for values of (s,t) outside of [0,1] 
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	gl.uniform1i(TexUniformLoc, activeTxtInt); //link texture to sampler
}