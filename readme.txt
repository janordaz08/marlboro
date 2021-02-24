Things to update:

1. app.constants.js
2. api/application/config/database.php
3. api/application/config/config.php
4. api/application/config/constants.php

For 1:
	Change BaseUrl to point to wherever the api/ folder is. (Include a trailing slash)

For 2:
	Change database settings, properties are properly documented in that file

For 3
	Change $config['base_url']. This should be the same value as with the BaseUrl in #1.

For 4
	Scroll to the bottom-most part of the file and you should see an entry for the
	'BASE_DATE' constant. Update that to change the starting date for the game.
	Setting it to a future date will prevent the game from starting.