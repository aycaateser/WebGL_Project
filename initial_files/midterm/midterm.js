var canvas;
var gl;
var program;

var bufferNum1, bufferNum2, num1Vertices, num2Vertices;
var vPosition;
var transformationMatrix, transformationMatrixLoc;
var color = [1, 0, 0];
var position = [0, 0];
var scale = [1, 1];
var rotation = 0;
var number = [7, 5];
var numberIndices = [
    [], []
];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Make the numbers
    num1Vertices = [
        vec2(-0.35, 0.25), // v0
        vec2(-0.25, 0.25), // v1
        vec2(-0.15, 0.25), // v2
        vec2(-0.05, 0.25), // v3
        vec2(-0.35, 0.15), // v4
        vec2(-0.25, 0.15), // v5
        vec2(-0.15, 0.15), // v6
        vec2(-0.05, 0.15), // v7
        vec2(-0.35, 0.05), // v8
        vec2(-0.25, 0.05), // v9
        vec2(-0.15, 0.05), // v10
        vec2(-0.05, 0.05), // v11
        vec2(-0.35,-0.05), // v12
        vec2(-0.25,-0.05), // v13
        vec2(-0.15,-0.05), // v14
        vec2(-0.05,-0.05), // v15
        vec2(-0.35,-0.15), // v16
        vec2(-0.25,-0.15), // v17
        vec2(-0.15,-0.15), // v18
        vec2(-0.05,-0.15), // v19
        vec2(-0.35,-0.25), // v20
        vec2(-0.25,-0.25), // v21
        vec2(-0.15,-0.25), // v22
        vec2(-0.05,-0.25), // v23
        ];

    num2Vertices = [
        vec2( 0.05, 0.25), // v0
        vec2( 0.15, 0.25), // v1
        vec2( 0.25, 0.25), // v2
        vec2( 0.35, 0.25), // v3
        vec2( 0.05, 0.15), // v4
        vec2( 0.15, 0.15), // v5
        vec2( 0.25, 0.15), // v6
        vec2( 0.35, 0.15), // v7
        vec2( 0.05, 0.05), // v8
        vec2( 0.15, 0.05), // v9
        vec2( 0.25, 0.05), // v10
        vec2( 0.35, 0.05), // v11
        vec2( 0.05,-0.05), // v12
        vec2( 0.15,-0.05), // v13
        vec2( 0.25,-0.05), // v14
        vec2( 0.35,-0.05), // v15
        vec2( 0.05,-0.15), // v16
        vec2( 0.15,-0.15), // v17
        vec2( 0.25,-0.15), // v18
        vec2( 0.35,-0.15), // v19
        vec2( 0.05,-0.25), // v20
        vec2( 0.15,-0.25), // v21
        vec2( 0.25,-0.25), // v22
        vec2( 0.35,-0.25), // v23
        ];
    //TODO: create and load geometry
    digit(number[0], 0);
    digit(number[1], 1);

    var bufferENum1 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferENum1);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(numberIndices[0]), gl.STATIC_DRAW);

    var bufferENum2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferENum2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(numberIndices[1]), gl.STATIC_DRAW);
    // Load the data into the GPU
    bufferNum1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferNum1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(num1Vertices), gl.STATIC_DRAW );

    // Load the data into the GPU
    bufferNum2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferNum2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(num2Vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );

	document.getElementById("inp_number").oninput = function(event) {
        var value = event.srcElement.value;
        
        if (value >= 10){
            
            number[0] = (value /10) - ((value%10)/10);
            number[1] = value%10;
            
           
        }
        else {
            number[1] = value;
            number[0] = 0;
        }
        
        digit(number[0], 0);
        digit(number[1], 1);
        render();
    };
	
    document.getElementById("inp_objX").oninput = function(event) {
        position[0] = event.srcElement.value;
        render();
    };
    document.getElementById("inp_objY").oninput = function(event) {
        position[1] = event.srcElement.value;
        render();
    };
    document.getElementById("inp_obj_scaleX").oninput = function(event) {
        scale[0] = event.srcElement.value;
        render();
    };
    document.getElementById("inp_obj_scaleY").oninput = function(event) {
        scale[1] = event.srcElement.value;
        render();
    };
    document.getElementById("inp_rotation").oninput = function(event) {
        rotation = event.srcElement.value;
        render();
    };
    document.getElementById("redSlider").oninput = function(event) {
        color[0] = event.srcElement.value;
        render();
    };
    document.getElementById("greenSlider").oninput = function(event) {
        color[1] = event.srcElement.value;
        render();
    };
    document.getElementById("blueSlider").oninput = function(event) {
        color[2] = event.srcElement.value;
        render();
    };

    render();

};


function digit(number, key) {
    if (number == 0) {
    
        numberIndices[key] = [3,2,7,6,
            7,6,11,10,
            11,10,15,14,
            15,14,19,18,
            19,18,23,22,
            18,17,22,21,
            17,16,21,20,
            13,12,17,16,
            9,8,13,12,
            5,4,9,8,
            1,0,5,4,
            2,1,6,5

        ];
    }
    if (number == 1) {
 
        numberIndices[key] = [3,2,7,6,
            7,6,11,10,
            11,10,15,14,
            15,14,19,18,
            19,18,23,22

        ];
    }
    if (number == 2) {
 
        numberIndices[key] = [0,1,4,5,
            1,2,5,6,
            2,3,6,7,
            6,7,10,11,
            10,11,14,15,
            9,10,13,14,
            9,8,13,12,
            13,12,17,16,
            17,16,21,20,
            18,17,22,21,
            19,18,23,22

        ];
    }
    if (number == 3) {
 
        numberIndices[key] = [0,1,4,5,
            1,2,5,6,
            2,3,6,7,
            6,7,10,11,
            10,11,14,15,
            9,10,13,14,
            10,11,14,15,
            14,15,18,19,
            18,19,22,23,
            17,18,21,22,
            16,17,20,21

        ];
    }if (number == 4) {
  
        numberIndices[key] = [1,0,5,4,
            5,4,9,8,
            9,8,13,12,
            10,9,14,13,
            11,10,15,14,
            15,14,19,18,
            19,18,23,22,
            22,23,18,19,
            18,19,14,15,
            14,15,10,11,
            10,11,6,7,
            6,7,2,3

        ];
    }if (number == 5) {

        numberIndices[key] = [3,2,7,6,
            2,1,6,5,
            1,0,5,4,
            5,4,9,8,
            9,8,13,12,
            10,9,14,13,
            11,10,15,14,
            15,14,19,18,
            19,18,23,22,
            18,17,22,21,
            17,16,21,20

        ];
    }if (number == 6) {
  
        numberIndices[key] = [1,0,5,4,
            5,4,9,8,
            9,8,13,12,
            10,9,14,13,
            11,10,14,15,
            13,12,17,16,
            17,16,21,20,
            18,17,22,21,
            19,18,23,22,
            15,14,19,18,
            11,10,15,14
        ];
    }if (number == 7) {
 
        numberIndices[key] = [3,2,7,6,
            2,1,6,5,
            1,0,5,4,
            7,6,11,10,
            11,10,15,14,
            15,14,19,18,
            19,18,23,22


        ];
    }if (number == 8) {
       
        numberIndices[key] =[
            3,2,7,6,
            7,6,11,10,
            11,10,15,14,
            10,9,14,13,
            15,14,19,18,
            19,18,23,22,
            18,17,22,21,
            17,16,21,20,
            13,12,17,16,
            9,8,13,12,
            5,4,9,8,
            1,0,5,4,
            2,1,6,5
            ];
    }if (number == 9) {

        numberIndices[key] = [
            3,2,7,6,
            7,6,11,10,
            11,10,15,14,
            10,9,14,13,
            15,14,19,18,
            19,18,23,22,
            22,23,18,19,
            19,18,15,14,
            15,14,11,10,
            10,9,14,13,
            9,8,13,12,
            5,4,9,8,
            1,0,5,4,
            2,1,6,5
            
        ];
    }
}

function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

	colorLoc = gl.getUniformLocation( program, "color" );
	gl.uniform4fv( colorLoc, vec4(color[0], color[1], color[2], 1.0));
	
	
    transformationMatrix = mat4();
    transformationMatrix = mult(transformationMatrix, translate(position[0], position[1], 0));
    transformationMatrix = mult(transformationMatrix, rotate(rotation, 0, 0, 1));
    transformationMatrix = mult(transformationMatrix, scalem(scale[0], scale[1], 0));
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(numberIndices[0]), gl.STATIC_DRAW);
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferNum1 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawElements( gl.TRIANGLE_STRIP, numberIndices[0].length, gl.UNSIGNED_BYTE, 0 );
	
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(numberIndices[1]), gl.STATIC_DRAW);
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferNum2 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawElements( gl.TRIANGLE_STRIP, numberIndices[1].length, gl.UNSIGNED_BYTE, 0 );

    window.requestAnimFrame(render);
}
