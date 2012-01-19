Introduction to the WISE Virtual Learning Environment Project Theme Architecture

Each WISE project theme is made up of a "vle_body.html" file, a "config.json" file, and
folders for custom css, images, and javascript.

-----------------------------------------------------------------------------------

How to use:

**** Theme HTML (vle_body.html) ****

The "vle_body.html" file provides the HTML specific to this theme. It will be inserted
into the WISE core 'vle.html' file when a project loads.

Edit "vle_body.html", the theme's CSS, and the images in the 'images' folder to
customize the WISE VLE styling and user interface to your liking.

Required and suggested elements in "vle_body.html" are marked as such. These elements are
necessary for core WISE features to function properly. Make sure to include these elements
somewhere in the "vle_body.html" file, but feel free to move them around and style them to
your liking unless otherwise noted.

(Note: Any required CSS and/or Javascript files for this theme should be specified in the
"config.json" file - see below).


**** Theme configuration (config.json) ****

The "config.json" file in this theme's root directory is responsible for setting the
theme's identifying information and configuration options.

To utilize any CSS or Javascript files for your theme, you must specify their file paths
in the "config.json" file (see items 10 and 11 below) and include the corresponding files in
the theme package.

*NOTE*: WISE includes the jQuery (http://jquery.com) and jQuery UI (http://jqueryui.com)
Javascript libraries by default.  You do not need to include these files with your theme.
WISE also provides a default theme for jQuery UI. If you would like to use a customized 
jQuery UI theme instead of the WISE default, indicate the file path to your custom CSS file
in the configuration options (see item 12 below).  (You can also make minor modifications
to any jQuery UI styles using any of the CSS files included with this theme.)

(For help creating your own jQuery UI themes, visit the jQuery UI ThemeRoller:
http://jqueryui.com/themeroller/).

If you are including a screenshot and/or thumbnail image for this theme, be sure to add the
corresponding image files to the theme package as well.

The following fields should be included in the JSON object.  Modify each field to match
your theme.

Configuration options:
1. "id" - A unique identifier for this theme; MUST be the same as this theme's root folder
	name (String)
2. "name" -  A text identifier for the theme; will be displayed when selecting the
	theme in project authoring and/or run settings (String)
3. "description" - A short text description of the theme's major features (String)
4. "version" - Version number for this iteration of the theme (String)
5. "author" - Name of the theme's author (String)
6. "date" - Date and time the theme was created/updated (String)
7. "screenshot" - Preview screenshot of theme (File path relative to theme root)
8. "thumb" - Preview thumbnail image of theme (File path relative to theme root),
9. "logo" - VLE logo for this theme; usually displayed in HTML for the VLE - see
	"vle_logo" DOM element in "vle_body.html" (File path relative to theme root)
10. "css" - CSS files required by theme (Array of file paths relative to theme root)
11. "js" - Javascript files required by theme; Optional (Array of file paths relative to theme root)
12. "jqueryui_css" - CSS file for customized jQuery UI theme; Optional, as WISE provides a
	default jQuery UI theme; leave value as empty string ("") to use the default theme (File
	path relative to theme root)
13. "nav_modes" - The project navigation modes this theme supports; First entry in the array
	will be set as the default; Each entry MUST match the name of a folder in the
	"navigation" directory; You must include at least one navigation mode with your theme;
	See "Project Navigation" section below for more details	(Array of Strings)


**** Project Navigation ****


**** Internationalization ****

