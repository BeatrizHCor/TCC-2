import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

interface NavBarProps {
  isAuthenticated: boolean; // Define se o usuário está logado
}

const NavBar: React.FC<NavBarProps> = ({ isAuthenticated }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "black" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
         Cololhama
        </Typography>
        
        <Box>
          <Button color="inherit" component={Link} to="/servicos">Serviços</Button>
          <Button color="inherit" component={Link} to="/cabelereiros">Cabeleireiros</Button>
          <Button color="inherit" component={Link} to="/sobre">Sobre Nós</Button>
          
          {!isAuthenticated && (
            <>
              <Button color="inherit" component={Link} to="/cadastro">Cadastre-se</Button>
              <Button color="inherit" component={Link} to="/login">Login</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
