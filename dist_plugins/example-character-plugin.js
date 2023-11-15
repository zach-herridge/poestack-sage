'use strict';

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var echoCommon = require('echo-common');
var outline = require('@heroicons/react/24/outline');

const App = () => {
    const [selectedName, setSelectedName] = react.useState(null);
    const characterList = echoCommon.usePoeCharacterList();
    const selectedCharacter = echoCommon.usePoeCharacter(selectedName);
    echoCommon.POE_CHARACTER_SERVICE.characterList.load('character_list').subscribe();
    return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: jsxRuntime.jsxs("div", { className: "flex h-full w-full pt-2 pl-2 pr-2", children: [jsxRuntime.jsx("div", { className: "flex-shrink-0 flex flex-col gap-2 h-full overflow-y-scroll pr-4", children: characterList?.map((c) => (jsxRuntime.jsxs("div", { onClick: () => {
                            echoCommon.POE_CHARACTER_SERVICE.characters.load(c.name).subscribe();
                            setSelectedName(c.name);
                        }, className: "cursor-pointer bg-input-surface rounded-lg p-2 flex flex-col", children: [jsxRuntime.jsx("div", { className: "font-semibold text-primary-accent", children: c.name }), jsxRuntime.jsxs("div", { children: ["lvl ", c.level, " ", c.class] }), jsxRuntime.jsx("div", { children: c.league })] }, c.id))) }), jsxRuntime.jsxs("div", { className: "flex-1 flex flex-col h-full", children: [jsxRuntime.jsx("div", { className: "font-semibold", children: selectedName }), jsxRuntime.jsx("div", { className: "flex flex-col h-full overflow-y-scroll", children: selectedCharacter &&
                                [
                                    ...selectedCharacter.inventory,
                                    ...selectedCharacter.equipment,
                                    ...selectedCharacter.jewels
                                ].map((item) => jsxRuntime.jsx("div", { children: item.typeLine }, item.id)) })] })] }) }));
};

// noinspection JSUnusedGlobalSymbols
function start() {
    echoCommon.ECHO_ROUTER.registerRoute({
        plugin: 'example-characters',
        path: 'main',
        page: App,
        navItems: [
            {
                location: 'l-sidebar-m',
                icon: outline.UsersIcon
            }
        ]
    });
}
function destroy() { }
function entry () {
    return {
        start: start,
        destroy: destroy
    };
}
// export { App }

module.exports = entry;
