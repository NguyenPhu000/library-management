import Profile from "../components/sections/Profile";
import UpdateProfileButton from "../components/sections/UpdateProfile";
const ProfilePage = () => {
  return (
    <div className="flex justify-center">
      <div>
        <Profile />
        <UpdateProfileButton />
      </div>
    </div>
  );
};

export default ProfilePage;
