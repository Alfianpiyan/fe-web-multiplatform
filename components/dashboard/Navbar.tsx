"use client";

interface NavbarProps {
  userName: string;
}

export default function Navbar({
  userName,
}: NavbarProps) {
  return (
    <header className="h-20 bg-white border-b flex items-center justify-between px-8">
      <h1 className="text-xl font-semibold">
        Dashboard
      </h1>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {userName.charAt(0)}
        </div>

        <div>
          <p className="font-medium">
            {userName}
          </p>
        </div>
      </div>
    </header>
  );
}