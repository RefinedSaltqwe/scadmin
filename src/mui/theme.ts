import { createTheme } from "@mui/material/styles";
import { createContext, useMemo, useState } from "react";
import { Inter } from '@next/font/google';

const font = Inter({ subsets: ['latin'], weight: ['100', '200','300', '400', '500', '600', '700', '800', '900'] });
const hex2rgb = (hex: any, opacity: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const rgb = "rgb(" + r + " " + g + " " + b + " / " + opacity + "%)";

  return { rgb };
}
// color design tokens export
export const tokens = (mode:string) => ({
  ...(mode === "dark"
    ? {
        neutral: {
          100: "#a0aec0", // Grey Text
          200: "#2d3440", // Grey Button BG
          300: "#9da4ae", // Grey Text Permanent
          400: "#ffffff", // White/Black Text Alt
        },
        primary: {
          100: "#0e1320", // Main BG
          200: "#111927", // Right Sidebar BG
          300: "#1c2536", // Left Sidebar BG
        },
        grey: {
          100: "#e0e0e0",
          200: "#c2c2c2",
          300: "#a3a3a3",
          400: "#858585",
          500: "#666666",
          600: "#525252",
          700: "#3d3d3d",
          800: "#292929",
          900: "#141414",
        },
        indigoAccent: {
          100: "#e0e0fc",
          200: "#c1c2f9",
          300: "#a2a3f7",
          400: "#8385f4",
          500: "#6466f1",
          600: "#5052c1",
          700: "#3c3d91",
          800: "#282960",
          900: "#141430"
        },
        greenAccent: {
          100: "#dbf5ee",
          200: "#b7ebde",
          300: "#94e2cd",
          400: "#70d8bd",
          500: "#4cceac",
          600: "#3da58a",
          700: "#2e7c67",
          800: "#1e5245",
          900: "#0f2922",
        },
        blueAccent: {
          100: "#bbdefb",
          200: "#90caf9",
          300: "#64b5f6",
          400: "#42a5f5",
          500: "#2196f3",
          600: "#1e88e5",
          700: "#1976d2",
          800: "#1565c0",
          900: "#0d47a1",
        },
        darkBlueAccent: {
          100: "#cfd1d4",
          200: "#a0a3a9",
          300: "#70757d",
          400: "#414752",
          500: "#111927",
          600: "#0e141f",
          700: "#0a0f17",
          800: "#070a10",
          900: "#030508"
        },
      }
    : {
        neutral: {
          100: "#6c737f", // Grey Text
          200: "#e2e3e5", // Grey Button BG
          300: "#9da4ae", // Grey Text Permanent
          400: "#000000", // White/Black Text Alt
        },
        primary: {
          100: "#fcfcfc", // Main BG
          200: "#ffffff", // Right Sidebar BG
          300: "#1c2536", // Left Sidebar BG
        },
        grey: {
          100: "#141414",
          200: "#292929",
          300: "#3d3d3d",
          400: "#525252",
          500: "#666666",
          600: "#858585",
          700: "#a3a3a3",
          800: "#c2c2c2",
          900: "#e0e0e0",
        },
        indigoAccent: {
          100: "#141430",
          200: "#282960",
          300: "#3c3d91",
          400: "#5052c1",
          500: "#6466f1",
          600: "#8385f4",
          700: "#a2a3f7",
          800: "#c1c2f9",
          900: "#e0e0fc"
        },
        greenAccent: {
          100: "#0f2922",
          200: "#1e5245",
          300: "#2e7c67",
          400: "#3da58a",
          500: "#4cceac",
          600: "#70d8bd",
          700: "#94e2cd",
          800: "#b7ebde",
          900: "#dbf5ee",
        },
        blueAccent: {
          100: "#0d47a1",
          200: "#1565c0",
          300: "#1976d2",
          400: "#1e88e5",
          500: "#2196f3",
          600: "#42a5f5",
          700: "#64b5f6",
          800: "#90caf9",
          900: "#bbdefb",
        },
        darkBlueAccent: {
          100: "#030508",
          200: "#070a10",
          300: "#0a0f17",
          400: "#0e141f",
          500: "#111927",
          600: "#414752",
          700: "#70757d",
          800: "#a0a3a9",
          900: "#cfd1d4"
        },
      }),
});

// mui theme settings
export const themeSettings = (mode:any) => {
  const colors = tokens(mode);
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              dark: "#1c2536", // Left Sidebar BG
              main: colors.darkBlueAccent[500], // Right Sidebar BG
              light: "#2d3440", // Grey Button BG
              contrastText: "#ffffff", //White Permanent
            },
            secondary: {
              dark: "#252e3e", // Menu Hover
              main: colors.indigoAccent[500],
              light: "#252e3e", // Nav Hover Permanent
              contrastText: "#9da4ae", // Grey Text Permanent
            },
            text: {
              primary: "#ffffff",
              secondary: "#a0aec0", //Grey
            },
            background: {
              default: "#0e1320", // Main BG
            },
          }
        : {
          // palette values for dark mode
          primary: {
            dark: "#1c2536", // Left Sidebar BG
            main: "#ffffff", // Right Sidebar BG
            light: "#e2e3e5", // Grey Button BG
            contrastText: "#ffffff", //White Permanent
          },
          secondary: {
            dark: "#0000000a", // Menu Hover
            main: colors.indigoAccent[500],
            light: "#252e3e", // Nav Hover Permanent
            contrastText: "#9da4ae", // Grey Text Permanent
          },
          text: {
            primary: "#000000",
            secondary: "#6c737f", //Grey
          },
          background: {
            default: "#f8f9fa", // Main BG
          },
        }),
    },
    typography: {
      fontFamily: [font.style.fontFamily, "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: [font.style.fontFamily, "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: [font.style.fontFamily, "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: [font.style.fontFamily, "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: [font.style.fontFamily, "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: [font.style.fontFamily, "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: [font.style.fontFamily, "sans-serif"].join(","),
        fontSize: 14,
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 913,
        lg: 1200,
        xl: 1536,
      },
    },
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.primary[100],
          },
        },
      },
      //@ts-ignore - this isn't in the TS because DataGird is not exported from `@mui/material`
      MuiDataGrid: {
        styleOverrides: {
          row: {
            "& .MuiDataGrid-withBorderColor": {
              borderColor: `1px ${hex2rgb("#2d3440", "100").rgb} solid !important`
            },
            "&.Mui-selected": {
              backgroundColor: mode === "dark" ? colors.darkBlueAccent[500] : "#efefef",
              color: colors.grey[100],
              "&:hover": {
                backgroundColor: mode === "dark" ? colors.darkBlueAccent[500] : "#efefef",
              }
            }
          }
        }
      },
      MuiTimeline: {
        styleOverrides: {
          root: {
            // backgroundColor: 'red',
          },
        },
      },
    },
  };
};

// context for color mode
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("dark");
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
      setMode((prev: string) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return {theme, colorMode};
};