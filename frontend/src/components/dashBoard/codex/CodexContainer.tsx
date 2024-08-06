import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import CodexDrugs from "./codexDrugs/CodexDrugs";
import CodexProcedures from "./codexProcedures/CodexProcedures";
import CodexSupplies from "./codexSupplies/CodexSupplies";
import CodexClient from "./codexClient/CodexClient";

function CodexContainer() {
  const domainUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;
  const { user, error, isLoading } = useUser();

  const [activeButton, setActiveButton] = useState("drugs");

  const [display, setDisplay] = useState("drugs");

  const handleButtonClick = (location: string) => {
    setActiveButton(location);
    setDisplay(location);
  };

  const buttonStyle = (location: string) => ({
    height: "5vh",
    width: "10vw",
    backgroundColor: activeButton === location ? "#94ddde" : "#ffffff",

    "&:hover": {
      backgroundColor: "#dbeeef",
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <Box
        sx={{
          height: "100vh",
          width: "70vw",
          backgroundColor: "#eefafa",
          display: { xs: "block", md: "none" },
          p: 5,
        }}
      >
        <Typography>Please use desktop  screen</Typography>
      </Box>
      <Box
        sx={{
          height: "100vh",
          width: "85vw",
          backgroundColor: "#ffffff",
          display: { xs: "none", md: "block" },
        }}
      >
        <Box
          sx={{ height: "5vh", display: "flex", backgroundColor: "#ffffff" }}
        >
          {["drugs", "procedures", "supplies", "client"].map((location) => (
            <Box key={location} sx={buttonStyle(location)}>
              <Button
                sx={{
                  backgroundColor:
                    activeButton === location ? "#38E5E5" : "#ffffff",
                  color: activeButton === location ? "#ffffff" : "#231915",
                  height: "100%",
                  width: "100%",
                  border: "none",
                }}
                onClick={() => handleButtonClick(location)}
              >
                {location.charAt(0).toUpperCase() + location.slice(1)}
              </Button>
            </Box>
          ))}
          <Box
            sx={{ width: "55vw", height: "5vh", backgroundColor: "#ffffff" }}
          ></Box>
        </Box>
        <Box
          sx={{
            height: "95vh",
            width: "85vw",
            display: "flex",
            backgroundColor: "#eefafa",
          }}
        >
          {display === "drugs" && <CodexDrugs />}
          {display === "procedures" && <CodexProcedures />}
          {display === "supplies" && <CodexSupplies />}
          {display === "client" && <CodexClient />}
        </Box>
      </Box>
    </>
  );
}

export default CodexContainer;
