import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export default function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          variant="determinate"
          {...props}
          sx={{
            borderRadius: "20px", // Rounded corners for the progress bar
            height: "8px", // Adjust the height as needed
            "&.MuiLinearProgress-colorPrimary": {
              backgroundColor: "white", // Color for the remaining part of the bar
            },
            "& .MuiLinearProgress-bar": {
              borderRadius: "20px", // Rounded corners for the progress bar
              backgroundColor: "var(--forest-green)", // Color for the completed part of the bar
            },
          }}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography
          variant="body2"
          color="var(--blue-gray)"
          sx={{ fontSize: "13px" }}
        >
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}
