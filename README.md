Install
-------

To install be sure to have nodejs and compass already installed in your machine.
You'll need yeoman `npm install -g yo`

Run `npm install` and then `bower install`, ensure there's no error in the log.

Run the project
---------------

Run `grunt serve` to start the application and the developer helper to watch the changes on the files; it will automatically detect the changes and refresh the page.

Build the documentation
-----------------------

Run `grunt docs` to generate the documentation based on the comments and start a server to access it on [http://localhost:8000]
If you make a change in the comments and want to see it on the browser, you need to generate the documentation again.

Test the code
-------------

Run `grunt test` to start a karma session and run the jasmine tests
