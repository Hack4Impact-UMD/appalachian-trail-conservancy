import { useState, useEffect } from "react";
import styles from "./VolunteerChangeEmailPage.module.css";
import {
  FormControl,
  Button,
  TextField,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  forestGreenButton,
  grayBorderTextField,
  styledRectButton,
} from "../../../src/muiTheme.ts";
import Loading from "../../components/LoadingScreen/Loading.tsx";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider.tsx";
import { getReauthKey } from "../../backend/FirestoreCalls.ts";
import { updateUserEmail } from "../../backend/AuthFunctions.ts";
import { logOut } from "../../backend/AuthFunctions.ts";
import primaryLogo from "../../assets/atc-primary-logo.png";

const VolunteerChangeEmailPage = () => {
  const auth = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [confirmEmail, setConfirmEmail] = useState<string>("");
  const [emailsMatch, setEmailsMatch] = useState<boolean>(true);
  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [invalidEmailMessage, setInvalidEmailMessage] = useState<string>("");
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const changeEmail = async () => {
      // Get reauthkey from URL query parameter
      const reauthkey = searchParams.get("reauthkey");
      if (reauthkey) {
        // query firebase to see if reauthkey is valid
        const prevEmail = auth.user.email ?? "";
        await getReauthKey(prevEmail)
          .then(async (reauthKeyData) => {
            if (reauthKeyData.key === reauthkey) {
              // reauthkey is valid
              setLoading(false);
            } else {
              navigate("/");
            }
          })
          .catch(() => {
            navigate("/");
          });
      } else {
        navigate("/");
      }
    };
    changeEmail();
  }, []);

  // Check if email is valid
  const validateEmail = (email: string) => {
    const pattern = /^[^@]+@[^@]+\.[^@]+$/;
    return pattern.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Check if email is valid
    if (!validateEmail(email)) {
      setInvalidEmailMessage("Invalid email");
      setInvalidEmail(true);
      setEmailsMatch(false);
      return;
    }

    setLoading(true);
    // Replace with your email change function
    const prevEmail = auth.user.email ?? "";
    await updateUserEmail(prevEmail, email)
      .then(async () => {
        await logOut()
          .then(() => {
            navigate("/logout", { state: { fromApp: true } });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((e) => {
        console.error(e);
        setSnackbarMessage("Failed to update email. Try again later.");
      });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.centered}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* logo image */}
            <div className={styles.top}>
              <img src={primaryLogo} className={styles.logo} alt="ATC Logo" />
            </div>

            {/* form input */}
            <h1 className={styles.heading}>
              Change Email
              <br />
              <span className={styles.welcomeSubtext}>
                Update your email address
              </span>
            </h1>

            <form onSubmit={handleSubmit}>
              <FormControl>
                {/* email field */}
                <div>
                  <h3>New Email</h3>
                </div>
                <TextField
                  sx={{
                    ...grayBorderTextField,
                    border: !emailsMatch
                      ? "2px solid var(--hazard-red)"
                      : "2px solid var(--blue-gray)",
                  }}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  error={invalidEmail}
                />

                {/* confirm email field */}
                <div>
                  <h3>Confirm New Email</h3>
                </div>
                <TextField
                  sx={{
                    ...grayBorderTextField,
                    border: !emailsMatch
                      ? "2px solid var(--hazard-red)"
                      : "2px solid var(--blue-gray)",
                  }}
                  value={confirmEmail}
                  onChange={(e) => {
                    setConfirmEmail(e.target.value);
                  }}
                  error={invalidEmail}
                />
                <div>
                  {!emailsMatch && (
                    <FormHelperText sx={{ margin: "0" }} error>
                      {invalidEmailMessage}
                    </FormHelperText>
                  )}
                </div>
              </FormControl>

              {/* submit button */}
              <div>
                <Button
                  type="submit"
                  sx={{ ...styledRectButton, ...forestGreenButton }}
                  variant="contained"
                  disabled={
                    !(
                      email !== "" &&
                      confirmEmail !== "" &&
                      email === confirmEmail
                    ) || loading
                  }
                >
                  {loading ? <Loading color="white" /> : "Update Email"}
                </Button>
              </div>
            </form>

            <Snackbar
              open={snackbar}
              autoHideDuration={6000}
              onClose={() => setSnackbar(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Alert onClose={() => setSnackbar(false)} severity="success">
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </>
        )}
      </div>
    </div>
  );
};

export default VolunteerChangeEmailPage;
