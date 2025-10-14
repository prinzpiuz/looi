import { FaRegCircleXmark } from 'react-icons/fa6';
import { SettingsButtonProps } from '../../utils/types';
import ToolTip from '../commons/ToolTip';

const toolTipPosition: React.CSSProperties = {
  top: 50,
  right: 20,
};

const buttonStyles: React.CSSProperties = {
  fontSize: 25,
  color: '#ffffffff',
  cursor: 'pointer',
  left: '240px',
  bottom: '10px',
  position: 'relative',
};

const CloseSettingsIcon: React.FC<SettingsButtonProps> = ({ openSettingsPanel }) => {
  const toggleSettings = () => openSettingsPanel((prevValue) => !prevValue);
  return (
    <ToolTip message="Close Settings" extraStyles={toolTipPosition}>
      <div onClick={toggleSettings} style={buttonStyles}>
        <FaRegCircleXmark />
      </div>
    </ToolTip>
  );
};

export default CloseSettingsIcon;
