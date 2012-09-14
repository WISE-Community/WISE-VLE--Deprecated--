Steps of this type can be any of several subtypes, specified in the "mode" property of the step JSON.
Valid subtypes:
	map - View the Star Map, a graphical navigation interface for the entire WISE project.
	tutorial - Play a prefabricated tutorial mission to learn the basics of the game (recommended in any project containing a "mission" subtype).
	mission - Play a mission, specified by the provided "levelString" value.
	editor - Build and test your own unique mission, starting with the provided "levelString" value.
	adaptiveMission - Automatically selects from a predefined list of missions based on the player's needs (see app/AdaptiveMissions.so.xml).
	adaptiveQuiz - Automatically selects from a predefined list of quizzes based on the player's needs (see app/AdaptiveTopic.so.xml).
	
Epigame steps rely on a set of global campaign options, which should be specified in the first Epigame step of a project.
The easiest way to handle this is to include all your settings in the "map" step for a project using the Star Map theme.
These global options are stored as an object in the "settings" property of the step JSON.
