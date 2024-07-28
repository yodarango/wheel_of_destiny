import { WheelContextProvider } from "./context/WheelContextProvider";
import { Index } from "./views/index/Index";

const App = () => {
  return (
    <main className='wheel-of-destiny-33kl'>
      <WheelContextProvider>
        <Index />
      </WheelContextProvider>
    </main>
  );
};

export default App;
