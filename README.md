Dashboard
=========

This is a modular dashboard that can show various information and controls. In particular it contains a module that makes it usable as a login screen for [LightDM] (using the [lightdm-webkit-greeter] engine).

[LightDM]: http://www.freedesktop.org/wiki/Software/LightDM/
[lightdm-webkit-greeter]: https://launchpad.net/lightdm-webkit-greeter

Modules
-------
Currently there are the following modules included:

* **LightDM:** Displays a login form at the bottom of the screen that interacts with [LightDM]
* **XKCD:** Displays the current [XKCD] comic. It uses the mobile version to avoid complicated interactive things and only show still images.
* **MPDModule:** Displays the currently playing song of an [MPD] and allows to toggle pause or skip the current song. Requires a [client175] installation.
* **TimeModule:** Displays the time. Wow, such feature!
* **BSAG:** Display the upcoming departures at the local busstop. Uses data from the [BSAG] and is thus optimized for Bremen.
* **Mensa/GW2:** Shows the current meals at the [Universität Bremen].

[Universität Bremen]: http://www.uni-bremen.de/
[XKCD]: http://www.xkcd.com/
[mpd]: http://www.musicpd.org/
[client175]: code.google.com/p/client175/
[BSAG]: http://bsag.de/

Design
------
The software is divided into two parts:
* The *backend* is written in PHP and collects information from various places, formats them to JSON and makes them available via simple GET requests.
* The *frontend* is written in JavaScript and may either collect its information itself or rely on its backend counterpart to deliver.

This split was necessary because many websites don't allow cross site access or are too complicated to parse in realtime in a browser. These websites may be queried by the backend, cached at the server and delivered to the computationally weaker clients. This way, many clients can use one backend server and reduce the load on the original content websites.

Configuration
-------------
There is a single configuration file, called `config.js`, where you can choose which modules you'd like to use and *have to* specify the application root of your webserver (if you want to use any backend modules). This design principle stems from the origin of the software as LightDM greeter, where it would be called via a `file:///` URL and as such couldn't know where the webserver is located.

For a list of all available configuration directives, see `config.sample.js`.
