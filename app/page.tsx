import GameClient from "./components/GameClient";
import Sidebar from "./components/Sidebar";

export default function HomePage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-44px)]">
      <main className="flex-1 min-w-0 flex flex-col items-center">
        <GameClient />
      </main>
      <Sidebar />
    </div>
  );
}
