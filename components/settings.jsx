const { React } = require('powercord/webpack');
const { SelectInput, SwitchItem } = require('powercord/components/settings');

const statusOptions = [
  {
    name: 'Online',
    id: 'online'
  },
  {
    name: 'Idle',
    id: 'idle'
  },
  {
    name: 'Do not Disturb',
    id: 'dnd'
  },
  {
    name: 'Invisible',
    id: 'invisible'
  }
];

module.exports = class Settings extends React.PureComponent {
  render() {
    const { getSetting, updateSetting, toggleSetting } = this.props;
    return (
      <div>
        <div>
          <SwitchItem
            note='Automatically return to your previous status'
            value={getSetting('restoreStatus', true)}
            onChange={() => toggleSetting('restoreStatus')}
            disabled={true}
          >
            Restore Status after opening Discord (Disabled)
          </SwitchItem>
          <SelectInput
            value={getSetting('openingStatus', 'online')}
            onChange={(value) => updateSetting('openingStatus', value)}
            options={statusOptions.map(status => ({
              label: status.name,
              value: status.id
            }))}
            disabled={/*getSetting('restoreStatus', true)*/ false}
          >
            Status to be set when Opening Discord
          </SelectInput>
          <SelectInput
            value={getSetting('closingStatus', 'idle').value}
            onChange={(value) => updateSetting('closingStatus', value)}
            options={statusOptions.map(status => ({
              label: status.name,
              value: status.id
            }))}
            
          >
            Status to be set when closing Discord
          </SelectInput>
        </div>
      </div>
    );
  }
}