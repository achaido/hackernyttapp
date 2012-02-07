// =======================================================================
//
// SETUP URBAN AIRSHIP
//
// =======================================================================

var UrbanAirship = {};

Ti.include('urbanairship.js');
 
UrbanAirship.key='X4lcQZJFTEKMlkOLPX18fg';
UrbanAirship.secret ='36iqho-ySSWuVnCtJgJ_KA';
UrbanAirship.master_secret='yb1fWfQuQ3KA_RHNPvWjvw';
UrbanAirship.baseurl = 'https://go.urbanairship.com';

Ti.Network.registerForPushNotifications({
  types: [
    Ti.Network.NOTIFICATION_TYPE_BADGE,
    Ti.Network.NOTIFICATION_TYPE_ALERT,
    Ti.Network.NOTIFICATION_TYPE_SOUND
  ],
  success:function(e){
    var deviceToken = e.deviceToken;
    Ti.API.info('successfully registered for apple device token with '+e.deviceToken);
    var params = {
      tags: ['version'+Ti.App.getVersion()]
    };
    UrbanAirship.register(params, function(data) {
      Ti.API.debug("registerUrban success: " + JSON.stringify(data));
    }, function(errorregistration) {
      Ti.API.info("Couldn't register for Urban Airship");
    });
  },
  error:function(e) {
    Ti.API.info("push notifications disabled: "+e);
  },
  callback:function(e) {
    var a = Ti.UI.createAlertDialog({
      title:'New Message',
      message:e.data.alert
    });
    a.show();
  }
});



// create a tab group to hold our windows

var tabgroup =  Titanium.UI.createTabGroup();

// create a window 

var window = Titanium.UI.createWindow({
	title: 'Hackernytt',
	backgroundColor: '#fff',
	tabBarHidden: true
});

// add an event handler to fire when the window is opened.

window.addEventListener('open', function() {
	
	// setup the new request object
	var status_request = Ti.Network.createHTTPClient();
	status_request.timeout = 100000;
	
	// the URL for our status data.
	var status_uri = 'http://hackernytt.se/api/get_recent_posts/?format=json';
	
	// Setup the request
	status_request.open("GET", status_uri);
	
	// Handle the successful request
	status_request.onload = function() {
		
		Titanium.API.info("Data loaded");
		
		var data = [];
		
		// evaluate the response
		var servers = eval('('+this.responseText+')');
		

		var table_view = Titanium.UI.createTableView({
			data: data,
			search: Titanium.UI.createSearchBar(),
			filterAttribute: 'title'
		});		
		// Loop through the JSON, and make subsequent reuqests for actual server data.
	
		for(var i = 0; i < servers.posts.length; i++) {
			
//			Titanium.API.info(servers.posts[i].title);
			
			var row = Titanium.UI.createTableViewRow({
				height: 80,
//				title: servers.posts[i].title,
				url: servers.posts[i].url,
				excerpt: servers.posts[i].excerpt, 
				hasChild: true
			});
			
			var title = Titanium.UI.createLabel({
				text: servers.posts[i].title,
				font: {fontSize: 16, fontWeight: 'normal'},
				width: 'auto',
				textAlign: 'left',
				top: 5,
				left: 5,
				height: 'auto'
			});
			
			var excerpt = Titanium.UI.createLabel({
				text: servers.posts[i].excerpt,
				font: {fontSize: 10, fontWeight: 'normal'},
				width: 200,
				textAlign: 'left',
				bottom: 5,
				left: 5,
				height: 10
			});
			
			var author = Titanium.UI.createLabel({
				text: 'Postat av ' + servers.posts[i].author.name,
				font: {fontSize: 10, fontWeight: 'normal'},
				width: 200,
				textAlign: 'left',
				bottom: 15,
				left: 5,
				height: 10
			});
			
			var date = Titanium.UI.createLabel({
				text: servers.posts[i].date,
				font: {fontSize: 10, fontWeight: 'normal'},
				width: 'auto',
				textAlign: 'left',
				bottom: 5,
				right: 5,
				height: 10
			});
			
			row.add(title);
			row.add(excerpt);
			row.add(author);
			row.add(date);
			row.hasChild = true;
			row.className = 'blog_row';
			data.push(row);

		};
		
		table_view.setData(data);
		

		
		table_view.addEventListener('click', function(e){
			var rowdata = e.rowData;
			Titanium.API.info(JSON.stringify(e.rowData));
			var w = Ti.UI.createWindow({
				title: rowdata.title
			});
			w.orientationModes = [
				Titanium.UI.PORTRAIT,
				Titanium.UI.LANDSCAPE_LEFT,
				Titanium.UI.LANDSCAPE_RIGHT
			];
			
						
			var webiview = null;
			webview = Ti.UI.createWebView();
			webview.url = rowdata.excerpt;
			
			w.add(webview);
			window.tab.open(w);
		});
		
		
	
		window.add(table_view);
		
		
	};
	
	status_request.send();
	
	
});



// create a tab which tolds the window.
var tab = Titanium.UI.createTab({
	window: window
});

// add out tab to the tab group
tabgroup.addTab(tab);

tabgroup.open();
