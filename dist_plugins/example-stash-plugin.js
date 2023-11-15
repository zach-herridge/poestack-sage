'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var echoCommon = require('echo-common');
var outline = require('@heroicons/react/24/outline');

const App = () => {
    const league = 'Ancestor';
    const [searchString, setSearchString] = react.useState('');
    const stashes = echoCommon.usePoeStashes(league);
    const stashItems = echoCommon.usePoeStashItems(league)
        .filter((e) => !searchString.length || e.data.typeLine.toLowerCase().includes(searchString.toLowerCase()))
        .sort((a, b) => new Date(b.stash.loadedAtTimestamp).getTime() -
        new Date(a.stash.loadedAtTimestamp).getTime());
    echoCommon.POE_STASH_SERVICE.currentStashes.load(league).subscribe();
    return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs("div", { className: "flex flex-col h-full w-full pt-2 pl-2 pr-2", children: [jsxRuntime.jsx("div", { className: "flex-shrink-0 flex flex-row gap-2 overflow-x-scroll pb-5 pt-2", children: stashes.map((e) => (jsxRuntime.jsx("div", { style: { backgroundColor: `#${e.metadata.colour}` }, className: "flex-shrink-0 cursor-pointer py-2 px-4 shadow-md no-underline rounded-full  text-white text-sm hover:text-white hover:bg-blue-light focus:outline-none active:shadow-none mr-2", onClick: () => echoCommon.POE_STASH_SERVICE.currentStashContents.load(`${e.league}_${e.id}`).subscribe(), children: e.name }, e.id))) }), jsxRuntime.jsx("div", { className: "flex-shrink-0", children: jsxRuntime.jsx("input", { type: "text", placeholder: "Search...", value: searchString, onChange: (e) => setSearchString(e.target.value), className: "w-full px-2 py-0.5 bg-input-surface rounded-lg shadow-md border-0 focus:outline-none focus:ring focus:border-primary-accent" }) }), jsxRuntime.jsx("div", { className: "overflow-y-scroll flex-1 mt-2", children: stashItems.map((e) => (jsxRuntime.jsxs("div", { children: [jsxRuntime.jsxs("div", { children: [jsxRuntime.jsx("span", { style: { color: `#${e.stash.metadata.colour}` }, children: e.stash.name }), ":", ' ', e.data.stackSize, " ", e.data.typeLine] }), e.group ? (jsxRuntime.jsxs("div", { children: ["Group: ", e.group.tag, " ", e.group.shard, " ", e.group.hash] })) : null, e.valuation ? jsxRuntime.jsxs("div", { children: ["Value ", e.valuation?.pvs?.[5], "c"] }) : null, jsxRuntime.jsx("div", { children: e.data.properties?.map((p) => (jsxRuntime.jsxs("li", { children: [p.name, ": ", p.values.join(', ')] }, p.name))) })] }, e.data.id))) })] }) }));
};

// noinspection JSUnusedGlobalSymbols
function start() {
    echoCommon.ECHO_ROUTER.registerRoute({
        plugin: 'example-stash',
        path: 'main',
        page: App,
        navItems: [{ location: 'l-sidebar-m', icon: outline.ArchiveBoxIcon }]
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
