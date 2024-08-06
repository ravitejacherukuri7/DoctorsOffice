import Hero from "@/components/landingPage/hero/Hero";
import Benefits from "@/components/landingPage/benefits/Benefits";
import ContactForm from "@/components/landingPage/ContactForm";
import Features from "@/components/landingPage/features/Features";
import { Box, Button, Card, Typography } from "@mui/material";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useState } from "react";


function Main() {
  const domainUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

  const [loading, setLoading] = useState(false); 
  const { user, error, isLoading } = useUser();

  if (user && loading) {
    return (
      <Box>
        <Hero />
        <Benefits />
        <Features />
        <ContactForm />
      </Box>
    );
  }

  if (user) {
    return (
      <Box
        sx={{
          height: "80vh",
          width: "100%",
          p: 1,
        }}
      >
        <Box
          sx={{
            width: " 100% ",
            height: " 10vh",
            p: 1,
          }}
        >
          <Typography sx={{ color: "#ffffff" }}>
            Welcome {user.nickname}
          </Typography>
        </Box>
        <Box
          sx={{
            height: "20vh",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            
          </Box>
          <Box
            sx={{
              width: "100%",
              height: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          
          </Box>
        </Box>
        <Box sx={{ width: "100%", height: "50vh" }}>
          <>
            <Box sx={{ width: "100%", pl: "33%", pr: "33%" }}>
              <Typography color="white">
                <strong> Cookie Disclaimer</strong>
                This website uses cookies to enhance your browsing experience by
                storing information on your computer. These cookies are utilized
                to save your user settings and other relevant information such
                as: Surgery Name Surgery Address (No Street, Area, Post Code,
                Country) Surgery Phone Number Business ID Currency By continuing
                to use this website, you consent to our use of cookies.
              </Typography>
            </Box>
            <Box
              sx={{
                p: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Link href="/dashboard">
                <Button
                  sx={{
                    color: "#16140C",
                    border: "solid 1px #16140C",
                    borderRadius: "16px",
                    backgroundColor: "#f26b70",
                    height: "7vh",
                    width: "40vw",
                    p: 5,
                    mt: 5,
                    mb: 5,
                    "&:hover": {
                      backgroundColor: "#F58E92",
                    },
                  }}
                >
                  <Typography variant="h5" component="h2">
                    ENTER
                  </Typography>
                </Button>
              </Link>
            </Box>
          </>
        </Box>
      </Box>
    );
  }

  if (isLoading)
    return (
      <Box>
        <Hero />
        <Benefits />
        <Features />
        <ContactForm />
      </Box>
    );
  if (error)
    return (
      <Box>
        <Hero />
        <Benefits />
        <Features />
        <ContactForm />
      </Box>
    );

  return (
    <Box>
      <Hero />
      <Features />
      <Benefits />
      <ContactForm />
    </Box>
  );
}

export default Main;
