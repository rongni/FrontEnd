import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { 
  NORMAL_MODE,
  screenModes,
  videoControl
} from '../../../Utils'
import './index.css'

function ScreenModeMenu({
  show=false,
  mode=NORMAL_MODE,
  onClose=null,
  media={},
}) {

  const handleChooseMode = mode => () => {
    videoControl.mode(mode)
    setTimeout(() => onClose(), 200);
  }

  const { isTwoScreen } = media

  return show ? (
    <div className="watch-general-menu">
      <button className="plain-btn watch-menu-close-btn watch-screenmode-menu-close-btn" onClick={onClose}>
        <i className="material-icons">close</i>
      </button>
      <div className="watch-icon-list" two-screen={isTwoScreen ? 'true' : 'false'}>
        {screenModes.map( screenMode => (
          <button 
            key={screenMode.type}
            mode={screenMode.type}
            className="plain-btn watch-icon-listitem"
            aria-label={screenMode.name}
            active={Boolean(mode === screenMode.type).toString()}
            onClick={handleChooseMode(screenMode.type)}
          >
            <div className="watch-icon-listitem-checkmark">
              {
                mode === screenMode.type
                && 
                <i className="material-icons">check</i>
              }
            </div>
            <i className="material-icons watch-icon-icon">{screenMode.icon}</i>
            <div className="watch-icon-name">{screenMode.name}</div>
          </button>
        ))}
      </div>
    </div>
  ) : null
}

export default connectWithRedux(
  ScreenModeMenu,
  ['mode', 'media'],
  []
)