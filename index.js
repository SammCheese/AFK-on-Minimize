const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');

const statusStore = getModule([ 'isMobileOnline' ], false);
const userSettings = getModule([ 'PreloadedUserSettingsActionCreators' ], false);

const Settings = require('./components/settings');

let prevStatus;
let prevDStatus;
let check = false;


module.exports = class AFKonExit extends Plugin {
  startPlugin() {
    this.cumIntoClient = this.cumIntoClient.bind(this);
    this.throttledCum = _.debounce(this.cumIntoClient, 3000);
    
    document.addEventListener('visibilitychange', this.throttledCum, false);
    powercord.api.settings.registerSettings(this.entityID, {
      label: 'AFK on Exit',
      category: this.entityID,
      render: Settings
    });
  }

  updateStatus(status) {
    userSettings.PreloadedUserSettingsActionCreators.updateAsync("status", s => s.status.value = status, 0);
  }
  
  cumIntoClient() {
    const currentUser = getModule(['getCurrentUser'], false).getCurrentUser().id;
    const restoreStatus = this.settings.get('restoreStatus', true);
    
    if (restoreStatus && document.visibilityState === 'hidden' && check === false) {
      prevDStatus = statusStore.getStatus(currentUser);
      console.log('[AFK-on-exit] Restoring previous Status');
    }
    if (document.visibilityState === 'hidden' && prevStatus !== 'hidden') {
      prevStatus = 'hidden';
      check = true;
      this.updateStatus(this.settings.get('closingStatus', {value: 'idle'}).value)
    } else if (document.visibilityState === 'visible' && prevStatus === 'hidden') {
      prevStatus = 'visible';
      check = false;
      this.updateStatus(restoreStatus ? prevDStatus : this.settings.get('openingStatus', {value: 'online'}).value);
    }
  }
  
  pluginWillUnload() {
    document.removeEventListener('visibilitychange', this.throttledCum, false);
    powercord.api.settings.unregisterSettings(this.entityID);
  }
};
