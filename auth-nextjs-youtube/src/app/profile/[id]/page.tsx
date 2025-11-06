export default async function UserProfile({params}: Readonly<{params: Promise<{id: string}>}>) {
  const { id } = await params;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Profile Page</h1>
      <hr className="w-full max-w-md mb-4" />
      <p className="text-4xl text-blue-600">
        User ID: <span className="bg-orange-400 rounded p-2 ml-2 text-black">{id}</span>
      </p>
    </div>
  );
}
