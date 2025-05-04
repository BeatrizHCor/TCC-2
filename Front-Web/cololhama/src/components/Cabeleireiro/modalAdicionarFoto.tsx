import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import UploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface ModalAdicionarFotoProps {
  open: boolean;
  onClose: () => void;
  mode?: "adicionar" | "editar";
  existingImage?: string | null;
  onSave?: (image: string | null) => void;
  onDelete?: () => void;
}

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#f1efeb",
  padding: theme.spacing(4),
  borderRadius: "10px",
  maxWidth: "500px",
  margin: "auto",
  outline: "none",
  textAlign: "center",
  position: "relative",
}));

const FotoPreview = styled("img")(({ theme }) => ({
  width: "120px",
  height: "120px",
  borderRadius: "6px",
  objectFit: "cover",
  marginBottom: theme.spacing(2),
  border: `2px solid ${theme.palette.customColors?.goldenBorder}`,
}));

const ModalAdicionarFoto: React.FC<ModalAdicionarFotoProps> = ({
  open,
  onClose,
  mode = "adicionar",
  existingImage = null,
  onSave,
  onDelete,
}) => {
  const theme = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(existingImage);
  const [currentDate, setCurrentDate] = useState<string>("");
  const [imagesByDate, setImagesByDate] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const mockImages: Record<string, string[]> = {
    "2024-01-01": [
      "https://i.pinimg.com/736x/68/8a/69/688a691f756e10fc873a05f936b761f4.jpg",
      "https://i.pinimg.com/736x/a9/15/d5/a915d5d4a85b87fd53b805fc95c733be.jpg",
    ],
    "2024-04-10": [
      "https://i.pinimg.com/736x/4f/4e/55/4f4e55db46f6b5396c86a17ab54db3ef.jpg",
      "https://i.pinimg.com/736x/34/45/3b/34453b660e1c7ea89ce15b8e95682fc3.jpg",
      "https://i.pinimg.com/736x/91/42/39/9142393e16c615383ad46652b91fa201.jpg",
    ],
  };

  useEffect(() => {
    if (mode === "editar") {
      setSelectedImage(existingImage);
    } else {
      setSelectedImage(null);
    }
  }, [mode, existingImage]);

  useEffect(() => {
    if (currentDate && mockImages[currentDate]) {
      setImagesByDate(mockImages[currentDate]);
      setCurrentImageIndex(0);
    } else {
      setImagesByDate([]);
    }
  }, [currentDate]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleImageNavigation = (direction: "next" | "prev") => {
    if (!imagesByDate.length) return;
    setCurrentImageIndex((prev) => {
      if (direction === "next") {
        return (prev + 1) % imagesByDate.length;
      } else {
        return (prev - 1 + imagesByDate.length) % imagesByDate.length;
      }
    });
  };

  const currentImage = imagesByDate[currentImageIndex];

  return (
    <Modal open={open} onClose={onClose}>
      <StyledBox>
        <Typography variant="h6" mb={2}>
          {mode === "adicionar" ? "Carregue sua foto" : "Editar foto"}
        </Typography>

        <Typography variant="body2" color="textSecondary" mb={3}>
          Você pode trocar a imagem ou exclui-la se necessário.
        </Typography>

        {selectedImage && (
          <FotoPreview src={selectedImage} alt="Imagem selecionada" />
        )}

        <Button
          variant="outlined"
          component="label"
          startIcon={<UploadIcon />}
          sx={{
            border: `2px dashed ${theme.palette.customColors?.goldenBorder}`,
            padding: "10px 20px",
            color: theme.palette.customColors?.softPink,
            marginBottom: 3,
          }}
        >
          Selecionar imagem
          <input type="file" accept="image/*" hidden onChange={handleUpload} />
        </Button>

        {mode === "editar" && onDelete && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            sx={{ display: "block", margin: "10px auto" }}
          >
            Excluir imagem
          </Button>
        )}

        {mode === "adicionar" && (
          <>
            <Typography variant="body1" mb={1}>
              Ou escolha uma imagem de um atendimento
            </Typography>

            <Select
              value={currentDate}
              displayEmpty
              onChange={(e) => setCurrentDate(e.target.value)}
              sx={{ backgroundColor: "#fff", mb: 2 }}
            >
              <MenuItem value="">Selecione uma data</MenuItem>
              <MenuItem value="2024-01-01">01/01/2024</MenuItem>
              <MenuItem value="2024-04-10">10/04/2024</MenuItem>
            </Select>

            {imagesByDate.length > 0 && (
              <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                <ArrowBackIosNewIcon
                  onClick={() => handleImageNavigation("prev")}
                  sx={{ cursor: "pointer", color: theme.palette.customColors?.darkGray }}
                />
                <Box
                  mx={2}
                  onClick={() => setSelectedImage(currentImage)}
                  sx={{ cursor: "pointer" }}
                >
                  <FotoPreview src={currentImage} alt="Atendimento" />
                  <Typography variant="caption">Clique para selecionar</Typography>
                </Box>
                <ArrowForwardIosIcon
                  onClick={() => handleImageNavigation("next")}
                  sx={{ cursor: "pointer", color: theme.palette.customColors?.darkGray }}
                />
              </Box>
            )}
          </>
        )}

        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              backgroundColor: theme.palette.customColors?.darkGray,
              "&:hover": { backgroundColor: theme.palette.customColors?.black },
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            startIcon={<CheckCircleIcon />}
            onClick={() => onSave?.(selectedImage)}
            sx={{
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.customColors?.goldenBorder,
              },
            }}
          >
            Salvar no portfólio
          </Button>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default ModalAdicionarFoto;
