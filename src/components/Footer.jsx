import "./Footer.css"

const Footer = ({title, leftChild, rightChild}) => {
  return (
      <footer className="Footer">
        <div className="footer_left">{leftChild}</div>
        <div className="footer_center">{title}</div>
        <div className="footer_right">{rightChild}</div>
      </footer>
  );
};

export default Footer;