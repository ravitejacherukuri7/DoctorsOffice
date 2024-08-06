import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

function ContactForm() {
  return (
    <Box
      sx={{
        color: "#F6E8EA",
        pt: 10,
        pb: 5,
        pl: { xs: 0, md: 15 },
        pr: { xs: 0, md: 15 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          pb: 5,
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Typography
          sx={{ pb: 2, fontSize: { xs: 25, md: 50 } }}
          variant="h5"
          component={"h2"}
        >
          Try out the best.
        </Typography>
        <Typography sx={{ pb: 4 }} variant="subtitle1">
          {" "}
          Improve your focus on patients and start using our 
          management system today.
        </Typography>
        
        <Link href="/api/auth/login">
          <Button
            sx={{
              color: "#F6E8EA",
              backgroundColor: "#f26b70",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#F58E92",
              },
            }}
          >
            Sign-Up
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

export default ContactForm;
