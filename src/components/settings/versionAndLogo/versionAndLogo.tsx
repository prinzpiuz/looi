import { FaGithub } from 'react-icons/fa';
import { ReactComponent as Logo } from '../../../assets/images/looi.svg';
import packageJson from '../../../../package.json';

const version = packageJson.version;

const logoAndVersionstyle: React.CSSProperties = {
  marginTop: 30,
  paddingTop: 18,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 14,
  fontSize: 14,
  color: '#ffffff',
};

const logoStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 5,
};

const LogoAndVersion = () => {
  return (
    <div style={logoAndVersionstyle}>
      <div style={logoStyle}>
        <Logo style={{ height: 30 }} />
        <span style={{ fontWeight: 600, letterSpacing: '.06em' }}>
          v{version}
        </span>
      </div>
      <a
        href="https://github.com/prinzpiuz/looi"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub size={22} color="#ffffff" />
      </a>
    </div>
  );
};

export default LogoAndVersion;
