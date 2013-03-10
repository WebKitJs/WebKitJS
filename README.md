WebKitJs
========

WebKitJs is a template framework for building web applications. Even though it is 
targeted at WebKit browsers, it works in most other modern browsers as well.
It is an Object Oriented JavaScript framework that uses jQuery for DOM 
abstraction and Closure Compiler (through Plovr) for code minification. Components 
and Widgets are created using HTML templates and use a render/update analogy.

Conventions used are: OOP, MVC, Observer Pattern and JS Pseudo-Classical inheritance


Dependencies
------------
WebKitJs depends on a few things to do it's stuff:
- jQuery - for dom abstraction and fx
- Plovr - for run time and distribution builds
- Closure Compiler - used for code checking and minification (included by Plovr)
- Google Closure - required use is goog.provide, goog.require (included by Plovr)

Skills dependencies
-------------------
- Understanding of OOP, MVC, Observer Pattern
- Familiarity with the jQuery API for widget development
- General understanding of DOM and JS frameworks
- General understanding of typing
- Understanding of Google Closure Compiler

Minification
------------
WebKitJs runs with Closure Compiler in ADVANCED mode, which enables dependency tree 
exclusion of unused classes and methods as well as variable- and function name minification.


Pros
----
- Proven scalability
- Highly effective minification

Cons
----
Some learning curve

