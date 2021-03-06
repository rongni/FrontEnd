import React from 'react';
import { Icon } from 'semantic-ui-react';
import { boxLogo, kalturaLogo } from 'assets/images';
import './index.css';

export function PlaylistIcon({
  size,
  type, // 0 - Echo360, 1 - YouTube, 2 - file, 4 - Box
  svgSize,
}) {
  const getColor = (type_) => {
    switch (type_) {
      case 0:
        return 'blue';
      case 1:
        return 'red';
      case 4:
        return 'blue';
      default:
        return 'black';
    }
  };
  const getIcon = (type_) => {
    switch (type_) {
      case 0:
        return 'play circle outline';
      case 1:
        return 'youtube';
      case 4:
        return 'box';
      default:
        return 'file video';
    }
  };

  const otherAttributes = {};
  if (type === 0) otherAttributes.flipped = 'horizontally';

  return type === 4 ? (
    <img src={boxLogo} className="ip-pi-box-logo" aria-hidden="true" data-size={svgSize} />
  ) : type === 3 ? (
    <img src={kalturaLogo} className="ip-pi-box-logo" aria-hidden="true" data-size={svgSize} />
  ) : (
    <Icon
      className="mr-2 pt-0"
      size={size}
      color={getColor(type)}
      name={getIcon(type)}
      aria-hidden="true"
      {...otherAttributes}
    />
  );
}
