function cylinderVertex(segments){
	 a=0, b=0, y=0; //The origin
	
	// top of the cylinder
	var topVertices = [];
	
	// bottom of the cylinder
	var bottomVertices = [];
		
	// side of the cylinder
	var sideVertices = [];
	
	theta = (Math.PI/180) * (360/segments);
	
	for (i=0; i<=segments; i++){
		x =  0.5*Math.cos(theta*i); 
		z =  0.5*Math.sin(theta*i);
		
		topVertices.push(x);
		topVertices.push(y+2);
		topVertices.push(z);
		
		sideVertices.push(x);
		sideVertices.push(y);
		sideVertices.push(z);
		sideVertices.push(x);
		sideVertices.push(y+2);
		sideVertices.push(z);
	
		bottomVertices.push(x);
		bottomVertices.push(y);
		bottomVertices.push(z);
	}
	
	
	var cylinder = new Object(); 
	
	cylinder.topVertices = topVertices
	cylinder.bottomVertices = bottomVertices;
	cylinder.sideVertices = sideVertices;
	
	return cylinder;
}