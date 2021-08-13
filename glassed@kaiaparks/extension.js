const Clutter = imports.gi.Clutter;
const Meta = imports.gi.Meta;

const ExtensionUtils = imports.misc.extensionUtils;

var GLib = imports.gi.GLib;

let _settings = null;

function set_opacity(windows_surfaces) {
	let opacity_value = _settings.get_int('window-opacity');
	windows_surfaces.forEach(surface => {
		surface.opacity = opacity_value;
	});
}

function get_window_surfaces(meta_window) {
	let window_actor = meta_window.get_compositor_private();
	let childs = window_actor.get_children();
	let surfaces = childs.filter(child => child.constructor.name.indexOf('MetaSurfaceActor') > -1);
	if (surfaces.length > 0) {
		return surfaces;
	}

	return [window_actor];
}

function window_created(meta_display, meta_window){
	let window_surfaces = get_window_surfaces(meta_window);
	GLib.timeout_add(GLib.PRIORITY_DEFAULT, 500, set_opacity(window_surfaces));
}

function enable() {
	_settings = ExtensionUtils.getSettings();
	_on_window_created = global.display.connect('window-created', window_created);
	//_on_window_focused = global.display.connect('window-focus', window_created);
}

function disable() {
	global.display.disconnect(_on_window_created);
	//global.display.disconnect(_on_window_focused);

	_settings.run_dispose();
}

function init() {
	ExtensionUtils.initTranslations();
}
