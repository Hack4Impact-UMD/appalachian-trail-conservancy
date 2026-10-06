import { useState, useEffect } from "react";
import styles from "./SubComponent.module.css";
import Loading from "../../../components/LoadingScreen/Loading.tsx";
import {
  Typography,
  TextField,
  OutlinedInput,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  DataGrid,
  GridRowId,
  GridColumnMenuProps,
  GridColumnMenuContainer,
  GridFilterMenuItem,
  SortGridMenuItems,
} from "@mui/x-data-grid";
import {
  DataGridStyles,
  forestGreenButton,
  whiteButtonGrayBorder,
  styledRectButton,
  grayBorderTextField,
  inputHeaderText,
} from "../../../muiTheme.ts";
import { getAffiliationList } from "../../../backend/FirestoreCalls.ts";
import { DateTime } from "luxon";

function EditAffiliationList() {
  const [loading, setLoading] = useState<boolean>(true);

  const [snackbar, setSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // const [copied, setCopied] = useState<boolean>(false);
  // const [codeText, setCodeText] = useState<string>("XXXXX");
  // const [editedCode, setEditedCode] = useState<string>("");
  // const [isEditing, setIsEditing] = useState<boolean>(false);
  const [affiliationList, setAffiliationList] = useState<string[]>([]);
  const [newAffiliation, setNewAffiliation] = useState<string>("");
  const [dateUpdated, setDateUpdated] = useState<string>("");

  // const aList = (): any[] => {
  //   const map = affiliationList.map((affiliation) => {
  //     return { affiliation: affiliation };
  //   });
  //   return map;
  // };

  const aList = affiliationList.flatMap((affiliation) => {
    return {
      id: affiliationList.indexOf(affiliation),
      affiliation: affiliation,
    };
  });

  // DataGrid columns
  const columns = [
    { field: "affiliation", headerName: "Affiliation", width: 500 },
    // { headerName: "Affiliation", width: 200 },
  ];

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

  useEffect(() => {
    console.log(aList);
  }, [aList]);

  // const handleCodeSave = async () => {
  //   const todayDate = new Date(Date.now()).toISOString();

  //   updateRegistrationCode({
  //     code: editedCode,
  //     dateUpdated: todayDate,
  //     type: "REGISTRATIONCODE",
  //   })
  //     .then(() => {
  //       setDateUpdated(todayDate);
  //       setSnackbarMessage("Registration code updated successfully");
  //     })
  //     .catch((e) => {
  //       setSnackbarMessage("Registration code failed to update");
  //     })
  //     .finally(() => {
  //       setSnackbar(true);
  //     });
  // };

  return (
    <>
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.affiliationsInnerContainer}>
          <Typography variant="body2" className={styles.subHeaderLabel}>
            AFFILIATIONS
          </Typography>

          {/* <div className={styles.contentSection}>
            <>
              <div className={styles.innerGrid}>
                <DataGrid
                  rows={aList}
                  columns={columns}
                  rowHeight={40}
                  checkboxSelection
                  pageSize={10}
                  sx={DataGridStyles}
                  // components={{
                  //   ColumnUnsortedIcon: TbArrowsSort,
                  //   ColumnMenu: CustomColumnMenu,
                  // }}
                  // onRowClick={(row) => {
                  //   navigate(`/management/volunteer/${row.id}`);
                  // }}
                  // selectionModel={selectionModel} // Controlled selection model
                  // onSelectionModelChange={(newSelection) =>
                  //   setSelectionModel(newSelection)
                  // }
                />
              </div>
            </>
          </div> */}
          <List
            sx={{
              height: 400,
              overflowY: "auto",
              border: "2px solid var(--blue-gray)",
              borderRadius: "15px",
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
                    // onClick={() => removeItem(item)}
                  >
                    X
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

          <div className={styles.addAffiliationContainer}>
            <OutlinedInput
              value={newAffiliation}
              sx={{
                ...grayBorderTextField,
                // width: "100%",
              }}
              onChange={(e) => setNewAffiliation(e.target.value)}
              error={true}
            />

            <Button
              variant="contained"
              sx={{
                ...styledRectButton,
                ...forestGreenButton,
                marginTop: "0",
                width: "200px",
              }}
              // onClick={handleAddAffiliation} // Save the email when clicked
            >
              ADD AFFILIATION
            </Button>
          </div>
          {/* <div className={styles.buttonCodeContainer}>
            {isEditing ? (
              <>
                <Button
                  variant="contained"
                  sx={{
                    ...styledRectButton,
                    ...whiteButtonGrayBorder,
                    width: "120px",
                  }}
                  onClick={() => {
                    setEditedCode(codeText);
                    setIsEditing(false);
                  }}>
                  CANCEL
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    ...styledRectButton,
                    ...forestGreenButton,
                    width: "120px",
                  }}
                  onClick={handleCodeSave} // Save the email when clicked
                >
                  SAVE
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                sx={{
                  ...styledRectButton,
                  ...whiteButtonGrayBorder,
                  width: "120px",
                }}
                onClick={() => {
                }}>
                EDIT
              </Button>
            )} 
          </div>*/}
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
        </div>
      )}
    </>
  );
}

export default EditAffiliationList;
