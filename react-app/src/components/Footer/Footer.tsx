import styles from "./Footer.module.css";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <div className={styles.footerContainer}>
      <img
        className={styles.ATClogo}
        src="https://thespongeclub.com/wp-content/uploads/2022/08/gary-spongebob-guide-featured.jpg"
      ></img>
      <div className={styles.informationContainer}>
        {/* everything in informationContainer is organized by columns */}
        <div className={styles.informationInnerContainer}>
          {/* everything in informationInnerContainer is organized by row */}
          <div className={styles.textDiv}>
            ABOUT US
            <br />
            <a href="https://appalachiantrail.org/">
              {" "}
              Appalachian Trail Conservancy
            </a>
            <br />
            <a href="https://wildeast.appalachiantrail.org/our-work/about-us/contact-us/">
              Contact Us
            </a>
          </div>

          <div className={styles.textDiv}>
            GET INVOLVED
            <br />
            <a href="https://volunteer.appalachiantrail.org/s/volunteer-project-search">
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
          <p>hello</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
