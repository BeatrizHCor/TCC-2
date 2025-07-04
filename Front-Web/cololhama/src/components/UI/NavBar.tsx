import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import theme from "../../styles/theme";
import { AuthContext } from "../../contexts/AuthContext";
import { userTypes } from "../../models/tipo-usuario.enum";
import { Link, useNavigate } from "react-router-dom";

const NavBar: React.FC = () => {
  const { userId, userType, checkLocalStorage, doLogout } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkLocalStorage();
  }, [userType]);

  const mainRoutes = [
    { route: "/servicos", label: "Serviços" },
    { route: "/cabeleireiros", label: "Cabeleireiros" },
    { route: "/simulacao", label: "Simulação" },
  ];
  
  const clienteRoutes = [
    { route: "/historico-simulacao", label: "Histórico de Simulação" },
  ];
  
  const userRoutes = [
    { route: "/agendamentos", label: "Agendamentos" },
    { route: "/atendimentos", label: "Atendimentos" },
  ];
  
  const admRoutes = [
    { route: "/listaClientes", label: "Clientes" },
    { route: "/funcionarios", label: "Funcionarios" },
  ];
  
  const cabeleireiroRoutes = [
    { route: `/portfolio/${userId}`, label: "Portfolio" },
  ];

  const aboutRoute = { route: "/sobre", label: "Sobre Nós" };

  const handleLogout = () => {
    doLogout();
    navigate("/");
  };

  const navLinks = [
    ...mainRoutes,
    ...(userType && [userTypes.Cliente].includes(userType) ? clienteRoutes : []),
    ...(userType ? userRoutes : []),
    ...(userType && [userTypes.AdmSalao, userTypes.Funcionario, userTypes.AdmSistema].includes(userType) ? admRoutes : []),
    ...(userType && [userTypes.Cabeleireiro].includes(userType) ? cabeleireiroRoutes : []),
    aboutRoute,
  ];

  const mobileMenu = (
    <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {navLinks.map((item, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemButton component={Link} to={item.route}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {!userId ? (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/cadastro">
              <ListItemText primary="Cadastre-se" />
            </ListItemButton>
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/perfil">
              <ListItemText primary="Meu Perfil" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme.palette.customColors?.black,
        padding: { xs: "5px 0px", sm: "5px 20px" },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={() => navigate("/")}>
            <ContentCutIcon
              sx={{
                color: theme.palette.customColors?.goldenBorder,
                marginRight: "10px",
              }}
            />
          </IconButton>
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {navLinks.map((item, idx) => (
            <Box key={idx} sx={{ position: "relative", overflow: "hidden" }}>
              <Button
                color="inherit"
                component={Link}
                to={item.route}
                sx={{
                  textTransform: "none",
                  color: theme.palette.customColors?.lightGray,
                  transition: "0.3s ease-in-out",
                  "&:hover": { color: "#fff" },
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
                  "&:hover::after": { width: "100%" },
                }}
              >
                {item.label}
              </Button>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, alignItems: "center" }}>
          {!userId ? (
            <>
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
                    "&:hover::after": { width: "100%" },
                  }}
                >
                  Cadastre-se
                </Button>
              </Box>
            </>
          ) : (
            <>
              {userType === "Cliente" && (
                <Button
                  component={Link}
                  to="/perfil"
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
                  Meu Perfil
                </Button>
              )}
              <Box sx={{ position: "relative", overflow: "hidden" }}>
                {userType === "Cliente" ? (
                  <Box sx={{ position: "relative", overflow: "hidden" }}>
                    <Button
                      color="inherit"
                      onClick={handleLogout}
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
                        "&:hover::after": { width: "100%" },
                      }}
                    >
                      Sair
                    </Button>
                  </Box>
                ) : (
                  <Button
                    onClick={handleLogout}
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
                    Sair
                  </Button>
                )}
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setDrawerOpen(true)}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {mobileMenu}
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;