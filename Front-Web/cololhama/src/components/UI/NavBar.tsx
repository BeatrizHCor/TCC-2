import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import theme from "../../styles/theme";

interface NavBarProps {
  isAuthenticated: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated }) => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: theme.palette.customColors?.black, padding: "5px 20px" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ContentCutIcon sx={{ color: theme.palette.customColors?.goldenBorder, marginRight: "10px" }} />
        </Box>

        <Box sx={{ display: "flex", gap: 3 }}>
          {["/servicos", "/cabelereiros", "/sobre", "/perfil"].map((route, index) => (
            <Box key={index} sx={{ position: "relative", overflow: "hidden" }}>
              <Button
                color="inherit"
                component={Link}
                to={route}
                sx={{
                  textTransform: "none",
                  color: theme.palette.customColors?.lightGray,
                  transition: "0.3s ease-in-out",
                  "&:hover": {
                    color: "#fff", 
                  },
                  "&::after": {
                    content: '""',
                    display: "block",
                    width: "0%",
                    height: "2px",
                    backgroundColor: "#fff", 
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    transition: "width 0.3s ease-in-out",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                {route === "/servicos" ? "Serviços" : route === "/cabelereiros" ? "Cabeleireiros" : route === "/perfil" ? "Perfil" : "Sobre Nós" }
              </Button>
            </Box>
          ))}
        </Box>

        {!isAuthenticated && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ position: "relative", overflow: "hidden" }}>
              <Button
                color="inherit"
                component={Link}
                to="/cadastro"
                sx={{
                  textTransform: "none",
                  color: theme.palette.customColors?.lightGray,
                  fontFamily: '"The Seasons", serif',
                  fontSize: "1rem",
                  transition: "0.3s ease-in-out",
                  "&::after": {
                    content: '""',
                    display: "block",
                    width: "0%",
                    height: "2px",
                    backgroundColor: "#fff",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    transition: "width 0.3s ease-in-out",
                  },
                  "&:hover::after": {
                    width: "100%",
                  },
                }}
              >
                Cadastre-se
              </Button>
            </Box>

            <Button
              component={Link}
              to="/login"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.customColors?.lightGray,
                borderRadius: "5px",
                padding: "5px 15px",
                fontWeight: "bold",
                textTransform: "none",
                border: `2px solid ${theme.palette.customColors?.goldenBorder}`,
                transition: "0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: theme.palette.customColors?.softPink,
                },
              }}
            >
              Login
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
