// components/UserAvatar.jsx
export default function UserAvatar({ user, size = 8 }) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={`w-${size} h-${size} rounded-full object-cover border-2 border-gray-200`}
      />
    );
  }