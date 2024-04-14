import styles from "./Footer.module.css";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import atcCircularLogo from "../../assets/atc-logo-circular-white.png";

function Footer() {
  return (
    <div className={styles.footerContainer}>
      <img className={styles.ATClogo} src={atcCircularLogo}></img>
      <div className={styles.informationContainer}>
        {/* everything in informationContainer is organized by columns */}
        <div className={styles.informationInnerContainer}>
          {/* everything in informationInnerContainer is organized by row */}
          <div className={styles.textDiv}>
            <a
              href="https://appalachiantrail.org/"
              target="_blank"
              rel="noopener noreferrer">
              About Us
            </a>
            <a
              href="https://wildeast.appalachiantrail.org/our-work/about-us/contact-us/"
              target="_blank"
              rel="noopener noreferrer">
              Contact Us
            </a>
          </div>

          <div className={styles.textDiv}>
            <a
              href="https://appalachiantrail.org/get-involved/volunteer/"
              target="_blank"
              rel="noopener noreferrer">
              Get Involved
            </a>
            <a
              href="https://appalachiantrail.org/waystovolunteer"
              target="_blank"
              rel="noopener noreferrer">
              Volunteer
            </a>
          </div>

          <div className={styles.iconsDiv}>
            <a
              href="https://www.facebook.com/ATHike"
              target="_blank"
              rel="noopener noreferrer">
              <FaFacebookF className={styles.whiteIcon} />
            </a>
            <a
              href="https://www.instagram.com/appalachiantrail/"
              target="_blank"
              rel="noopener noreferrer">
              <FaInstagram className={styles.whiteIcon} />
            </a>
            <a
              href="https://www.tiktok.com/@appalachiantrail"
              target="_blank"
              rel="noopener noreferrer">
              <FaTiktok className={styles.whiteIcon} />
            </a>
            <a
              href="https://twitter.com/at_conservancy"
              target="_blank"
              rel="noopener noreferrer">
              <FaXTwitter className={styles.whiteIcon} />
            </a>
            <a
              href="https://www.youtube.com/user/atconservancy"
              target="_blank"
              rel="noopener noreferrer">
              <FaYoutube className={styles.whiteIcon} />
            </a>
          </div>
        </div>
        <div className={styles.statement}>
          These trainings are presented by the Appalachian Trail Conservancy for
          A.T. partners and volunteers.
        </div>
      </div>
    </div>
  );
}

export default Footer;
