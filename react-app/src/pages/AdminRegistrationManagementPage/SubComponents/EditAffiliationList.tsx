import { useState, useEffect } from "react";
import styles from "./SubComponent.module.css";
import Loading from "../../../components/LoadingScreen/Loading.tsx";
import {
  Typography,
  OutlinedInput,
  Button,
  IconButton,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  listStyles,
  forestGreenButton,
  styledRectButton,
  grayBorderTextField,
  inputHeaderText,
} from "../../../muiTheme.ts";
import { getAffiliationList } from "../../../backend/FirestoreCalls.ts";
import { updateAffiliationList } from "../../../backend/AdminFirestoreCalls.ts";
import { DateTime } from "luxon";
import { IoCloseOutline } from "react-icons/io5";
import { AffiliationList } from "../../../types/AssetsType.ts";
import DeleteAffiliationPopup from "./DeleteAffiliationPopup/DeleteAffiliationPopup.tsx";

interface EditAffiliationListProps {
  setAffiliationPopupOpen: (open: boolean) => void;
}

function EditAffiliationList({
  setAffiliationPopupOpen,
}: EditAffiliationListProps) {
  const [loading, setLoading] = useState<boolean>(true);

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [affiliationList, setAffiliationList] = useState<string[]>([]);
  const [newAffiliation, setNewAffiliation] = useState<string>("");
  const [dateUpdated, setDateUpdated] = useState<string>("");
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [affiliationToDelete, setAffiliationToDelete] = useState("");

  useEffect(() => {
    getAffiliationList()
      .then((affiliationList) => {
        setAffiliationList(affiliationList.affiliations);
        setDateUpdated(affiliationList.dateUpdated);
        setLoading(false);
      })
      .catch((e) => {
        setSnackbarMessage("Failed retrieve affiliation list");
        setSnackbar(true);
        console.error(e);
      });
  }, []);

  const sortAffiliations = (affiliations: string[]) => {
    const specialOptions = ["Other", "Unaffiliated"];

    return [...affiliations].sort((a, b) => {
      const aSpecial = specialOptions.includes(a);
      const bSpecial = specialOptions.includes(b);

      // Put special options after all regular affiliations
      if (aSpecial && !bSpecial) return 1;
      if (!aSpecial && bSpecial) return -1;

      // Order special options based on their order in the specialOptions array
      if (aSpecial && bSpecial) {
        return specialOptions.indexOf(a) - specialOptions.indexOf(b);
      }

      return a.localeCompare(b);
    });
  };

  const handleAddAffiliation = () => {
    const affiliation = newAffiliation.trim();

    if (!affiliation) {
      setSnackbarMessage("Cannot add empty affiliation");
      setSnackbar(true);
      return;
    }

    if (affiliationList.includes(affiliation)) {
      setSnackbarMessage("Affiliation already exists");
      setSnackbar(true);
      return;
    }

    const updatedAffiliations = sortAffiliations([
      ...affiliationList,
      affiliation,
    ]);

    const updatedList: AffiliationList = {
      type: "AFFILIATIONLIST",
      affiliations: updatedAffiliations,
      dateUpdated: new Date().toISOString(),
    };

    updateAffiliationList(updatedList)
      .then(() => {
        setAffiliationList(updatedList.affiliations);
        setDateUpdated(updatedList.dateUpdated);
        setNewAffiliation("");
        setSnackbarMessage("Affiliation added successfully");
      })
      .catch((e) => {
        console.error(e);
        setSnackbarMessage("Failed to add affiliation");
      })
      .finally(() => {
        setSnackbar(true);
      });
  };

  const handleDeleteAffiliation = async () => {
    const updatedList: AffiliationList = {
      type: "AFFILIATIONLIST",
      affiliations: affiliationList.filter(
        (affiliation) => affiliation !== affiliationToDelete
      ),
      dateUpdated: new Date().toISOString(),
    };

    updateAffiliationList(updatedList)
      .then(() => {
        setAffiliationList(updatedList.affiliations);
        setDateUpdated(updatedList.dateUpdated);
        setSnackbarMessage("Affiliation removed successfully");
        setDeletePopupOpen(false);
        setAffiliationPopupOpen(false);
      })
      .catch((e) => {
        console.error(e);
        setSnackbarMessage("Failed to remove affiliation");
      })
      .finally(() => {
        setSnackbar(true);
      });
  };

  return (
    <>
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.affiliationsInnerContainer}>
          <Typography variant="body2" className={styles.subHeaderLabel}>
            ADD AFFILIATION
          </Typography>
          <div className={styles.addAffiliationContainer}>
            <OutlinedInput
              value={newAffiliation}
              sx={{
                ...grayBorderTextField,
                width: "100%",
              }}
              onChange={(e) => setNewAffiliation(e.target.value)}
            />

            <Button
              variant="contained"
              sx={{
                ...styledRectButton,
                ...forestGreenButton,
                marginTop: "0",
                width: "120px",
              }}
              onClick={handleAddAffiliation}>
              ADD
            </Button>
          </div>
          <Typography variant="body2" className={styles.subHeaderLabel}>
            AFFILIATIONS
          </Typography>
          <List
            sx={{
              ...listStyles,
            }}>
            {affiliationList.map((item) => (
              <ListItem
                key={item}
                divider
                sx={{
                  "&:hover": {
                    backgroundColor: "var(--ocean-green-25)",
                  },
                }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setAffiliationToDelete(item);
                      setDeletePopupOpen(true);
                      setAffiliationPopupOpen(true);
                    }}>
                    <IoCloseOutline />
                  </IconButton>
                }>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          {/* Last Updated Text */}
          <Typography
            variant="body2"
            style={{
              ...inputHeaderText,
              textAlign: "right",
              marginTop: "1.5rem",
            }}>
            Last updated:{" "}
            {DateTime.fromISO(dateUpdated)
              .toFormat("hh:mm a, MM-dd-yyyy")
              .toUpperCase() || "Unknown"}
          </Typography>

          {/* Snackbar wrapper container */}
          <div className={styles.snackbarContainer}>
            <Snackbar
              open={snackbar}
              autoHideDuration={6000}
              onClose={() => setSnackbar(false)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // Position within the right section
            >
              <Alert
                onClose={() => setSnackbar(false)}
                severity={
                  snackbarMessage.includes("successfully") ? "success" : "error"
                }>
                {snackbarMessage}
              </Alert>
            </Snackbar>
          </div>

          <DeleteAffiliationPopup
            open={deletePopupOpen}
            onClose={() => {
              setDeletePopupOpen(false);
              setAffiliationPopupOpen(false);
              setAffiliationToDelete("");
            }}
            affiliation={affiliationToDelete}
            onDelete={handleDeleteAffiliation}
          />
        </div>
      )}
    </>
  );
}

export default EditAffiliationList;
