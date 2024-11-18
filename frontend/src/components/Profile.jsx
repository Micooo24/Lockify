import React, { useState, useEffect } from "react";
import avatar from "../assets/img/profile.png";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

export const ProfileContainer = () => {
  const getCurrentUser = () => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); 
      const userId = decodedToken?.user_id;  
      console.log("Logged in user ID:", userId);
      return userId;
    } else {
      console.log("No user is logged in.");
      return null;
    }
  };

  const [file, setFile] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const id = getCurrentUser(); 

    if (id) {
      const fetchAccountDetails = async (id) => {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/users/FetchData/${id}`
          );
          console.log("Fetched users details:", response.data.user);

          setFirstName(response.data.user.fname);
          setEmail(response.data.user.email);
          setMobile(response.data.user.phone);
          setImage(response.data.user.image);
        } catch (error) {
          console.error("Error fetching account details:", error);
        }
      };

      fetchAccountDetails(id);
    }
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fname", firstName);
    formData.append("email", email);
    formData.append("phone", mobile);
    formData.append("password", password);

    if (file) {
      formData.append('image', file);  
    } else {
      formData.append('image', 'account/default.jpg');  
    }

    update(formData).then(() => {
      toast.success("Profile updated successfully!");
      
        window.location.href = '/menu'; // Refresh the page after closing the modal
    
    }).catch((error) => {
      toast.error("Failed to update profile.");
      console.error("Update error:", error);
    });
  };

  const update = async (formData) => {
    const id = getCurrentUser();
    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/users/UpdateData/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',  
        },
      });
      console.log("Profile updated successfully:", response.data);
    }
    catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const onUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile); 
    }
  };

  return (
    <div className="p-4 w-full space-x-2">
  
      <div className="flex bg-white shadow-md rounded-lg p-4 w-full space-x-2">
        <div className="flex flex-col w-1/2 items-center">
          <h4 className="text-4xl font-bold text-center mt-4">Profile</h4>
          <span className="py-2 text-lg text-center text-gray-500">
            You can update your details.
          </span>

          <div className="flex justify-center py-4">
            <label htmlFor="profile">
              <img
                src={'http://127.0.0.1:8000/' + image || avatar}
                className="w-32 h-32 rounded-full border-2 border-gray-300"
                name="image"
                alt="avatar"
              />
            </label>
            <input onChange={onUpload} type="file" id="profile" name="image" className="hidden" />
          </div>
        </div>

        <div className="flex flex-col w-1/2">
          <form onSubmit={handleUpdate} className="py-1">
            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full gap-4">
                <input
                  className="border rounded-md p-2 w-full"
                  type="text"
                  placeholder="Name"
                  name="fname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div className="flex w-full gap-4">
                <input
                  className="border rounded-md p-2 w-full"
                  type="text"
                  name="phone"
                  placeholder="Mobile No."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                <input
                  className="border rounded-md p-2 w-full"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex w-full gap-4 items-center">
                <input
                  className="border rounded-md p-2 w-full"
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              <button
                type="submit"
                className="border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] rounded-md p-2 mt-4"
              >
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Come back later?{" "}
                <button className="text-red-500" type="button">
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const Profile = ({ closeModal }) => {
  return (
    <ProfileContainer closeModal={closeModal} />
  );
};

export default Profile;
