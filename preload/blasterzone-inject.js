// BlasterZone Auto-Repo Injector
// Runs as a Revenge preload — fires before revenge.min.js executes
// Auto-registers the BlasterZone plugin repo so plugins appear on first launch

(function BlasterZoneInjector() {
  'use strict';

  // The URL where our dist/ folder is served (GitHub Pages)
  var REPO_URL = 'https://NRXD.github.io/blasterzone-plugins/dist/repo.json';
  var STORAGE_KEY = 'plugins/repositories.json';
  var SETTINGS_KEY = 'plugins/settings.json';

  // Default-enable these plugins on first install
  var DEFAULT_ENABLED = [
    'FakeDeafen',
    'FakeMute',
    'GainBoost',
    'DesktopSpoof',
    'SilentTyping',
    'MessageLogger',
    'ClearURLs',
    'ImageZoom',
    'ReadAllButton',
  ];

  var _done = false;

  function inject() {
    if (_done) return;

    // Try to access Revenge's native filesystem module
    // It writes plugin data to Documents/revenge/ on the device
    var NativeFS = null;
    try {
      // Revenge uses NativeModules.RTNFileManager or NativeModules.RevengeFileManager
      var NativeModules = window.__turboModuleProxy || window.TurboModuleRegistry;
      if (NativeModules) {
        NativeFS = NativeModules.get?.('RTNFileManager')
          || NativeModules.get?.('RevengeFileManager')
          || NativeModules.get?.('FileManager');
      }
      // Fallback: direct NativeModules
      if (!NativeFS && window.nativeModuleProxy) {
        NativeFS = window.nativeModuleProxy.RTNFileManager
          || window.nativeModuleProxy.RevengeFileManager;
      }
    } catch (e) {}

    // If we can't access NativeFS yet, we'll hook the storage layer instead
    // when window.bunny becomes available
    if (!NativeFS) {
      hookViaAPI();
      return;
    }

    // Write repo registration directly to Revenge's storage files
    try {
      injectViaFS(NativeFS);
    } catch (e) {
      // FS write failed — fall back to API hook
      hookViaAPI();
    }
  }

  function injectViaFS(fs) {
    var BASE = fs.getDocumentDirectoryPath?.() || '';
    var REPO_PATH = BASE + '/revenge/' + STORAGE_KEY;
    var SETTINGS_PATH = BASE + '/revenge/' + SETTINGS_KEY;

    function readJSON(path, cb) {
      try {
        fs.readFile(path, function(err, data) {
          try { cb(null, JSON.parse(data || '{}')); }
          catch(e) { cb(null, {}); }
        });
      } catch(e) { cb(null, {}); }
    }

    function writeJSON(path, obj) {
      try {
        fs.writeFile(path, JSON.stringify(obj), 'utf8', function(){});
      } catch(e) {}
    }

    // Inject repo registration
    readJSON(REPO_PATH, function(_, repos) {
      if (!repos[REPO_URL]) {
        // Add our repo with version info
        var repoEntry = { '$meta': { name: 'BlasterZone Plugins', description: 'BlasterZone plugin suite' } };
        DEFAULT_ENABLED.forEach(function(id) { repoEntry[id] = { version: '0.0.0' }; });
        repos[REPO_URL] = repoEntry;
        writeJSON(REPO_PATH, repos);
      }
    });

    // Enable default plugins
    readJSON(SETTINGS_PATH, function(_, settings) {
      var changed = false;
      DEFAULT_ENABLED.forEach(function(id) {
        if (!settings[id]) {
          settings[id] = { enabled: true };
          changed = true;
        }
      });
      if (changed) writeJSON(SETTINGS_PATH, settings);
    });

    _done = true;
    console.log('[BZ Injector] Repo registered via FS');
  }

  function hookViaAPI() {
    // Wait for window.bunny to be assigned by revenge.min.js, then inject via the storage API
    var _bunnyVal = window.bunny;

    function onBunny(api) {
      if (_done) return;
      if (!api || !api.api) return;
      _done = true;

      try {
        var storage = api.api?.storage;
        if (!storage) return;

        // Load or create repo storage
        var loadStorage = storage.createStorage || storage.getItem;

        // Use the internal awaitStorage pattern
        // We write directly to the proxied storage objects
        setTimeout(function() {
          try {
            // Access pluginRepositories through the global bunny api object
            // This is the same storage object that plugins/index.ts uses
            var repos = api.api?.storage?.create?.('plugins/repositories.json')
              || {};

            if (repos && !repos[REPO_URL]) {
              var repoEntry = {
                '$meta': { name: 'BlasterZone Plugins', description: 'BlasterZone plugin suite' }
              };
              DEFAULT_ENABLED.forEach(function(id) {
                repoEntry[id] = { version: '0.0.0' };
              });
              repos[REPO_URL] = repoEntry;
            }

            var pluginSettings = api.api?.storage?.create?.('plugins/settings.json') || {};
            DEFAULT_ENABLED.forEach(function(id) {
              if (!pluginSettings[id]) {
                pluginSettings[id] = { enabled: true };
              }
            });

            console.log('[BZ Injector] Repo registered via bunny storage API');
          } catch(e) {
            console.error('[BZ Injector] storage API inject failed:', e.message);
          }
        }, 500);
      } catch(e) {
        console.error('[BZ Injector] bunny hook failed:', e.message);
      }
    }

    try {
      Object.defineProperty(window, 'bunny', {
        configurable: true,
        enumerable: true,
        get: function() { return _bunnyVal; },
        set: function(v) {
          _bunnyVal = v;
          onBunny(v);
        }
      });
      if (_bunnyVal) onBunny(_bunnyVal);
    } catch(e) {}
  }

  // Fire immediately — FS ops are async so this is safe to call early
  inject();

})();
