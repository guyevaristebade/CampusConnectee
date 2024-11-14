import React from "react";
import { ThemeContext } from "../context";

export const useTheme = () => {
    return React.useContext(ThemeContext)
}
