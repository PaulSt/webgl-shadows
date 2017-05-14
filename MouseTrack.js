// Mouse interaction
function mouse(){
	canvas.addEventListener("mousedown", function(event){
		rect = canvas.getBoundingClientRect();
		originX = event.clientX - rect.left;
		originY = event.clientY - rect.top;
		 canvas.addEventListener("mousemove",mouseMoveHandler,false);
		}
	)
	
	canvas.addEventListener("mouseup", function(event) {
        canvas.removeEventListener('mousemove',mouseMoveHandler,false);
    });
	
	function mouseMoveHandler(ev) {
        offsetX = (ev.clientX - originX);
        offsetY = (ev.clientY - originY);
        //console.log(offsetX,offsetY);
        // * Change the vertices positino of the sphere below
		//	since now we only allow the sphere to move on x-z plane,
		//	the 4-by-4 model matrix we applied to move the sphere should look
		//	like [1 0 0 x; 0 1 0 0; 0 0 1 y; 0 0 0 1]
		MouseModelMatrix = mult(translate(vec3(offsetX/(30*screenwidth),0.0,offsetY/(30*screenhight))),MouseModelMatrix);
    }
}