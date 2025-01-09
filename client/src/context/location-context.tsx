import React, { createContext, useEffect, useState } from "react";
import { IChildren } from "../types";
import { useNavigate } from "react-router-dom";

interface LocationContextProps {
  isInCampus: boolean;
  setIsInCampus?: (isInCampus: boolean) => void;
}

export const LocationContext = createContext<LocationContextProps>({
  isInCampus: false,
  setIsInCampus: () => {},
});

export const LocationContextProvider = ({ children }: IChildren) => {
  const [isInCampus, setIsInCampus] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude);
          console.log(latitude === 48.8575475 && longitude === 2.3513765);

          if (latitude === 48.8575475 && longitude === 2.3513765) {
            const currentPath = window.location.pathname;
            if (currentPath === "/arrival") {
              navigate("/arrival");
            } else if (currentPath === "/departure") {
              navigate("/departure");
            }
          }
        },
        (err) => {
          navigate("/not-authorized");
        }
      );
    } else {
      navigate("/not-authorized");
    }
  }, [isInCampus, navigate]);

  return (
    <LocationContext.Provider value={{ isInCampus, setIsInCampus }}>
      {children}
    </LocationContext.Provider>
  );
};
