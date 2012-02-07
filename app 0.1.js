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
		
		//
		
		for(var i = 0; i < servers.posts.length; i++) {
			data[i] = {
				title: servers.posts[i].title, 
				url: servers.posts[i].url,
				excerpt: servers.posts[i].excerpt, 
				hasChild: true};
		}
		
		var table_view = Titanium.UI.createTableView({
			data: data,
			search: Titanium.UI.createSearchBar(),
			filterAttribute: 'title'
		});
		
		table_view.addEventListener('click', function(e){
			var rowdata = e.rowData;
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
