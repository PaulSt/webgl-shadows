	
function sphere(n){
	var va = vec4(0.0, 0.0, -1.0,1);
	var vb = vec4(0.0, 0.942809, 0.333333, 1);
	var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
	var vd = vec4(0.816497, -0.471405, 0.333333,1);
	var vertices = [];
	tetrahedron(vertices,va,vb,vc,vd,n);
	return vertices;	
}

function tetrahedron(vertices, a, b, c, d, n) {
    divideTriangle(vertices, a, b, c, n);
    divideTriangle(vertices, d, c, b, n);
    divideTriangle(vertices, a, d, b, n);
    divideTriangle(vertices, a, c, d, n);
}

function divideTriangle(vertices, a, b, c, count) {
    if ( count > 0 ) {
                
        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
                
        ab = normalize(ab, true);
        ac = normalize(ac, true);
        bc = normalize(bc, true);
                                
        divideTriangle(vertices, a, ab, ac, count - 1 );
        divideTriangle(vertices, ab, b, bc, count - 1 );
        divideTriangle(vertices, bc, c, ac, count - 1 );
        divideTriangle(vertices, ab, bc, ac, count - 1 );
    }
    else { 
        triangle(vertices, a, b, c );
    }
}

function triangle(vertices, a, b, c) {
     
    vertices.push([a[0],a[1],a[2]]);
    vertices.push([b[0],b[1],b[2]]);      
    vertices.push([c[0],c[1],c[2]]);
	 
}