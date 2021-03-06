/**
 * @Checkmatelaw Version 0.0.1
 * (c) 2015-2016 Checkmate Solutions.
 *
 * @Author: Kyle Newcombe
 * @description:

 * Controller will be called when the Report menu is loaded
 * This controller handles all variables that are needed, with
 * functions that are needed for the functions that are used.
 *
 */

//Controler for when creating a new report.
angular.module('app').controller('ReportNewController', function ($scope, dataContext, JsonTemplateService, $localStorage, $location, $interval, $rootScope) {
	$scope.templates = dataContext.templates.getAll();
	$scope.currentPath = $location.path();
	$scope.contentLoaded = false;
	$scope.loadDropdown = true;
	$rootScope.isHomepage = false;
	$rootScope.optionsList = false;

	var promise = JsonTemplateService.getList();
	$scope.$storage = $localStorage;
	promise.then(function (data) {
		$scope.pass = data;
		console.log($scope.pass);
	});
	$scope.selectTemplate = function (selection) {
		$scope.selection = selection;
		$scope.tempReport = $scope.selection;
		console.log(selection);
	};
	$scope.next = function (tempReport) {
		if (typeof $localStorage.savedChecklist === 'undefined') {
			$localStorage.savedChecklist = [];
		}

		if(tempReport === undefined){

			window.plugins.toast.showWithOptions(
			{
				message: "No checklist selected",
				duration: "long", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
				position: "bottom",
				addPixelsY: 0  // added a negative value to move it up a bit (default 0)
			})
		}else{
			var date = new Date();
			tempReport.dateStamp = date.getFullYear()+'-'+("0" + (date.getMonth() + 1)).slice(-2)+'-'+("0" + date.getDate()).slice(-2)+"-"+("0" + date.getHours()).slice(-2)+"-"+("0" + date.getMinutes()).slice(-2)+"-"+("0" + date.getSeconds()).slice(-2);
			$localStorage.savedChecklist.unshift(tempReport);
			if ($localStorage.savedChecklist.length >= 1) {
				$scope.$storage.savedIndex = 0;
			} else {
				$scope.$storage.savedIndex = 0;
			}
			console.log($scope.$storage.savedIndex);
			$location.path('/sections');
		}
	};

	$rootScope.isHomepage = false;

	$scope.saveChecklist = function () {
		window.plugins.toast.showWithOptions(
		{
			message: "Checklist saved!",
			duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
			position: "bottom",
			addPixelsY: 0  // added a negative value to move it up a bit (default 0)
		})
		$location.path('/');
	};

})
//Header controller to add functionality in the report menu.
	.controller('ReportHeaderController', function ($rootScope, $scope, $location, $sessionStorage, $localStorage, EmailServices, FingerPrintAuth) {

		$(document).ready(function() {
		    $(".dropdown-toggle").dropdown();
		});
	$rootScope.isResizeDiv = true;
	console.log($rootScope.footerBool);
	$scope.optionList = $rootScope.optionsList;

	$scope.dropdown = function(){
		console.log("Work");
		$('.dropdown-toggle').dropdown();
	}

	$scope.email = function(){

		$localStorage.checklistPdf = $localStorage.savedChecklist[$scope.$storage.savedIndex];

		var options = { dimBackground: true };
		SpinnerPlugin.activityStart("Loading...", options);

		if($rootScope.platform == 'Android'){
			var fingerPromisEmail = FingerPrintAuth.fingerPrintAndroid();
		}else if($rootScope.platform == 'iOS'){
			var fingerPromisEmail = FingerPrintAuth.fingerPrintiOS();
		}
			fingerPromisEmail.then(function(data){
				console.log("Finger print")
				console.log(data);
				if(data == false){
					promptCallback = function(input){
						console.log(input.buttonIndex);
						console.log(input.input1);
						if(input.buttonIndex == 1){
							if(input.input1 == $localStorage.userCode){
								var emailPromis = EmailServices.email($localStorage.checklistPdf.title+"-"+$localStorage.checklistPdf.name+".pdf",
								$localStorage.checklistPdf.title +"_"+$localStorage.checklistPdf.name+".zip",
								$localStorage.checklistPdf.title +"_"+$localStorage.checklistPdf.name+".txt");
								console.log("Prompt call");
								emailPromis.then(function (data){
									SpinnerPlugin.activityStop();
								});
							}else{
								SpinnerPlugin.activityStop();
								window.plugins.toast.showWithOptions(
								{
									message: "Security Code does not match",
									duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
									position: "bottom",
									addPixelsY: 0  // added a negative value to move it up a bit (default 0)
								})
							}
						}else if(input.buttonIndex == 2){
							SpinnerPlugin.activityStop();
							window.plugins.toast.showWithOptions(
							{
								message: "Cancelled",
								duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
								position: "bottom",
								addPixelsY: 0  // added a negative value to move it up a bit (default 0)
							})
						}
					}
					navigator.notification.prompt("Please enter the security code", promptCallback, ["Security"], ["Confirm", "Cancle"]);
				}else{
				var emailPromis = EmailServices.email($localStorage.checklistPdf.title+"-"+$localStorage.checklistPdf.name+".pdf",
				$localStorage.checklistPdf.title +"_"+$localStorage.checklistPdf.name+".zip",
				$localStorage.checklistPdf.title +"_"+$localStorage.checklistPdf.name+".txt");
				//$sessionStorage.userCode = $localStorage.userCode;
				emailPromis.then(function (data){
					SpinnerPlugin.activityStop();
				});
			}
			});

	}

	$scope.backButton = function () {
		$scope.currentPath = $location.path();
		if ($scope.currentPath === '/questions') {
			$location.path('/sections');
			$scope.scrollPos[$scope.currentPath] = 0;
		}
		if ($scope.currentPath === '/addQuestions') {
			$location.path('/questions');
		}
		if($scope.currentPath === '/questionnaireItem'){
			$location.path('/questions');
		}
		if($scope.currentPath === '/report/image'){
			$location.path($sessionStorage.imagePath);
		}
		if($scope.currentPath === '/report/note'){
			$location.path($sessionStorage.notePath);
		}
		if($scope.currentPath === '/referanceList'){
			$location.path('/guidelines');
		}
		if($scope.currentPath === '/referanceListItems'){
			$location.path('/referanceList');
		}
		if($scope.currentPath === '/referanceListAddItems'){
			$location.path('/referanceListItems');
		}
		if($scope.currentPath === '/questionnaire'){
			$location.path('/guidelines');
		}
		if($scope.currentPath === '/report/imageList'){
			$location.path($rootScope.browsPath);
		}
		if($scope.currentPath === '/report/audioList'){
			$location.path($rootScope.browsPath);
		}
		if($scope.currentPath === '/report/videoList'){
			$location.path($rootScope.browsPath);
		}
		if($scope.currentPath === '/temp/image'){
			$location.path('/temp');
		}
		if($scope.currentPath === '/temp/video'){
			$location.path('/temp');
		}
		if($scope.currentPath === '/temp/audio'){
			$location.path('/temp');
		}
		if($scope.currentPath === "/temp/video/select"){
			$location.path("/report/videoList");
		}
		if($scope.currentPath === "/temp/audio/select"){
			$location.path("/report/audioList");
		}
		if($scope.currentPath === "/temp/image/select"){
			$location.path("/report/imageList");
		}
		if($scope.currentPath === "/sections"){
			$location.path("/report/saved/edit");
		}
		if($scope.currentPath === "/report/saved/edit"){
			$location.path("/report/saved");
		}
		if($scope.currentPath === "/settings/about"){
			$location.path("/settings");
		}
		if($scope.currentPath === "/settings/emailList"){
			$location.path("/settings");
		}
		if($scope.currentPath === "/settings/changeCode"){
			$location.path("/settings");
		}
		if($scope.currentPath === "/settings/selectEditChecklist"){
			$location.path("/settings");
		}
		if($scope.currentPath === "/settings/editChecklist/sections"){
			$location.path("/settings/selectEditChecklist");
		}
		if($scope.currentPath === "/settings/editChecklist/questions"){
			$location.path("/settings/editChecklist/sections");
		}
		if($scope.currentPath === "/settings/editChecklist/addQuestions"){
			$location.path("/settings/editChecklist/questions");
		}
		if($scope.currentPath === "/settings/editChecklist/questionnaire"){
			$location.path("/settings/editChecklist/questions");
		}
	};

	$scope.homeButton = function (){
		$location.path('/');
	}

	$scope.sectionButton = function(){
		$location.path('/sections');
	}

})
//Saved reports controller.
	.controller('ReportSavedController', function ($scope, $location, dataContext, FileSystemService, $localStorage, $interval, $rootScope, $sessionStorage, EmailServices, FingerPrintAuth) {

	$scope.$storage = $localStorage;
	console.log($scope.$storage.savedChecklist);
	$rootScope.isHomepage = false;
	$rootScope.isResizeDiv = false;
	$rootScope.footerBool = false;
	$rootScope.optionsList = false;

	$('.loading').show();
	$('.content').hide();

	function gotFS(fileSystem){
		console.log("gotFS called");
		$scope.fileSystem = fileSystem.root.toURL();
		$('.loading').hide();
		$('.content').show();
	}

	function fail(){
		alert("Derp");
	}

	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);

	$scope.emailList = function($index){
		$scope.$storage.savedIndex = $index;
		$localStorage.checklistPdf = $localStorage.savedChecklist[$index];

		var options = { dimBackground: true };
		SpinnerPlugin.activityStart("Loading...", options);

		if($rootScope.platform == 'Android'){
			var fingerPromisEmail = FingerPrintAuth.fingerPrintAndroid();
		}else if($rootScope.platform == 'iOS'){
			var fingerPromisEmail = FingerPrintAuth.fingerPrintiOS();
		}
			fingerPromisEmail.then(function(data){
				console.log("Finger print")
				console.log(data);
				if(data == false){
					promptCallback = function(input){
						console.log(input.buttonIndex);
						console.log(input.input1);
						if(input.buttonIndex == 1){
							if(input.input1 == $localStorage.userCode){
								var emailPromis = EmailServices.email($localStorage.checklistPdf.title+"-"+$localStorage.checklistPdf.name+".pdf",
								$localStorage.checklistPdf.title +"_"+$localStorage.checklistPdf.name+".zip",
								$localStorage.checklistPdf.title +"_"+$localStorage.checklistPdf.name+".txt");
								console.log("Prompt call");
								emailPromis.then(function (data){
									SpinnerPlugin.activityStop();
								});
							}else{
								SpinnerPlugin.activityStop();
								window.plugins.toast.showWithOptions(
								{
									message: "Security Code does not match",
									duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
									position: "bottom",
									addPixelsY: 0  // added a negative value to move it up a bit (default 0)
								})
							}
						}else if(input.buttonIndex == 2){
							SpinnerPlugin.activityStop();
							window.plugins.toast.showWithOptions(
							{
								message: "Cancelled",
								duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
								position: "bottom",
								addPixelsY: 0  // added a negative value to move it up a bit (default 0)
							})
						}
					}
					navigator.notification.prompt("Please enter the security code", promptCallback, ["Security"], ["Confirm", "Cancle"]);
				}else{
				var emailPromis = EmailServices.email($localStorage.checklistPdf.title+"-"+$localStorage.checklistPdf.name+".pdf",
				$localStorage.checklistPdf.title +"_"+$localStorage.checklistPdf.name+".zip",
				$localStorage.checklistPdf.title +"_"+$localStorage.checklistPdf.name+".txt");
				//$sessionStorage.userCode = $localStorage.userCode;
				emailPromis.then(function (data){
					SpinnerPlugin.activityStop();
				});
			}
			});
	}

	$scope.deleteList = function ($index) {
		$('.loading').show();
		$('.content').hide();
		var deleteChecklist = confirm('You sure?');

		if (deleteChecklist) {
			$scope.$storage.savedChecklist.splice($index, 1);
			$location.path('/report/saved');
		}
	};

	$scope.edit = function ($index) {
		$('.loading').show();
		$('.content').hide();
		$scope.$storage.savedIndex = $index;
		$localStorage.checklistName = $localStorage.savedChecklist[$index].title;
		$localStorage.occurranceNumber = $localStorage.savedChecklist[$index].occurranceNumber;
		$location.path('/report/saved/edit');
	};

	$scope.saveEdit = function () {
		$location.path('/sections');
	};

	$scope.switchChecklist = function (template) {
		if (template.name !== $scope.loadedChecklist.name) {
			$scope.currentChecklist = template.questions;
		} else {
			$scope.currentChecklist = $scope.loadedQuestions;
		}
	};
})
//
	.controller('QuestionnaireController', function($scope, $location, $rootScope, ListService, $sessionStorage, $localStorage){

	$scope.currentPath = $location.path;
	$rootScope.isHomepage = false;
	$rootScope.optionsList = false;
	var promise = ListService.getList();
	//    $scope.$storage = $localStorage.savedChecklist;
	promise.then(function (data) {
		$scope.pass = data;
		$scope.quesionAir = data[0];
		$scope.outPut = $scope.quesionAir.sections[0];
	})

	$scope.continue = function(){
		$scope.outPut = $scope.quesionAir.sections[0].yes[1];
	}
	$scope.yes = function(){
		$scope.outPut = $scope.outPut.yes[0];
	}
	$scope.no = function(){
		$scope.outPut = $scope.outPut.no[0];
	}

	$scope.done = function(){
		$location.path('/guidelines');
	}

})

	.controller('GuidelinesController', function($scope, $location, $rootScope, ListService){

	$scope.currentPath = $location.path;
	$rootScope.isHomepage = true;
	$rootScope.optionsList = false;
	var promise = ListService.getList();
	//    $scope.$storage = $localStorage.savedChecklist;
	promise.then(function (data) {
		$scope.pass = data;
		$scope.quesionAir = data;
		$scope.buttonNames = $scope.quesionAir;
	})
	$scope.selected = function(item){
		console.log(item);
		$location.path('/'+item);
	}
})

	.controller('ReferanceListController', function($sessionStorage, $scope, $location, $rootScope, ListService){

	$scope.currentPath = $location.path;
	$rootScope.isHomepage = false;
	$rootScope.optionsList = false;

	var promise = ListService.getList();
	promise.then(function (data){
		$scope.pass = data;
		$scope.referanceList = data[1];
		$scope.outPut = $scope.referanceList.sections;
	})
	$scope.itemSelect = function(id){
		console.log("Called "+id);
		$sessionStorage.itemId = id;
		$location.path('/referanceListItems');
	}
})

	.controller('ReferenceListControllerItems', function($sessionStorage, $scope, $location, $rootScope, ListService){

	$scope.currentPath = $location.path;
	$rootScope.isHomepage = false;
	$rootScope.optionsList = false;

	var promise = ListService.getList();
	promise.then(function (data){
		$scope.pass = data;
		$scope.referanceList = data[1];
		$scope.outPut = $scope.referanceList.sections[$sessionStorage.itemId];
	})
	$scope.itemSelect = function(id){
		console.log("This is the id " + id);
		$sessionStorage.sectionId = id;
		$location.path('/referanceListAddItems');
	}
})

	.controller('ReferenceListControllerAddItems', function($sessionStorage, $scope, $location, $rootScope, ListService){

	$scope.currentPath = $location.path;
	$rootScope.isHomepage = false;
	$rootScope.optionsList = false;

	console.log($sessionStorage.sectionId);

	var promise = ListService.getList();
	promise.then(function (data){
		$scope.pass = data;
		$scope.referanceList = data[1];
		$scope.outPut = $scope.referanceList.sections[$sessionStorage.itemId].items[$sessionStorage.sectionId];
	})
})

	.controller('NoteController', function($localStorage, $sessionStorage, $scope, $location, $rootScope){

	//Need to figure out how to do this, could just add the timestamp at the begining of the note, but im not sure...
	//Unless I make a array and pass it in
	$rootScope.isHomepage = false;
	$rootScope.isResizeDiv = true;
	$rootScope.optionsList = false;

	$scope.inputArray = [];
	$scope.input = "";
	$scope.editInput = "";
	$scope.mainTitle = $localStorage.savedChecklist[$localStorage.savedIndex].title;

	$scope.dateStamp = $localStorage.savedChecklist[$localStorage.savedIndex].dateStamp;

	$scope.output = $rootScope.output.output;
	$scope.testOutput = $rootScope.output;

	$('.loading').show();
	$('.content').hide();

	$scope.init = function () {
		console.log("INIT");
		setTimeout(function () {
			$('.loading').show();
			$('.content').hide();
			setTimeout(function () {
				$('.loading').hide();
				$('.content').show();
			}, 1000);
		}, 100);
	};

	//This is how I will be able to pass in the comments with the time stamp for repeating..
	//When the user submits the comment, I will take the time stamp and note I will pass it into the array, when the user wants to view the items, they will select the button and will be taken to the page that they are able to view it....
	$scope.submitComment = function(){
		if($scope.input == ""){
			window.plugins.toast.showWithOptions(
    	{
      	message: "Field cannot be empty",
      	duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      	position: "bottom",
      	addPixelsY: 0  // added a negative value to move it up a bit (default 0)
    	})
		}else{
			var date = new Date();
			$scope.time = date.getFullYear()+'-'+("0" + (date.getMonth() + 1)).slice(-2)+'-'+("0" + date.getDate()).slice(-2)+"-"+("0" + date.getHours()).slice(-2)+"-"+("0" + date.getMinutes()).slice(-2)+"-"+("0" + date.getSeconds()).slice(-2);

			$scope.inputArray = {key: $scope.time, value: $scope.input};

			$scope.testOutput.inputs[0].notes.push($scope.inputArray);
			$scope.input = "";
			$scope.$apply();
		}
	}

	$scope.done = function(){
		if($scope.input != ""){
			var date = new Date();
			$scope.time = date.getFullYear()+'-'+("0" + (date.getMonth() + 1)).slice(-2)+'-'+("0" + date.getDate()).slice(-2)+"-"+("0" + date.getHours()).slice(-2)+"-"+("0" + date.getMinutes()).slice(-2)+"-"+("0" + date.getSeconds()).slice(-2);

			$scope.inputArray = {key: $scope.time, value: $scope.input};

			$scope.testOutput.inputs[0].notes.push($scope.inputArray);
		}
		console.log($sessionStorage.notePath);
		$location.path($sessionStorage.notePath);
	}

	$scope.editNote = function(index, key){
		console.log(index);
		if($("#editFeild_"+index).val() == ""){
			window.plugins.toast.showWithOptions(
    	{
      	message: "Field cannot be empty",
      	duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      	position: "bottom",
      	addPixelsY: 0  // added a negative value to move it up a bit (default 0)
    	})
		}else{
			var date = new Date();
			$scope.time = date.getFullYear()+'-'+("0" + (date.getMonth() + 1)).slice(-2)+'-'+("0" + date.getDate()).slice(-2)+"-"+("0" + date.getHours()).slice(-2)+"-"+("0" + date.getMinutes()).slice(-2)+"-"+("0" + date.getSeconds()).slice(-2);

			$scope.inputArray = {key: $scope.time, value: $("#editFeild_"+index).val()};
			//console.log($scope.testOutput.inputs[0].notes[index]);
			$.each($scope.testOutput.inputs[0].notes, function(indexInput, note){
				if(note.key === key){
					$scope.testOutput.inputs[0].notes[indexInput] = $scope.inputArray;
				}
			})
			//$scope.testOutput.inputs[0].notes[index] = $scope.inputArray;
			//console.log($scope.testOutput.inputs[0]);
			$("#editFeild_"+index).val() = "";
			$scope.$apply();
			$("#editNote_"+index).hide();
		}
		// $("#textarea_"+index).val("");
		// $("#editNote_"+index).hide();
	}

	$scope.cancelEdit = function(index){
		$scope.editInput = "";
		$("#editNote_"+index).hide();
	}

	$scope.showEdit = function(index, value){
		$(".editInput").each(function(){
			$(this).hide();
		})
		$("#editNote_"+index).show();
		$("#editFeild_"+index).focus();
		$scope.editInput = value;
		//$("#textarea_"+index).val(value);
	}
});
