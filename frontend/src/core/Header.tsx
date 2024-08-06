import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

const Header: React.FC = () => {
  const domainUrl = process.env.NEXT_PUBLIC_DOMAIN_URL;

  const { user, error, isLoading } = useUser();

  
  if (user) {
    
    const sendUserData = async () => {
      try {
        const userData = {
          name: user?.name,
          email: user?.email,
          nickname: user?.nickname,
          picture: user?.picture,
          sub: user?.sub,
          updated_at: user?.updated_at,
        };

        const response = await fetch(domainUrl + "/user/addUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });
      } catch (error) {
        console.error("-", error);
      }
    };

    
    sendUserData();
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  const handleLogout = () => {
    
  };

  return (
    <Box sx={{ display: "flex", p: 3 }}>
      <Box
        sx={{
          width: "33vw",
          display: "Flex",
          justifyContent: "start",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" color={"#F26B70"}>
          poc
        </Typography>
      </Box>
      <Box sx={{ width: "0vw" }}></Box>
      <Box sx={{ width: "66vw", display: "flex", justifyContent: "end" }}>
        
        {user ? (
          <>
            <Link href="/api/auth/logout">
              <Button
                onClick={handleLogout}
                sx={{
                  backgroundColor: "#434063",
                  color: "#f26b70",
                  border: "solid 1px #f26b70",
                  "&:hover": {
                    backgroundColor: "#2D2B42",
                    color: "#F58E92",
                  },
                }}
              >
                Logout
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/api/auth/login">
              <Button
                sx={{
                  color: "#F26B70",
                  border: "solid 1px #F26B70",
                  backgroundColor: "#2D2B42",
                  borderRadius: "16px",
                  ml: 2,
                  "&:hover": {
                    color: "#F58E92",
                    backgroundColor: "#2F2621",
                  },
                }}
              >
                Login
              </Button>
            </Link>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Header;
