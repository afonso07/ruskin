import { Canvas} from "./components";

export default function Home() {
  const IMAGE_WIDTH = 150;
  const IMAGE_HEIGHT = 150;
  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-10">

      <Canvas />
    </main>
  );
}
