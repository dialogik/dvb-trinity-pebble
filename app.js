var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Accel = require('ui/accel');

var station = 'Trinitatisplatz';

// Initialize Accelerator
Accel.init();

// Show splash screen while waiting for data
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 168),
    text: 'Loading...',
    font: 'GOTHIC_28_BOLD',
    color: 'white',
    textOverflow: 'wrap',
    textAlign: 'center',
    backgroundColor: 'black'
});

// Add to splashWindow
splashWindow.add(text);
splashWindow.show();

var parseFeed = function(data) {
    var items = [];
    for (var i in data) {
        // Always upper case the description string
        var direction = data[i][1];
        var route = data[i][0] + " " + direction;
        var minutes = data[i][2] + " min";

        // Add to menu items array
        items.push({
            title: minutes,
            subtitle: route
        });
    }

    // Finally return whole array
    return items;
};

var resultsMenu = null;

var fetchItems = function(station) {
    // Fetch data
    ajax({
            url: 'http://widgets.vvo-online.de/abfahrtsmonitor/Abfahrten.do?ort=Dresden&vz=0&hst=' + station,
            type: 'json'
        },
        function(data) {
//             console.log(JSON.stringify(data));
    
            // Create an array of Menu items
            var menuItems = parseFeed(data);
    
            // Check the items are extracted OK
            for (var i = 0; i < menuItems.length; i++) {
//                 console.log(menuItems[i].title + ' | ' + menuItems[i].subtitle);
            }
            
            // Construct Menu to show to user
            resultsMenu = new UI.Menu({
                sections: [{
                    title: 'Abfahrten',
                    items: menuItems
                }]
            });
            
            // Show the Menu, hide the splash
            resultsMenu.show();
            splashWindow.hide();
        },
        function(error) {
            console.log('Fetch failed: ' + error);
        }
    );   
};

splashWindow.show();
fetchItems(station);

// Update on long click
splashWindow.on('longClick', 'select', function(e) {
    splashWindow.show();
    if(resultsMenu !== null) { resultsMenu.hide(); }
    fetchItems(station);
});

// Update on shake
splashWindow.on('accelTap', function(e) {
    splashWindow.show();
    if(resultsMenu !== null) { resultsMenu.hide(); }
    fetchItems(station);
});