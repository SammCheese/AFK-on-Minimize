const { Plugin } = require('powercord/entities');
const { getModule } = require('powercord/webpack');

const status = getModule(['updateRemoteSettings'], false);
const dStatus = getModule(['getStatus'], false);
const currentUser = getModule(['getCurrentUser'], false).getCurrentUser().id;

const Settings = require('./components/settings');

let prevStatus;
let prevDStatus;
let check = false;

function debounce(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this, args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

module.exports = class AFKonExit extends Plugin {
  startPlugin() {
    this.cumIntoClient = this.cumIntoClient.bind(this);
    this.throttledCum = debounce(this.cumIntoClient, 3000);

    document.addEventListener('visibilitychange', this.throttledCum, false);
    powercord.api.settings.registerSettings(this.entityID, {
      label: 'Alternative Block',
      category: this.entityID,
      render: Settings
    });
  }

  cumIntoClient() {
    const restoreStatus = this.settings.get('restoreStatus', true);
    console.log('Something has changed');

    if (restoreStatus && document.visibilityState === 'hidden' && check === false) {
      prevDStatus = dStatus.getStatus(currentUser);
    }
    if (document.visibilityState === 'hidden' && prevStatus !== 'hidden') {
      prevStatus = 'hidden';
      check = true;
      status.updateRemoteSettings({ status: this.settings.get('closingStatus', 'idle').value });
      console.log('Changing status...');
    } else if (document.visibilityState === 'visible' && prevStatus === 'hidden') {
      prevStatus = 'visible';
      check = false;
      status.updateRemoteSettings({ status: `${restoreStatus ? prevDStatus : this.settings.get('openingStatus', 'online').value}` });
      console.log('Changing status...');
    }
  }
  
  pluginWillUnload() {
    document.removeEventListener('visibilitychange', this.throttledCum, false);
    powercord.api.settings.unregisterSettings(Settings);
  }
}
