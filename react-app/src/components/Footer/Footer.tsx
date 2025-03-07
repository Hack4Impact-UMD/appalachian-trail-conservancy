import styles from "./Footer.module.css";
import { useState, useEffect } from "react";
import { FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import atcCircularLogo from "../../assets/ATC_Logo_Primary_Knockout_RGB_HiRes.png";

function Footer() {
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  // Update screen width on resize
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className={styles.footerContainer}>
      {screenWidth > 450 ? (
        <div className={styles.content}>
          <div className={styles.column}>
            <div className={styles.topRow}>
              <img className={styles.ATClogo} src={atcCircularLogo} />
              <div className={styles.informationContainer}>
                {/* everything in informationContainer is organized by columns */}
                <div className={styles.informationInnerContainer}>
                  {/* everything in informationInnerContainer is organized by row */}
                  <div className={`${styles.textDiv} ${styles.hoverUnderline}`}>
                    <a
                      href="https://appalachiantrail.org/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <span>About Us</span>
                    </a>
                    <a
                      href="https://wildeast.appalachiantrail.org/our-work/about-us/contact-us/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <span>Contact Us</span>
                    </a>
                  </div>

                  <div className={`${styles.textDiv} ${styles.hoverUnderline}`}>
                    <a
                      href="https://appalachiantrail.org/get-involved/volunteer/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <span>Get Involved</span>
                    </a>
                    <a
                      href="https://appalachiantrail.org/waystovolunteer"
                      target="_blank"
                      rel="noopener noreferrer">
                      <span>Volunteer</span>
                    </a>
                  </div>

                  <div
                    className={`${styles.iconsDiv} ${styles.hoverUnderline}`}>
                    <a
                      href="https://www.facebook.com/ATHike"
                      target="_blank"
                      rel="noopener noreferrer">
                      <span>
                        <FaFacebookF className={styles.whiteIcon} />
                      </span>
                    </a>
                    <a
                      href="https://www.instagram.com/appalachiantrail/"
                      target="_blank"
                      rel="noopener noreferrer">
                      <span>
                        <FaInstagram className={styles.whiteIcon} />
                      </span>
                    </a>
                    <a
                      href="https://www.tiktok.com/@appalachiantrail"
                      target="_blank"
                      rel="noopener noreferrer">
                      <span>
                        <FaTiktok className={styles.whiteIcon} />
                      </span>
                    </a>
                    <a
                      href="https://twitter.com/at_conservancy"
                      target="_blank"
                      rel="noopener noreferrer">
                      <span>
                        <FaXTwitter className={styles.whiteIcon} />
                      </span>
                    </a>
                    <a
                      href="https://www.youtube.com/user/atconservancy"
                      target="_blank"
                      rel="noopener noreferrer">
                      <span>
                        <FaYoutube className={styles.whiteIcon} />
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.statement}>
              These trainings are presented by the Appalachian Trail Conservancy
              for A.T. partners and volunteers.
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <img className={styles.ATClogo} src={atcCircularLogo} />
          <div className={styles.topContainer}>
            <div className={`${styles.textDiv} ${styles.hoverUnderline}`}>
              <a
                href="https://appalachiantrail.org/"
                target="_blank"
                rel="noopener noreferrer">
                <span>About Us</span>
              </a>
              <a
                href="https://wildeast.appalachiantrail.org/our-work/about-us/contact-us/"
                target="_blank"
                rel="noopener noreferrer">
                <span>Contact Us</span>
              </a>
            </div>

            <div className={`${styles.textDiv} ${styles.hoverUnderline}`}>
              <a
                href="https://appalachiantrail.org/get-involved/volunteer/"
                target="_blank"
                rel="noopener noreferrer">
                <span>Get Involved</span>
              </a>
              <a
                href="https://appalachiantrail.org/waystovolunteer"
                target="_blank"
                rel="noopener noreferrer">
                <span>Volunteer</span>
              </a>
            </div>
          </div>

          <div className={`${styles.iconsDiv} ${styles.hoverUnderline}`}>
            <a
              href="https://www.facebook.com/ATHike"
              target="_blank"
              rel="noopener noreferrer">
              <span>
                <FaFacebookF className={styles.whiteIcon} />
              </span>
            </a>
            <a
              href="https://www.instagram.com/appalachiantrail/"
              target="_blank"
              rel="noopener noreferrer">
              <span>
                <FaInstagram className={styles.whiteIcon} />
              </span>
            </a>
            <a
              href="https://www.tiktok.com/@appalachiantrail"
              target="_blank"
              rel="noopener noreferrer">
              <span>
                <FaTiktok className={styles.whiteIcon} />
              </span>
            </a>
            <a
              href="https://twitter.com/at_conservancy"
              target="_blank"
              rel="noopener noreferrer">
              <span>
                <FaXTwitter className={styles.whiteIcon} />
              </span>
            </a>
            <a
              href="https://www.youtube.com/user/atconservancy"
              target="_blank"
              rel="noopener noreferrer">
              <span>
                <FaYoutube className={styles.whiteIcon} />
              </span>
            </a>
          </div>
          <div className={styles.statement}>
            These trainings are presented by the Appalachian Trail Conservancy
            for A.T. partners and volunteers.
          </div>
        </div>
      )}
    </div>
  );
}

export default Footer;
