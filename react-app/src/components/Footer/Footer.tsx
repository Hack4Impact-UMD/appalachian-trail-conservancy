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
            ABOUT US
            <br />
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
              GET INVOLVED
            </a>
            <br />
            <a
              href="https://appalachiantrail.org/waystovolunteer"
              target="_blank"
              rel="noopener noreferrer">
              Volunteer
            </a>
          </div>

          <div className={styles.iconsDiv}>
            <FaFacebookF className={styles.whiteIcon} />
            <FaInstagram className={styles.whiteIcon} />
            <FaTiktok className={styles.whiteIcon} />
            <FaXTwitter className={styles.whiteIcon} />
            <FaYoutube className={styles.whiteIcon} />
          </div>
        </div>
        <div className={styles.textDiv}>
          <p className={styles.smallText}>
            These trainings are presented by the Appalachian Trail Conservancy
            for A.T. partners and volunteers.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
