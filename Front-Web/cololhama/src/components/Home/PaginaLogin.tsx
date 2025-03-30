import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Paper } from '@mui/material';

const PaginaLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        // Adicione a lógica de login aqui
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            bgcolor="#f5f5f5"
        >
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    width: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant="h5" textAlign="center">
                    Login
                </Typography>
                <form onSubmit={handleLogin}>
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        required
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Login
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default PaginaLogin;
