import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} PlayPocket. All rights reserved.</p>
        <p className="footer-tagline">Quick games for quick breaks.</p>
      </div>
    </footer>
  );
};

export default Footer;
