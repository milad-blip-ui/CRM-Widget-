//import { allUsers } from '../../data';
export const fetchUsers = async (search = '') => {
  try {
    // Fetch all active users from Zoho CRM
    const response = await window.ZOHO.CRM.API.getAllUsers({Type: "ActiveUsers"});
    const allUsers = response.users || [];

    // Map the API response to a simplified user object
    const users = allUsers.map(user => ({
      id: user.id,
      name: user.full_name,
      username: user.first_name, // or any other field you'd like to use as username
      avatar: user.image_link
    }));

    // If no search term, return all users
    if (!search) return users;

    const searchTerm = search.toLowerCase();

    // Filter users based on name or username
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm) || 
      user.username.toLowerCase().includes(searchTerm)
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};


// utils/mockUsers.js
// export const fetchUsers = async (search = '') => {
//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     const users = [
//       { id: 1, name: 'Alice Johnson', username: 'alice', avatar: 'https://i.pravatar.cc/150?img=1' },
//       { id: 2, name: 'Bob Smith', username: 'bob', avatar: 'https://i.pravatar.cc/150?img=2' },
//       { id: 3, name: 'Charlie Davis', username: 'charlie', avatar: 'https://i.pravatar.cc/150?img=3' },
//       { id: 4, name: 'Dana White', username: 'dana', avatar: 'https://i.pravatar.cc/150?img=4' }
//     ];
  
//     if (!search) return users;
    
//     const searchTerm = search.toLowerCase();
//     return users.filter(user => 
//       user.name.toLowerCase().includes(searchTerm) || 
//       user.username.toLowerCase().includes(searchTerm)
//     );
//   };