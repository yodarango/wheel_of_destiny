// Index.tsx
import { WheelSettings } from "./components/WheelSettings";
import { SavedWheels } from "./components/SavedWheels";
import React from "react";
import { Wheel } from "./components/Wheel/Wheel";
import { Header } from "./components/Header";
import { useWheelContext } from "../../context/WheelContextProvider";

export const Index: React.FC = () => {
  const ctx = useWheelContext();
  const isShowingWheelsList = ctx.state.isShowingWheelsList;

  return (
    <section>
      <Header
      // onShowFolders={() => setIsShowingSlicesList(!isShowingSlicesList)}
      // onRemove={() => handleRemoveWheel(currentWheelId)}
      // onCreateNew={handleCreateNewWheel}
      // wheelStatus={wheelStatus}
      // wheelTitle={wheelTitle}
      // onUpdate={handleSave}
      // onSave={handleSave}
      />
      <div className='wheel-of-destiny-33kl__container d-flex align-items-start justify-content-start m-auto'>
        {isShowingWheelsList ? (
          <SavedWheels
          // onClose={() => setIsShowingSlicesList(!isShowingSlicesList)}
          // onSelect={handleSelectASavedWheel}
          // onRemove={handleRemoveWheel}
          // slices={savedSlices}
          />
        ) : (
          <WheelSettings
          // onSlicesChange={handleUpdateSlices}
          // onOrderChange={handleOrderSlices}
          // onColorChange={handleChangeColor}
          // onTitleChange={handleWheelTitle}
          // onShuffle={handleShuffleSlices}
          // colorPaletteId={wheelThemeId}
          // slicesInput={slicesData}
          // titleInput={wheelTitle}
          />
        )}
        <Wheel
        // onUpdateWheelSpinning={setIsWheelSpinning}
        // onRemoveItem={handleRemoveItemFromList}
        // isWheelSpinning={isWheelSpinning}
        // wheelColors={wheelColors}
        // slicesData={slicesData}
        />
      </div>
    </section>
  );
};
