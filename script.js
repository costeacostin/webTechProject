	// create the module and name it scotchApp
	var scotchApp = angular.module('scotchApp', ['ngRoute']);

	// configure our routes
	scotchApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : 'pages/about.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			});
	});
	// create the controller and inject Angular's $scope
	scotchApp.controller('mainController', ['$scope','$http', function($scope,$http) {
		$scope.message = 'Enter movie';
		$scope.toggle = function() {
			console.log($scope.message);
		console.log("get to : " + 'https://webtechfaza2-costeacostin.c9users.io:8081/imdbMovies/' + $scope.message);
		$http.get('https://webtechfaza2-costeacostin.c9users.io:8081/imdbMovies/' + $scope.message)
        .success(function(response) {
        	console.log(response);
            var myEl = angular.element( document.querySelector( '#movieId' ) );
            var txt = "Title:  "+response.title + " Year: " + response.year +" Rating: " + response.rating + " Genres: " + response.genres + "  " + response.imdburl;
			myEl.text(txt); 
        })
        .error(function(response) {
            console.log('Error: ' + response);
        });
    	
  };
	}]);

	scotchApp.controller('aboutController', ['$scope','$http', function($scope,$http) {
		$scope.message = 'Enter actor';
		$scope.toggle = function() {
		console.log($scope.message);
		console.log("get to : " + 'https://webtechfaza2-costeacostin.c9users.io:8081/actors/' + $scope.message);
		$http.get('https://webtechfaza2-costeacostin.c9users.io:8081/actors/' + $scope.message)
        .success(function(response) {
        	console.log(response);
            var myEl = angular.element( document.querySelector( '#actorId' ) );
            var txt = "Not found, sorry! ";
            if(response.name !== undefined)
            	txt = "Name:  "+response.name + " Birthdate: " + response.birthdate +" Nationality: " + response.nationality;
			myEl.text(txt); 
        })
        .error(function(response) {
            console.log('Error: ' + response);
        });
    	
  };
	}]);
	

	scotchApp.controller('contactController', ['$scope','$http', function($scope,$http) {
		$scope.message = 'Enter suggestion';
		$scope.toggle = function() {
			console.log($scope.message);
		console.log("get to : " + 'https://webtechfaza2-costeacostin.c9users.io:8081/Actors/' + $scope.message);
		$http.get('https://webtechfaza2-costeacostin.c9users.io:8081/Actors/' + $scope.message)
        .success(function(response) {
        	console.log(response);
            var myEl = angular.element( document.querySelector( '#sugestionId' ) );
            var txt = "Title:  "+response.title + " Year: " + response.year +" Rating: " + response.rating + " Genres: " + response.genres + "  " + response.imdburl;
			myEl.text(txt); 
        })
        .error(function(response) {
            console.log('Error: ' + response);
        });
    	
  };
	}]);



