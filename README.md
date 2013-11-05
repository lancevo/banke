Bản kê
======

Bản kê (ban - kay): a jQuery to enhance table display such as crosshair, fixed header, and transform its layout on mobile view 


Usage:
 -----

 $("#table").banke()


 Other methods:

 turn on sticky header
 $("#table").banke("headeroff");

 turn off sticky header
 $("#table").banke("headeron");


 turn on cross hair
 $("#table").banke("crosshairon");


 turn off cross hair
 $("#table").banke("crosshairoff");


 update throttle time (ms) for sticky header
 $("#table").banke("throttle", 50);

 These options are only available when first instantiate the object

 add classes to clone table
 $("#table").banke("classnames","class1 class2 class3");

 add attributes to clone table
 $("#table").banke("attributes","data-something='abc' data-something-else='def'");



