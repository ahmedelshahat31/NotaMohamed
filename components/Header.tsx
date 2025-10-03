
import React, { useRef } from 'react';
import { UserProfile, View } from '../types';
import { DashboardIcon, ReportsIcon } from './icons';

interface HeaderProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  activeView: View;
  setActiveView: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ profile, setProfile, activeView, setActiveView }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={profile.photo || 'https://picsum.photos/200'}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500 cursor-pointer"
              onClick={triggerFileUpload}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handlePhotoUpload}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{profile.name}</h1>
        </div>
        <nav className="flex gap-2">
          <button
            onClick={() => setActiveView(View.DASHBOARD)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === View.DASHBOARD ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'
            }`}
          >
            <DashboardIcon className="w-5 h-5" />
            <span>لوحة التحكم</span>
          </button>
          <button
            onClick={() => setActiveView(View.REPORTS)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeView === View.REPORTS ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-indigo-100'
            }`}
          >
            <ReportsIcon className="w-5 h-5" />
            <span>التقارير</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
