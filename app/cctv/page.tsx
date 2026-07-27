import LiveCCTVClient from "@/components/cctv/LiveCCTVClient";

export default function CCTVPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Live CCTV</h1>
      <LiveCCTVClient />
    </div>
  );
}
