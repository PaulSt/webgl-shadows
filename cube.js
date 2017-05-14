function cubevertices() {

var vertices = [
  
  // Back face
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   
   // Bottom face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  
  // Right face
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
  
   // Left face
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,

  // Top face
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,

  // Front face
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0
 
];

return vertices;

}