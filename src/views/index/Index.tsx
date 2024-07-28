// Index.tsx
import { WheelSettings } from "./components/WheelSettings";
import { SavedWheels } from "./components/SavedWheels";
import React from "react";
import { Wheel } from "./components/Wheel/Wheel";
import { Header } from "./components/Header";

export const Index: React.FC = () => {
  return (
    <section>
      <Header />
      <div className='wheel-of-destiny-33kl__container d-flex align-items-start justify-content-start m-auto'>
        <SavedWheels />
        <WheelSettings />
        <Wheel />
      </div>
    </section>
  );
};
