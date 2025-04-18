import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import logo from "../../assets/logo.svg";
interface LogoProps {
  height?: number;
  vertical?: boolean;
  hideText?: boolean;
  onlyLogo?: boolean;
}

const LogoContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const LogoIcon = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#fff",
  borderRadius: "8px",
  color: "white",
  fontWeight: 700,
  width: "36px",
  height: "36px",
  fontSize: "16px",
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginLeft: theme.spacing(1),
  color: theme.palette.primary.main,
  fontSize: "1.3rem",
  letterSpacing: "-0.5px",
}));

const Logo: React.FC<LogoProps> = ({
  height = 36,
  vertical = false,
  hideText = false,
  onlyLogo = false,
}) => {
  const scale = height / 36; // Base size is 36px

  const logoSize = {
    width: 36 * scale,
    height: 36 * scale,
    fontSize: 16 * scale,
  };

  if (onlyLogo) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100%",
          backgroundColor: "#fff",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "2.5rem",
          letterSpacing: "-1px",
          p: 2,
        }}
      >
        <img src={logo} alt="" />
      </Box>
    );
  }

  return (
    <LogoContainer sx={{ flexDirection: vertical ? "column" : "row" }}>
      <LogoIcon sx={{ ...logoSize, mb: vertical ? 1 : 0 }}>
        <img src={logo} alt="" />
      </LogoIcon>

      {!hideText && (
        <LogoText
          sx={{
            fontSize: 0.85 * height + "px",
            ml: vertical ? 0 : 1,
            mt: vertical ? 1 : 0,
          }}
        >
          PersonaVerse
        </LogoText>
      )}
    </LogoContainer>
  );
};

export default Logo;
