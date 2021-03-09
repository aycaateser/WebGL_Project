# WebGL_Project

1. Modeling: Model the geometry of 2-digit numbers.
2. Interaction: Implement the callback functions of the given controls.
Task 1 – Modeling
 The user must be able to enter numbers from 0 to 99 using the Number textbox.
 Your program will display 2-digit numbers from 0 to 99, centered at the origin. For the digits
between 0-9, you will display a “0” at the beginning (e.g 00, 01, 02, … , 09)
 The initial number to display will be the last two digits of your student ID. (E.g. If your student ID
is 123456789, when the program starts 89 must be written on the screen.)

Hint about modeling digits:
Below (Figure 2), you can find a hint on how to model each digit. Model the geometry of 10 digits,
centered at the origin. You can create a grid of 24 vertices as shown in the figure. You can set the
distance between the vertices to 0.1 in both horizontal and vertical direction. Then determine the necessary polygons to model each digit. Note that each digit will be modeled as centered at the origin.
You have to apply necessary transformations to display 2-digit numbers.

Use the index buffer approach discussed in class (Lecture 8): Send only these 24 vertices to the shader
and send an additional index buffer that includes the indices of the polygons for each digit. Use
gl.drawElemets function for rendering.

Task 2 – Interaction
 Number: Textbox to read 2-digit number between 0 and 99 from the user. Determines the digits
that will be rendered.
 Color: Pass the color obtained from sliders to the fragment shader to determine the color of the
digits.
 Position: Perform 2D translation according to X and Y slider values.
 Scale: Scale the size of the digits according to the slider values.
 Rotation: Rotate the digits in z axis according to the slider values.
 Be careful about the order of transformations. Rotation and scale should be local (about the
center of the digits). They should not change the position.
