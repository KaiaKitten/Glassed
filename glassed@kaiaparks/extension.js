const Clutter = imports.gi.Clutter;
const Meta = imports.gi.Meta;

const ExtensionUtils = imports.misc.extensionUtils;

var GLib = imports.gi.GLib;

let _settings = null;

function setOpacity(windowSurfaces) {
  let opacityValue = _settings.get_int('window-opacity');
  windowSurfaces.forEach(surface => {
    surface.opacity = opacityValue;
  });
}

function getWindowSurfaces(metaWindow) {
  let windowActor = metaWindow.get_compositor_private();
  let childs = windowActor.get_children();
  let surfaces = childs.filter(child =>
    child.constructor.name.indexOf('MetaSurfaceActor') > -1);
  if (surfaces.length > 0) {
    return surfaces;
  }

  return [windowActor];
}

function onWindowCreated(metaDisplay, metaWindow) {
  let windowSurfaces = getWindowSurfaces(metaWindow);
  GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, setOpacity(windowSurfaces));
}

function enable() {
  _settings = ExtensionUtils.getSettings();
  _onWindowCreated = global.display.connect('window-created', onWindowCreated);

  //_on_window_focused = global.display.connect('window-focus', window_created);
}

function disable() {
  global.display.disconnect(_onWindowCreated);

  //global.display.disconnect(_on_window_focused);

  _settings.run_dispose();
}

function init() {
  ExtensionUtils.initTranslations();
}
