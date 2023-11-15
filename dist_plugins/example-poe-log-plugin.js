'use strict';

var jsxRuntime = require('react/jsx-runtime');
var core = require('@react-rxjs/core');
var echoCommon = require('echo-common');
var rxjs = require('rxjs');
var outline = require('@heroicons/react/24/outline');

const lastZone$ = new rxjs.BehaviorSubject(null);
echoCommon.POE_LOG_SERVICE.logEvents$.pipe(rxjs.filter((e) => e.type == 'ZoneEntranceEvent')).subscribe(lastZone$);
const [useCurrentZone] = core.bind(rxjs.interval(100).pipe(rxjs.combineLatestWith(lastZone$), rxjs.map(([, e]) => (e ? { ...e, timeInZone: Date.now() - e.timestamp } : null))), null);
const App = () => {
    const currentZone = useCurrentZone();
    if (!currentZone) {
        return jsxRuntime.jsx(jsxRuntime.Fragment, { children: "Change zone to start plugin." });
    }
    if (currentZone.location.includes('Hideout')) {
        return jsxRuntime.jsxs(jsxRuntime.Fragment, { children: ["Time wasted in hideout ", currentZone.timeInZone / 1000, " seconds, get back to mapping!"] });
    }
    return jsxRuntime.jsxs(jsxRuntime.Fragment, { children: ["In ", currentZone.location, ", good job!"] });
};

// noinspection JSUnusedGlobalSymbols
function start() {
    echoCommon.ECHO_ROUTER.registerRoute({
        plugin: 'example-log-plugin-stash',
        path: 'main',
        page: App,
        navItems: [{ location: 'l-sidebar-m', icon: outline.DocumentTextIcon }]
    });
}
function destroy() { }
function entry () {
    return {
        start: start,
        destroy: destroy
    };
}

module.exports = entry;
